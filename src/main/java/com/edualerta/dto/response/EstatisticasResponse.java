package com.edualerta.dto.response;

public record EstatisticasResponse(
        long total,
        long emAnalise,
        long emAtendimento,
        long aguardandoRetorno,
        long resolvidos,
        long cancelados,
        long abertos,
        long totalCriticos
) {}