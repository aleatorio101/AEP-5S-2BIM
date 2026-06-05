package com.edualerta.dto.request;

import com.edualerta.domain.enums.Categoria;
import com.edualerta.domain.enums.Urgencia;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalTime;

public record AbrirChamadoRequest(

        @NotBlank(message = "Título é obrigatório")
        @Size(max = 100, message = "Título deve ter no máximo 100 caracteres")
        String titulo,

        @NotBlank(message = "Descrição é obrigatória")
        String descricao,

        @NotNull(message = "Categoria é obrigatória")
        Categoria categoria,

        @NotNull(message = "Urgência é obrigatória")
        Urgencia urgencia,

        boolean anonimo,

        String emailContatoAnonimo,

        String bloco,
        String sala,
        LocalDate dataOcorrencia,
        LocalTime horarioOcorrencia,

        @NotNull(message = "É necessário aceitar os termos")
        Boolean consentimento
) {}
