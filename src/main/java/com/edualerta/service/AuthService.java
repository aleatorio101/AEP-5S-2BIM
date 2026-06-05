package com.edualerta.service;

import com.edualerta.domain.entity.Usuario;
import com.edualerta.domain.enums.Role;
import com.edualerta.dto.request.LoginRequest;
import com.edualerta.dto.request.RegisterRequest;
import com.edualerta.dto.response.AuthResponse;
import com.edualerta.exception.BusinessException;
import com.edualerta.repository.UsuarioRepository;
import com.edualerta.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse registrar(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new BusinessException("E-mail já cadastrado: " + request.email());
        }

        Usuario usuario = Usuario.builder()
                .nome(request.nome())
                .email(request.email())
                .senha(passwordEncoder.encode(request.senha()))
                .telefone(request.telefone())
                .tipoUsuario(request.tipoUsuario())
                .role(Role.CIDADAO)
                .ativo(true)
                .build();

        usuarioRepository.save(usuario);
        String token = jwtService.gerarToken(usuario);

        return new AuthResponse(
                token,
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getRole(),
                usuario.getTipoUsuario()
        );
    }

    public AuthResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.senha())
        );

        Usuario usuario = (Usuario) auth.getPrincipal();
        String token = jwtService.gerarToken(usuario);

        return new AuthResponse(
                token,
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getRole(),
                usuario.getTipoUsuario()
        );
    }
}
