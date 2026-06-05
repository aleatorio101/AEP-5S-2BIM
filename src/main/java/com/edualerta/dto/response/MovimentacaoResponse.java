package com.edualerta.dto.response;

import com.edualerta.domain.entity.Movimentacao;
import com.edualerta.domain.enums.Status;

import java.time.LocalDateTime;

public record MovimentacaoResponse(
        LocalDateTime dataHora,
        Status statusAnterior,
        String statusAnteriorDescricao,
        Status statusNovo,
        String statusNovoDescricao,
        String responsavel,
        String observacao
) {
    public static MovimentacaoResponse of(Movimentacao m) {
        return new MovimentacaoResponse(
                m.getDataHora(),
                m.getStatusAnterior(),
                m.getStatusAnterior().getDescricao(),
                m.getStatusNovo(),
                m.getStatusNovo().getDescricao(),
                m.getResponsavel(),
                m.getObservacao()
        );
    }
}
