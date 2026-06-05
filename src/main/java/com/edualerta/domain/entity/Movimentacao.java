package com.edualerta.domain.entity;

import com.edualerta.domain.enums.Status;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "movimentacoes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Movimentacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "chamado_id", nullable = false)
    private Chamado chamado;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dataHora;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status statusAnterior;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status statusNovo;

    @Column(nullable = false, length = 150)
    private String responsavel;

    @Column(columnDefinition = "TEXT")
    private String observacao;

    @PrePersist
    protected void onCreate() {
        dataHora = LocalDateTime.now();
    }
}
