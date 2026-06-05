package com.edualerta.dto.response;

import com.edualerta.domain.entity.Chamado;
import com.edualerta.domain.enums.Categoria;
import com.edualerta.domain.enums.Status;
import com.edualerta.domain.enums.Urgencia;

import java.time.LocalDateTime;

public record ChamadoResumoResponse(
        String protocolo,
        String titulo,
        Categoria categoria,
        String categoriaDescricao,
        Urgencia urgencia,
        Status status,
        String statusDescricao,
        LocalDateTime dataAbertura,
        boolean anonimo
) {
    public static ChamadoResumoResponse of(Chamado c) {
        return new ChamadoResumoResponse(
                c.getProtocolo(),
                c.getTitulo(),
                c.getCategoria(),
                c.getCategoria().getDescricao(),
                c.getUrgencia(),
                c.getStatus(),
                c.getStatus().getDescricao(),
                c.getDataAbertura(),
                c.isAnonimo()
        );
    }
}
