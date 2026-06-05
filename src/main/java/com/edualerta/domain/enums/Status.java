package com.edualerta.domain.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Status {

    EM_ANALISE("Em Análise"),
    EM_ATENDIMENTO("Em Atendimento"),
    AGUARDANDO_RETORNO("Aguardando Retorno"),
    RESOLVIDO("Resolvido"),
    CANCELADO("Cancelado");

    private final String descricao;
}
