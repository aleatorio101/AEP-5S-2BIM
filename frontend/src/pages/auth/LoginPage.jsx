import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { s } from '../../components/styles/authStyles';
import { Eye, EyeOff, AlertIcon, CheckIcon, Spinner } from '../../components/ui/Icons';
import Brand from '../../components/ui/Brand';
import Field from '../../components/ui/Field';

export default function LoginPage({ onSwitchToRegister, successMessage }) {
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', senha: '' });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (erro) setErro('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.senha) {
      setErro('Preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    setErro('');
    try {
      await login(form.email, form.senha);
    } catch (err) {
      setErro(err.message || 'E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <Brand />
        <h1 style={s.heading}>Entrar na conta</h1>
        <p style={s.subheading}>Sistema de chamados escolares</p>

        <form onSubmit={handleSubmit} noValidate style={s.form}>
          <Field label="E-mail" htmlFor="email">
            <input id="email" type="email" name="email" autoComplete="email" placeholder="seu@email.com"
              value={form.email} onChange={handleChange}
              style={{ ...s.input, ...(erro ? s.inputError : {}) }} />
          </Field>

          <Field label="Senha" htmlFor="senha">
            <div style={{ position: 'relative' }}>
              <input id="senha" type={showPass ? 'text' : 'password'} name="senha" autoComplete="current-password" placeholder="••••••••"
                value={form.senha} onChange={handleChange}
                style={{ ...s.input, paddingRight: '44px', ...(erro ? s.inputError : {}) }} />
              <button type="button" onClick={() => setShowPass(v => !v)} style={s.eyeBtn}
                aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}>
                {showPass ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </Field>

          {successMessage && (
            <div style={s.successBox} role="status">
              <CheckIcon /><span>{successMessage}</span>
            </div>
          )}

          {erro && (
            <div style={s.errorBox} role="alert">
              <AlertIcon /><span>{erro}</span>
            </div>
          )}

          <button type="submit" disabled={loading} style={{ ...s.btnPrimary, ...(loading ? s.btnDisabled : {}) }}>
            {loading ? <Spinner /> : 'Entrar'}
          </button>
        </form>

        <div style={s.divider}>
          <span style={s.dividerLine} />
          <span style={s.dividerText}>ou</span>
          <span style={s.dividerLine} />
        </div>

        <p style={s.registerText}>
          Não tem conta?{' '}
          <button type="button" onClick={onSwitchToRegister} style={s.linkBtn}>Criar conta gratuita</button>
        </p>
      </div>
    </div>
  );
}