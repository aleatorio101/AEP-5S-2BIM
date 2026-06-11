package com.edualerta.service;

import com.edualerta.domain.entity.Chamado;
import com.edualerta.domain.entity.Evidencia;
import com.edualerta.domain.entity.Movimentacao;
import com.edualerta.domain.entity.Usuario;
import com.edualerta.domain.enums.Categoria;
import com.edualerta.domain.enums.Status;
import com.edualerta.domain.enums.Urgencia;
import com.edualerta.dto.request.AbrirChamadoRequest;
import com.edualerta.dto.request.AtualizarStatusRequest;
import com.edualerta.dto.response.ChamadoDetalheResponse;
import com.edualerta.dto.response.ChamadoResumoResponse;
import com.edualerta.dto.response.EstatisticasResponse;
import com.edualerta.exception.BusinessException;
import com.edualerta.exception.ResourceNotFoundException;
import com.edualerta.repository.ChamadoRepository;
import com.edualerta.repository.spec.ChamadoSpec;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.EnumSet;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChamadoService {

    private final ChamadoRepository chamadoRepository;

    @PersistenceContext
    private EntityManager em;

    @Value("${app.upload-dir:uploads}")
    private String uploadDir;

    private static final Set<Status> STATUS_FINAIS =
            EnumSet.of(Status.RESOLVIDO, Status.CANCELADO);

    private String gerarProtocolo() {
        Long seq = ((Number) em
                .createNativeQuery("SELECT nextval('chamado_protocol_seq')")
                .getSingleResult()).longValue();
        return String.format("CH-%d-%06d", Year.now().getValue(), seq);
    }

    @Transactional
    public ChamadoDetalheResponse abrirChamado(AbrirChamadoRequest req, Usuario usuario) {
        validarConsentimento(req);

        Chamado chamado = buildChamado(req);
        chamado.setUsuario(usuario);
        chamado.setNomeRequerente(req.anonimo() ? "Anônimo" : usuario.getNome());

        adicionarMovimentacaoInicial(chamado, chamado.getNomeRequerente());
        chamadoRepository.save(chamado);

        log.info("Chamado {} aberto por {}", chamado.getProtocolo(), usuario.getEmail());
        return ChamadoDetalheResponse.of(chamado);
    }

    @Transactional
    public ChamadoDetalheResponse abrirChamadoAnonimo(AbrirChamadoRequest req) {
        validarConsentimento(req);

        Chamado chamado = buildChamado(req);
        chamado.setAnonimo(true);
        chamado.setNomeRequerente("Anônimo");
        chamado.setEmailContatoAnonimo(req.emailContatoAnonimo());

        adicionarMovimentacaoInicial(chamado, "Anônimo");
        chamadoRepository.save(chamado);

        log.info("Chamado anônimo {} criado", chamado.getProtocolo());
        return ChamadoDetalheResponse.of(chamado);
    }

    private Chamado buildChamado(AbrirChamadoRequest req) {
        return Chamado.builder()
                .protocolo(gerarProtocolo())
                .titulo(req.titulo())
                .descricao(req.descricao())
                .categoria(req.categoria())
                .urgencia(req.urgencia())
                .status(Status.EM_ANALISE)
                .anonimo(req.anonimo())
                .bloco(req.bloco())
                .sala(req.sala())
                .dataOcorrencia(req.dataOcorrencia())
                .horarioOcorrencia(req.horarioOcorrencia())
                .build();
    }

    private void adicionarMovimentacaoInicial(Chamado chamado, String responsavel) {
        Movimentacao mov = Movimentacao.builder()
                .statusAnterior(Status.EM_ANALISE)
                .statusNovo(Status.EM_ANALISE)
                .responsavel(responsavel)
                .observacao("Chamado aberto pelo requerente.")
                .build();
        chamado.adicionarMovimentacao(mov);
    }

    private void validarConsentimento(AbrirChamadoRequest req) {
        if (!Boolean.TRUE.equals(req.consentimento())) {
            throw new BusinessException("É necessário aceitar os termos para abrir um chamado.");
        }
    }

    @Transactional(readOnly = true)
    public ChamadoDetalheResponse buscarPorProtocolo(String protocolo) {
        Chamado chamado = findDetailOrThrow(protocolo);

        chamado.getHistorico().size();
        chamado.getEvidencias().size();

        return ChamadoDetalheResponse.of(chamado);
    }

    @Transactional(readOnly = true)
    public Page<ChamadoResumoResponse> listarMeusChamados(
            Usuario usuario, Status status, Categoria categoria,
            LocalDateTime inicio, LocalDateTime fim, String busca,
            Pageable pageable) {

        Specification<Chamado> spec = ChamadoSpec.filtrar(usuario, status, categoria, inicio, fim, busca);
        return chamadoRepository.findAll(spec, pageable)
                .map(ChamadoResumoResponse::of);
    }

    @Transactional(readOnly = true)
    public Page<ChamadoResumoResponse> listarTodos(
            Status status, Categoria categoria,
            LocalDateTime inicio, LocalDateTime fim, String busca,
            Pageable pageable) {

        Specification<Chamado> spec = ChamadoSpec.filtrar(null, status, categoria, inicio, fim, busca);
        return chamadoRepository.findAll(spec, pageable)
                .map(ChamadoResumoResponse::of);
    }

    @Transactional
    public ChamadoDetalheResponse atualizarStatus(
            String protocolo, AtualizarStatusRequest req, String responsavel) {

        Chamado chamado = findDetailOrThrow(protocolo);

        if (STATUS_FINAIS.contains(chamado.getStatus())) {
            throw new BusinessException(
                    "Chamado já encerrado (status: " + chamado.getStatus().getDescricao() + ").");
        }

        Movimentacao mov = Movimentacao.builder()
                .statusAnterior(chamado.getStatus())
                .statusNovo(req.novoStatus())
                .responsavel(responsavel)
                .observacao(req.observacao())
                .build();

        chamado.adicionarMovimentacao(mov);
        chamado.setStatus(req.novoStatus());

        if (STATUS_FINAIS.contains(req.novoStatus())) {
            chamado.setDataFechamento(LocalDateTime.now());
        }

        chamadoRepository.save(chamado);
        log.info("Chamado {} → {} por {}", protocolo, req.novoStatus(), responsavel);
        return ChamadoDetalheResponse.of(chamado);
    }

    @Transactional
    public void adicionarEvidencia(String protocolo, MultipartFile arquivo) throws IOException {
        Chamado chamado = findDetailOrThrow(protocolo);

        if (STATUS_FINAIS.contains(chamado.getStatus())) {
            throw new BusinessException("Não é possível adicionar evidências a um chamado encerrado.");
        }

        String extensao   = obterExtensao(arquivo.getOriginalFilename());
        String nomeArmazenado = UUID.randomUUID() + extensao;

        Path destino = Paths.get(uploadDir).resolve(nomeArmazenado);
        Files.createDirectories(destino.getParent());
        arquivo.transferTo(destino);

        Evidencia evidencia = Evidencia.builder()
                .nomeOriginal(arquivo.getOriginalFilename())
                .nomeArmazenado(nomeArmazenado)
                .contentType(arquivo.getContentType())
                .tamanhoBytes(arquivo.getSize())
                .build();

        chamado.adicionarEvidencia(evidencia);
        chamadoRepository.save(chamado);
    }

    @Transactional(readOnly = true)
    public Path resolverCaminhoEvidencia(String protocolo, Long evidenciaId) {
        Chamado chamado = findDetailOrThrow(protocolo);

        Evidencia ev = chamado.getEvidencias().stream()
                .filter(e -> e.getId().equals(evidenciaId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Evidência " + evidenciaId + " não encontrada no chamado " + protocolo));

        return Paths.get(uploadDir).resolve(ev.getNomeArmazenado());
    }

    public Evidencia buscarEvidencia(String protocolo, Long evidenciaId) {
        Chamado chamado = findDetailOrThrow(protocolo);
        return chamado.getEvidencias().stream()
                .filter(e -> e.getId().equals(evidenciaId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Evidência " + evidenciaId + " não encontrada."));
    }

    @Transactional(readOnly = true)
    public EstatisticasResponse obterEstatisticas() {
        long emAnalise     = chamadoRepository.countByStatus(Status.EM_ANALISE);
        long emAtendimento = chamadoRepository.countByStatus(Status.EM_ATENDIMENTO);
        long aguardando    = chamadoRepository.countByStatus(Status.AGUARDANDO_RETORNO);
        long resolvidos    = chamadoRepository.countByStatus(Status.RESOLVIDO);
        long cancelados    = chamadoRepository.countByStatus(Status.CANCELADO);
        long total         = chamadoRepository.count();
        long abertos       = emAnalise + emAtendimento + aguardando;
        long totalCriticos = chamadoRepository.countByUrgencia(Urgencia.CRITICA);

        return new EstatisticasResponse(
                total, emAnalise, emAtendimento, aguardando, resolvidos, cancelados, abertos, totalCriticos);
    }

    private Chamado findDetailOrThrow(String protocolo) {
        return chamadoRepository.findDetailByProtocolo(protocolo.toUpperCase())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Chamado não encontrado: " + protocolo));
    }

    private String obterExtensao(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf('.'));
    }
}
