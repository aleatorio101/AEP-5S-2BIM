package com.edualerta.dto.response;

import com.edualerta.domain.entity.Usuario;
import com.edualerta.domain.enums.Role;
import com.edualerta.domain.enums.TipoUsuario;

import java.time.LocalDateTime;

public record UsuarioResponse(
        Long id,
        String nome,
        String email,
        String telefone,
        String cpf,
        String rg,
        String cep,
        TipoUsuario tipoUsuario,
        Role role,
        boolean ativo,
        LocalDateTime criadoEm
) {
    public static UsuarioResponse of(Usuario u) {
        return new UsuarioResponse(
                u.getId(),
                u.getNome(),
                u.getEmail(),
                u.getTelefone(),
                u.getCpf(),
                u.getRg(),
                u.getCep(),
                u.getTipoUsuario(),
                u.getRole(),
                u.isAtivo(),
                u.getCriadoEm()
        );
    }
}