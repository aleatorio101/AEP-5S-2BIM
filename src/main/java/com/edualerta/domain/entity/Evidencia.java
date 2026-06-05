package com.edualerta.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "evidencias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evidencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "chamado_id", nullable = false)
    private Chamado chamado;

    @Column(nullable = false)
    private String nomeOriginal;

    @Column(nullable = false, unique = true)
    private String nomeArmazenado;

    @Column(nullable = false, length = 100)
    private String contentType;

    private Long tamanhoBytes;

    @Column(nullable = false, updatable = false)
    private LocalDateTime enviadoEm;

    @PrePersist
    protected void onCreate() {
        enviadoEm = LocalDateTime.now();
    }
}
