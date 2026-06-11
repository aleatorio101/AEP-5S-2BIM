package com.edualerta.dto.request;

import com.edualerta.domain.enums.TipoUsuario;
import jakarta.validation.constraints.*;

public record RegisterRequest(

        @NotBlank(message = "Nome é obrigatório")
        String nome,

        @Email(message = "E-mail inválido")
        @NotBlank(message = "E-mail é obrigatório")
        String email,

        @NotBlank(message = "Senha é obrigatória")
        @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
        String senha,

        String telefone,

        @NotNull(message = "Tipo de usuário é obrigatório")
        TipoUsuario tipoUsuario,

        @NotBlank(message = "CPF é obrigatório")
        @Size(min = 11, max = 11, message = "CPF deve ter 11 dígitos")
        String cpf,

        @NotBlank(message = "RG é obrigatório")
        @Size(max = 20, message = "RG muito longo")
        String rg,

        @NotBlank(message = "CEP é obrigatório")
        @Size(min = 8, max = 8, message = "CEP deve ter 8 dígitos")
        String cep
) {}