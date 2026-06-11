package com.edualerta.service;

import com.edualerta.domain.entity.Usuario;
import com.edualerta.domain.enums.Role;
import com.edualerta.dto.response.UsuarioResponse;
import com.edualerta.exception.BusinessException;
import com.edualerta.exception.ResourceNotFoundException;
import com.edualerta.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.edualerta.dto.request.AtualizarMeRequest;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public Page<UsuarioResponse> listarTodos(Pageable pageable) {
        return usuarioRepository.findAll(pageable).map(UsuarioResponse::of);
    }

    @Transactional(readOnly = true)
    public UsuarioResponse buscarPorId(Long id) {
        return UsuarioResponse.of(findOrThrow(id));
    }

    @Transactional
    public UsuarioResponse alterarRole(Long id, Role novaRole) {
        Usuario usuario = findOrThrow(id);
        usuario.setRole(novaRole);
        return UsuarioResponse.of(usuarioRepository.save(usuario));
    }

    @Transactional
    public void desativar(Long id) {
        Usuario usuario = findOrThrow(id);
        if (!usuario.isAtivo()) {
            throw new BusinessException("Usuário já está desativado.");
        }
        usuario.setAtivo(false);
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void reativar(Long id) {
        Usuario usuario = findOrThrow(id);
        if (usuario.isAtivo()) {
            throw new BusinessException("Usuário já está ativo.");
        }
        usuario.setAtivo(true);
        usuarioRepository.save(usuario);
    }

    private Usuario findOrThrow(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado: " + id));
    }

    @Transactional(readOnly = true)
    public UsuarioResponse consultarMe(Usuario usuario) {
        return UsuarioResponse.of(usuario);
    }

    @Transactional
    public UsuarioResponse atualizarMe(Usuario usuario, AtualizarMeRequest request) {
        if (request.rg() != null) {
            usuario.setRg(request.rg());
        }
        if (request.telefone() != null) {
            usuario.setTelefone(request.telefone());
        }
        if (request.cep() != null) {
            usuario.setCep(request.cep());
        }
        return UsuarioResponse.of(usuarioRepository.save(usuario));
    }
}
