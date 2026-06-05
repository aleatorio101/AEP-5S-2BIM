package com.edualerta.repository;

import com.edualerta.domain.entity.Chamado;
import com.edualerta.domain.entity.Usuario;
import com.edualerta.domain.enums.Categoria;
import com.edualerta.domain.enums.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.edualerta.domain.enums.Urgencia;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface ChamadoRepository extends JpaRepository<Chamado, Long> {

    Optional<Chamado> findByProtocolo(String protocolo);

    @Query("SELECT c FROM Chamado c WHERE c.protocolo = :protocolo")
    Optional<Chamado> findDetailByProtocolo(@Param("protocolo") String protocolo);

    @Query("""
            SELECT c FROM Chamado c
            WHERE c.usuario = :usuario
              AND (:status   IS NULL OR c.status   = :status)
              AND (:categoria IS NULL OR c.categoria = :categoria)
              AND (:inicio   IS NULL OR c.dataAbertura >= :inicio)
              AND (:fim      IS NULL OR c.dataAbertura <= :fim)
              AND (:busca    IS NULL
                   OR LOWER(c.protocolo) LIKE LOWER(CONCAT('%', :busca, '%'))
                   OR LOWER(c.titulo)    LIKE LOWER(CONCAT('%', :busca, '%')))
            """)
    Page<Chamado> findMeusChamados(
            @Param("usuario")   Usuario usuario,
            @Param("status")    Status status,
            @Param("categoria") Categoria categoria,
            @Param("inicio")    LocalDateTime inicio,
            @Param("fim")       LocalDateTime fim,
            @Param("busca")     String busca,
            Pageable pageable);

    @Query("""
            SELECT c FROM Chamado c
            WHERE (:status   IS NULL OR c.status   = :status)
              AND (:categoria IS NULL OR c.categoria = :categoria)
              AND (:inicio   IS NULL OR c.dataAbertura >= :inicio)
              AND (:fim      IS NULL OR c.dataAbertura <= :fim)
              AND (:busca    IS NULL
                   OR LOWER(c.protocolo) LIKE LOWER(CONCAT('%', :busca, '%'))
                   OR LOWER(c.titulo)    LIKE LOWER(CONCAT('%', :busca, '%')))
            """)
    Page<Chamado> findAllFiltered(
            @Param("status")    Status status,
            @Param("categoria") Categoria categoria,
            @Param("inicio")    LocalDateTime inicio,
            @Param("fim")       LocalDateTime fim,
            @Param("busca")     String busca,
            Pageable pageable);

    long countByStatus(Status status);

    long countByUrgencia(Urgencia urgencia);
}
