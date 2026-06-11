import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { s } from '../../components/styles/authStyles';
import { Eye, EyeOff, AlertIcon, CheckIcon, Spinner } from '../../components/ui/Icons';
import Brand from '../../components/ui/Brand';
import Field from '../../components/ui/Field';

export default function LoginPage({ onSwitchToRegister, successMessage, onAcessarAnonimo, onBuscarProtocolo }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [protocoloBusca, setProtocoloBusca] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      await login(email, senha);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        setErro('Esta conta foi desativada pelo administrador.');
      } else {
        setErro('E-mail ou senha incorretos. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBuscarProtocolo = (e) => {
    e.preventDefault();
    if (!protocoloBusca.trim()) return;
    if (onBuscarProtocolo) onBuscarProtocolo(protocoloBusca.trim());
  };

  return (
    <div style={s.page || s.container || {}}>
      <div style={s.card || {}}>
        <Brand />
        
        {successMessage && (
          <div style={{ ...s.errorBox, backgroundColor: '#E2EFE7', color: '#1A6B3C', borderColor: '#D1E3D9', display: 'flex', gap: '8px', alignItems: 'center', padding: '10px', borderRadius: '6px', marginBottom: '15px' }} role="alert">
            <CheckIcon /><span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={s.form || {}}>
          <Field label="E-mail" htmlFor="email">
            <input 
              id="email" 
              type="email" 
              placeholder="seu@email.com"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              style={s.input} 
            />
          </Field>

          <Field label="Senha" htmlFor="senha">
            <div style={{ position: 'relative' }}>
              <input 
                id="senha" 
                type={showPass ? 'text' : 'password'} 
                placeholder="••••••••"
                value={senha} 
                onChange={(e) => setSenha(e.target.value)} 
                required
                style={{ ...s.input, paddingRight: '44px' }} 
              />
              <button type="button" onClick={() => setShowPass(v => !v)} style={s.eyeBtn} aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}>
                {showPass ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </Field>

          {erro && (
            <div style={s.errorBox || {}} role="alert">
              <AlertIcon /><span>{erro}</span>
            </div>
          )}

          <button type="submit" disabled={loading} style={{ ...s.btnPrimary, ...(loading ? s.btnDisabled : {}) }}>
            {loading ? <Spinner /> : 'Entrar'}
          </button>
        </form>

        <div style={s.divider || { display: 'flex', alignItems: 'center', margin: '20px 0' }}>
          <span style={s.dividerLine || { flex: 1, height: '1px', backgroundColor: '#E2EFE7' }} />
          <span style={s.dividerText || { padding: '0 10px', color: '#A3B8AC', fontSize: '12px' }}>ou</span>
          <span style={s.dividerLine || { flex: 1, height: '1px', backgroundColor: '#E2EFE7' }} />
        </div>

        <p style={s.loginText || { textAlign: 'center', fontSize: '14px' }}>
          Não tem conta?{' '}
          <button type="button" onClick={onSwitchToRegister} style={s.linkBtn}>Cadastre-se</button>
        </p>
        </div>
      </div>
  );
}