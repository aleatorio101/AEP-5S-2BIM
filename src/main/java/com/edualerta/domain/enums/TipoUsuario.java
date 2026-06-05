package com.edualerta.domain.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TipoUsuario {

    ALUNO("Aluno"),
    PROFESSOR("Professor"),
    RESPONSAVEL("Responsável"),
    FUNCIONARIO("Funcionário"),
    OUTRO("Outro");

    private final String descricao;
}
