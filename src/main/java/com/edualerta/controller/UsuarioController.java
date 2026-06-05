package com.edualerta.controller;

import com.edualerta.domain.entity.Usuario;
import com.edualerta.dto.request.AtualizarMeRequest;
import com.edualerta.dto.response.UsuarioResponse;
import com.edualerta.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Meus Dados", description = "Consulta e atualização dos dados do usuário autenticado")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping("/me")
    @Operation(summary = "Consultar meus dados", description = "Retorna os dados do usuário autenticado")
    public UsuarioResponse consultarMe(@AuthenticationPrincipal Usuario usuario) {
        return usuarioService.consultarMe(usuario);
    }

    @PutMapping("/me")
    @Operation(summary = "Atualizar meus dados", description = "Atualiza nome, telefone, CPF, RG e CEP do usuário autenticado")
    public UsuarioResponse atualizarMe(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody AtualizarMeRequest request) {
        return usuarioService.atualizarMe(usuario, request);
    }
}