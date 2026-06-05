package com.edualerta.dto.response;

import com.edualerta.domain.enums.Role;
import com.edualerta.domain.enums.TipoUsuario;

public record AuthResponse(
        String token,
        String nome,
        String email,
        Role role,
        TipoUsuario tipoUsuario
) {}
