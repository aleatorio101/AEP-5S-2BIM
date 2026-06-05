package com.edualerta.dto.response;

import com.edualerta.domain.entity.Evidencia;

import java.time.LocalDateTime;

public record EvidenciaResponse(
        Long id,
        String nomeOriginal,
        String contentType,
        Long tamanhoBytes,
        LocalDateTime enviadoEm,
        String urlDownload
) {

    public static EvidenciaResponse of(Evidencia e, String protocolo) {
        return new EvidenciaResponse(
                e.getId(),
                e.getNomeOriginal(),
                e.getContentType(),
                e.getTamanhoBytes(),
                e.getEnviadoEm(),
                "/api/chamados/" + protocolo + "/evidencias/" + e.getId()
        );
    }
}
