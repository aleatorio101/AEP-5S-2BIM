package com.edualerta.domain.entity;

import com.edualerta.domain.enums.Categoria;
import com.edualerta.domain.enums.Status;
import com.edualerta.domain.enums.Urgencia;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chamados")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chamado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Ex.: CH-2026-000145 */
    @Column(nullable = false, unique = true, length = 20)
    private String protocolo;

    @Column(nullable = false, length = 100)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Categoria categoria;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Urgencia urgencia;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Status status = Status.EM_ANALISE;

    private String bloco;
    private String sala;
    private LocalDate dataOcorrencia;
    private LocalTime horarioOcorrencia;


    @Column(nullable = false)
    @Builder.Default
    private boolean anonimo = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    private String emailContatoAnonimo;

    @Column(length = 150)
    private String nomeRequerente;


    @Column(nullable = false, updatable = false)
    private LocalDateTime dataAbertura;

    private LocalDateTime dataFechamento;


    @OneToMany(mappedBy = "chamado", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    @OrderBy("dataHora ASC")
    private List<Movimentacao> historico = new ArrayList<>();

    @OneToMany(mappedBy = "chamado", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Evidencia> evidencias = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        dataAbertura = LocalDateTime.now();
        if (status == null) {
            status = Status.EM_ANALISE;
        }
    }

    public void adicionarMovimentacao(Movimentacao mov) {
        mov.setChamado(this);
        historico.add(mov);
    }

    public void adicionarEvidencia(Evidencia ev) {
        ev.setChamado(this);
        evidencias.add(ev);
    }
}
