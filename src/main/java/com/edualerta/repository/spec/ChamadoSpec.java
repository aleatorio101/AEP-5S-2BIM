package com.edualerta.repository.spec;

import com.edualerta.domain.entity.Chamado;
import com.edualerta.domain.entity.Usuario;
import com.edualerta.domain.enums.Categoria;
import com.edualerta.domain.enums.Status;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ChamadoSpec {

    public static Specification<Chamado> filtrar(
            Usuario usuario,
            Status status,
            Categoria categoria,
            LocalDateTime inicio,
            LocalDateTime fim,
            String busca) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (usuario != null) {
                predicates.add(cb.equal(root.get("usuario"), usuario));
            }
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (categoria != null) {
                predicates.add(cb.equal(root.get("categoria"), categoria));
            }
            if (inicio != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("dataAbertura"), inicio));
            }
            if (fim != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("dataAbertura"), fim));
            }
            if (busca != null && !busca.isBlank()) {
                String like = "%" + busca.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("protocolo")), like),
                        cb.like(cb.lower(root.get("titulo")), like)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}