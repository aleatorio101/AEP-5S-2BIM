package com.edualerta.controller;

import com.edualerta.domain.enums.Categoria;
import com.edualerta.domain.enums.Status;
import com.edualerta.domain.enums.TipoUsuario;
import com.edualerta.domain.enums.Urgencia;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Enums / Referência", description = "Valores de enumeração para preencher dropdowns")
public class EnumController {

    @GetMapping("/categorias")
    @Operation(summary = "Listar categorias")
    public List<Map<String, Object>> categorias() {
        return Arrays.stream(Categoria.values())
                .map(c -> Map.<String, Object>of(
                        "value", c.name(),
                        "descricao", c.getDescricao(),
                        "prazoDias", c.getPrazoDias()
                ))
                .toList();
    }

    @GetMapping("/enums/status")
    @Operation(summary = "Listar status possíveis")
    public List<Map<String, String>> status() {
        return Arrays.stream(Status.values())
                .map(s -> Map.of("value", s.name(), "descricao", s.getDescricao()))
                .toList();
    }

    @GetMapping("/enums/urgencias")
    @Operation(summary = "Listar níveis de urgência")
    public List<Map<String, String>> urgencias() {
        return Arrays.stream(Urgencia.values())
                .map(u -> Map.of(
                        "value", u.name(),
                        "descricao", u.getDescricao(),
                        "detalhe", u.getDetalhe()
                ))
                .toList();
    }

    @GetMapping("/enums/tipos-usuario")
    @Operation(summary = "Listar tipos de usuário")
    public List<Map<String, String>> tiposUsuario() {
        return Arrays.stream(TipoUsuario.values())
                .map(t -> Map.of("value", t.name(), "descricao", t.getDescricao()))
                .toList();
    }
}
