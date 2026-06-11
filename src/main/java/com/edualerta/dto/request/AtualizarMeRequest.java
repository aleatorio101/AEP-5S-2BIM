package com.edualerta.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AtualizarMeRequest(

        @Size(max = 150, message = "Nome deve ter no máximo 150 caracteres")
        String nome,

        @Size(max = 20, message = "Telefone deve ter no máximo 20 caracteres")
        String telefone,

        @Pattern(regexp = "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}|\\d{11}",
                message = "CPF inválido")
        String cpf,

        @Size(max = 20, message = "RG deve ter no máximo 20 caracteres")
        String rg,

        @Pattern(regexp = "\\d{5}-\\d{3}|\\d{8}",
                message = "CEP inválido")
        String cep
) {}