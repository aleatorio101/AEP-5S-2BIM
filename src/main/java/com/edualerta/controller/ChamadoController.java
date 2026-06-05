package com.edualerta.controller;

import com.edualerta.domain.entity.Evidencia;
import com.edualerta.domain.entity.Usuario;
import com.edualerta.domain.enums.Categoria;
import com.edualerta.domain.enums.Status;
import com.edualerta.dto.request.AbrirChamadoRequest;
import com.edualerta.dto.response.ChamadoDetalheResponse;
import com.edualerta.dto.response.ChamadoResumoResponse;
import com.edualerta.service.ChamadoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.PathResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/chamados")
@RequiredArgsConstructor
@Tag(name = "Chamados", description = "Abertura e acompanhamento de chamados")
public class ChamadoController {

    private final ChamadoService chamadoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Abrir chamado", description = "Abre um chamado vinculado ao usuário logado")
    public ChamadoDetalheResponse abrirChamado(
            @Valid @RequestBody AbrirChamadoRequest request,
            @AuthenticationPrincipal Usuario usuario) {
        return chamadoService.abrirChamado(request, usuario);
    }

    @PostMapping("/anonimo")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Abrir chamado anônimo",
               description = "Abre um chamado sem identificação. Guarde o protocolo retornado para acompanhar.")
    public ChamadoDetalheResponse abrirChamadoAnonimo(
            @Valid @RequestBody AbrirChamadoRequest request) {
        return chamadoService.abrirChamadoAnonimo(request);
    }


    @GetMapping("/meus")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Meus chamados",
               description = "Lista os chamados do usuário logado com filtros e paginação")
    public Page<ChamadoResumoResponse> meusChamados(
            @AuthenticationPrincipal Usuario usuario,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Categoria categoria,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim,
            @RequestParam(required = false) String busca,
            @PageableDefault(size = 10, sort = "dataAbertura") Pageable pageable) {

        return chamadoService.listarMeusChamados(
                usuario, status, categoria, inicio, fim, busca, pageable);
    }

    @GetMapping("/acompanhar/{protocolo}")
    @Operation(summary = "Acompanhar chamado",
               description = "Consulta qualquer chamado pelo protocolo (sem login, inclusive anônimos)")
    public ChamadoDetalheResponse acompanhar(@PathVariable String protocolo) {
        return chamadoService.buscarPorProtocolo(protocolo);
    }

    @PostMapping(value = "/{protocolo}/evidencias",
                 consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Anexar evidência", description = "Faz upload de arquivo (imagem/PDF/vídeo) para o chamado")
    public void uploadEvidencia(
            @PathVariable String protocolo,
            @RequestParam("arquivo") MultipartFile arquivo) throws IOException {
        chamadoService.adicionarEvidencia(protocolo, arquivo);
    }

    @GetMapping("/{protocolo}/evidencias/{evidenciaId}")
    @Operation(summary = "Baixar evidência", description = "Faz download do arquivo anexado")
    public ResponseEntity<Resource> downloadEvidencia(
            @PathVariable String protocolo,
            @PathVariable Long evidenciaId) {

        Evidencia ev = chamadoService.buscarEvidencia(protocolo, evidenciaId);
        Path caminho  = chamadoService.resolverCaminhoEvidencia(protocolo, evidenciaId);
        Resource resource = new PathResource(caminho);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(ev.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + ev.getNomeOriginal() + "\"")
                .body(resource);
    }
}
