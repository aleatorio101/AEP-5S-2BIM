package com.edualerta.controller;

import com.edualerta.dto.request.AlterarRoleRequest;
import com.edualerta.dto.response.UsuarioResponse;
import com.edualerta.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/usuarios")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Gestão de Usuários", description = "CRUD de usuários — requer perfil ADMIN")
public class AdminUsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    @Operation(summary = "Listar usuários", description = "Lista todos os usuários com paginação")
    public Page<UsuarioResponse> listar(
            @PageableDefault(size = 20, sort = "criadoEm") Pageable pageable) {
        return usuarioService.listarTodos(pageable);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar usuário por ID")
    public UsuarioResponse buscar(@PathVariable Long id) {
        return usuarioService.buscarPorId(id);
    }

    @PatchMapping("/{id}/role")
    @Operation(summary = "Alterar role do usuário",
               description = "Promove ou rebaixa um usuário (CIDADAO / ATENDENTE / ADMIN)")
    public UsuarioResponse alterarRole(
            @PathVariable Long id,
            @Valid @RequestBody AlterarRoleRequest request) {
        return usuarioService.alterarRole(id, request.role());
    }

    @PatchMapping("/{id}/desativar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Desativar usuário", description = "Impede o usuário de fazer login sem excluí-lo")
    public void desativar(@PathVariable Long id) {
        usuarioService.desativar(id);
    }

    @PatchMapping("/{id}/reativar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Reativar usuário")
    public void reativar(@PathVariable Long id) {
        usuarioService.reativar(id);
    }
}
