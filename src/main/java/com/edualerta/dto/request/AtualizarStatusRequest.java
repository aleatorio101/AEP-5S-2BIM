package com.edualerta.dto.request;

import com.edualerta.domain.enums.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AtualizarStatusRequest(

        @NotNull(message = "Novo status é obrigatório")
        Status novoStatus,

        @NotBlank(message = "Observação é obrigatória")
        String observacao
) {}
