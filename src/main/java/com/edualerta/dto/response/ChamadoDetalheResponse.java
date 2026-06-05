package com.edualerta.dto.response;

import com.edualerta.domain.entity.Chamado;
import com.edualerta.domain.enums.Categoria;
import com.edualerta.domain.enums.Status;
import com.edualerta.domain.enums.Urgencia;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record ChamadoDetalheResponse(
        String protocolo,
        String titulo,
        String descricao,
        Categoria categoria,
        String categoriaDescricao,
        int prazoDias,
        Urgencia urgencia,
        String urgenciaDescricao,
        Status status,
        String statusDescricao,
        boolean anonimo,
        String nomeRequerente,
        LocalDateTime dataAbertura,
        LocalDateTime dataFechamento,
        String bloco,
        String sala,
        LocalDate dataOcorrencia,
        LocalTime horarioOcorrencia,
        List<MovimentacaoResponse> historico,
        List<EvidenciaResponse> evidencias
) {
    public static ChamadoDetalheResponse of(Chamado c) {
        return new ChamadoDetalheResponse(
                c.getProtocolo(),
                c.getTitulo(),
                c.getDescricao(),
                c.getCategoria(),
                c.getCategoria().getDescricao(),
                c.getCategoria().getPrazoDias(),
                c.getUrgencia(),
                c.getUrgencia().getDescricao(),
                c.getStatus(),
                c.getStatus().getDescricao(),
                c.isAnonimo(),
                c.getNomeRequerente(),
                c.getDataAbertura(),
                c.getDataFechamento(),
                c.getBloco(),
                c.getSala(),
                c.getDataOcorrencia(),
                c.getHorarioOcorrencia(),
                c.getHistorico().stream().map(MovimentacaoResponse::of).toList(),
                c.getEvidencias().stream().map(e -> EvidenciaResponse.of(e, c.getProtocolo())).toList()
        );
    }
}
