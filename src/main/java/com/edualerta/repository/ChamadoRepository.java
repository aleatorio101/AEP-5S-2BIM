package com.edualerta.repository;

import com.edualerta.domain.entity.Chamado;
import com.edualerta.domain.entity.Usuario;
import com.edualerta.domain.enums.Categoria;
import com.edualerta.domain.enums.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.edualerta.domain.enums.Urgencia;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface ChamadoRepository extends JpaRepository<Chamado, Long>,
        JpaSpecificationExecutor<Chamado> {

    Optional<Chamado> findByProtocolo(String protocolo);

    @Query("SELECT c FROM Chamado c WHERE c.protocolo = :protocolo")
    Optional<Chamado> findDetailByProtocolo(@Param("protocolo") String protocolo);

    long countByStatus(Status status);

    long countByUrgencia(Urgencia urgencia);

}

