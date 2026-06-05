package com.edualerta.controller;

import com.edualerta.domain.entity.Usuario;
import com.edualerta.domain.enums.Categoria;
import com.edualerta.domain.enums.Status;
import com.edualerta.dto.request.AtualizarStatusRequest;
import com.edualerta.dto.response.ChamadoDetalheResponse;
import com.edualerta.dto.response.ChamadoResumoResponse;
import com.edualerta.dto.response.EstatisticasResponse;
import com.edualerta.service.ChamadoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Painel Admin / Atendente", description = "Gerenciamento de chamados — requer perfil ATENDENTE ou ADMIN")
public class AdminController {

    private final ChamadoService chamadoService;


    @GetMapping("/chamados")
    @PreAuthorize("hasAnyRole('ATENDENTE','ADMIN')")
    @Operation(summary = "Listar chamados",
               description = "Lista todos os chamados com filtros por status, categoria e data")
    public Page<ChamadoResumoResponse> listarTodos(
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Categoria categoria,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim,
            @RequestParam(required = false) String busca,
            @PageableDefault(size = 20, sort = "dataAbertura") Pageable pageable) {

        return chamadoService.listarTodos(status, categoria, inicio, fim, busca, pageable);
    }

    @GetMapping("/chamados/{protocolo}")
    @PreAuthorize("hasAnyRole('ATENDENTE','ADMIN')")
    @Operation(summary = "Detalhe do chamado",
               description = "Retorna detalhes completos incluindo histórico de movimentações")
    public ChamadoDetalheResponse detalhe(@PathVariable String protocolo) {
        return chamadoService.buscarPorProtocolo(protocolo);
    }

    @PatchMapping("/chamados/{protocolo}/status")
    @PreAuthorize("hasAnyRole('ATENDENTE','ADMIN')")
    @Operation(summary = "Atualizar status",
               description = "Move o chamado para o próximo status com obrigatória observação")
    public ChamadoDetalheResponse atualizarStatus(
            @PathVariable String protocolo,
            @Valid @RequestBody AtualizarStatusRequest request,
            @AuthenticationPrincipal Usuario usuario) {

        return chamadoService.atualizarStatus(protocolo, request, usuario.getNome());
    }


    @GetMapping("/estatisticas")
    @PreAuthorize("hasAnyRole('ATENDENTE','ADMIN')")
    @Operation(summary = "Estatísticas",
               description = "Totais por status para o dashboard administrativo")
    public EstatisticasResponse estatisticas() {
        return chamadoService.obterEstatisticas();
    }
}
