package com.edualerta.dto.request;

import com.edualerta.domain.enums.Role;
import jakarta.validation.constraints.NotNull;

public record AlterarRoleRequest(
        @NotNull(message = "Role é obrigatória")
        Role role
) {}
