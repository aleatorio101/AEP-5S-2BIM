package com.edualerta.domain.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Categoria {

    INFRAESTRUTURA("Infraestrutura", 5),
    LIMPEZA("Limpeza", 3),
    SEGURANCA("Segurança", 1),
    PROBLEMA_PROFESSOR("Problema com Professor", 3),
    PROBLEMA_ALUNO("Problema com Aluno", 3),
    EQUIPAMENTOS_COMPUTADORES("Equipamentos / Computadores", 3),
    INTERNET_WIFI("Internet / Wi-Fi", 2),
    BULLYING("Bullying", 2),
    ALIMENTACAO_ESCOLAR("Alimentação Escolar", 1),
    DENUNCIA("Denúncia", 2),
    SUGESTAO("Sugestão", 7),
    OUTRO("Outro", 5);

    private final String descricao;

    private final int prazoDias;
}
