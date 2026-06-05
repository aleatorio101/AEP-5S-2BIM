package com.edualerta.domain.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Urgencia {

    BAIXA("Baixa", "Pode aguardar"),
    MEDIA("Média", "Afeta parcialmente"),
    ALTA("Alta", "Atrapalha atividades"),
    CRITICA("Crítica", "Risco ou situação grave");

    private final String descricao;
    private final String detalhe;
}
