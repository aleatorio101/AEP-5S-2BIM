package com.edualerta.service;

import com.edualerta.domain.entity.Usuario;
import com.edualerta.domain.enums.Role;
import com.edualerta.domain.enums.TipoUsuario;
import com.edualerta.dto.request.RegisterRequest;
import com.edualerta.dto.response.AuthResponse;
import com.edualerta.exception.BusinessException;
import com.edualerta.repository.UsuarioRepository;
import com.edualerta.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock UsuarioRepository usuarioRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtService jwtService;
    @Mock AuthenticationManager authenticationManager;

    @InjectMocks AuthService authService;

    private RegisterRequest validRequest;

    @BeforeEach
    void setUp() {
        validRequest = new RegisterRequest(
                "João Silva", "joao@escola.com", "senha123",
                "(44) 99999-9999", TipoUsuario.ALUNO, null, null, null);
    }

    @Test
    @DisplayName("Deve registrar novo usuário com role CIDADAO")
    void deveRegistrarNovoUsuario() {
        given(usuarioRepository.existsByEmail(anyString())).willReturn(false);
        given(passwordEncoder.encode(anyString())).willReturn("$2a$10$hash");
        given(usuarioRepository.save(any(Usuario.class))).willAnswer(inv -> inv.getArgument(0));
        given(jwtService.gerarToken(any())).willReturn("jwt.token.here");

        AuthResponse response = authService.registrar(validRequest);

        assertThat(response.token()).isEqualTo("jwt.token.here");
        assertThat(response.email()).isEqualTo("joao@escola.com");
        assertThat(response.role()).isEqualTo(Role.CIDADAO);
    }

    @Test
    @DisplayName("Deve lançar BusinessException quando e-mail já cadastrado")
    void deveLancarExcecaoEmailDuplicado() {
        given(usuarioRepository.existsByEmail(anyString())).willReturn(true);

        assertThatThrownBy(() -> authService.registrar(validRequest))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("E-mail já cadastrado");
    }
}
