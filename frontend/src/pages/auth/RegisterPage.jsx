import { useState } from 'react';
import { authService } from '../../services/api';
import { s } from '../../components/styles/authStyles';
import { Eye, EyeOff, AlertIcon, Spinner } from '../../components/ui/Icons';
import Brand from '../../components/ui/Brand';
import Field from '../../components/ui/Field';

const TIPOS_USUARIO = [
  { value: 'RESPONSAVEL', label: 'Responsável / Pai' },
  { value: 'ALUNO', label: 'Aluno' },
  { value: 'PROFESSOR', label: 'Professor' },
  { value: 'FUNCIONARIO', label: 'Funcionário da escola' },
  { value: 'OUTRO', label: 'Cidadão / Outro' },
];

export default function RegisterPage({ onSwitchToLogin, onSuccess }) {
  const [form, setForm] = useState({
    nome: '', email: '', senha: '', telefone: '', tipoUsuario: '',
  });
  const [erros, setErros] = useState({});
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (erros[name]) setErros(prev => ({ ...prev, [name]: '' }));
    if (erro) setErro('');
  }

  function validar() {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Nome é obrigatório.';
    if (!form.email.trim()) e.email = 'E-mail é obrigatório.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'E-mail inválido.';
    if (!form.senha) e.senha = 'Senha é obrigatória.';
    else if (form.senha.length < 6) e.senha = 'Mínimo de 6 caracteres.';
    if (!form.tipoUsuario) e.tipoUsuario = 'Selecione o tipo de usuário.';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const v = validar();
    if (Object.keys(v).length) { setErros(v); return; }

    setLoading(true);
    setErro('');
    try {
      await authService.register(form);
      onSuccess?.();
    } catch (err) {
      setErro(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <Brand />
        <h1 style={s.heading}>Criar conta</h1>
        <p style={s.subheading}>Registre-se para abrir chamados</p>

        <form onSubmit={handleSubmit} noValidate style={s.form}>
          <Field label="Nome completo" htmlFor="nome" error={erros.nome}>
            <input id="nome" name="nome" type="text" placeholder="Seu nome completo"
              value={form.nome} onChange={handleChange} autoComplete="name"
              style={{ ...s.input, ...(erros.nome ? s.inputError : {}) }} />
          </Field>

          <Field label="E-mail" htmlFor="email" error={erros.email}>
            <input id="email" name="email" type="email" placeholder="seu@email.com"
              value={form.email} onChange={handleChange} autoComplete="email"
              style={{ ...s.input, ...(erros.email ? s.inputError : {}) }} />
          </Field>

          <Field label="Senha" htmlFor="senha" error={erros.senha} hint="Mínimo 6 caracteres">
            <div style={{ position: 'relative' }}>
              <input id="senha" name="senha" type={showPass ? 'text' : 'password'} placeholder="••••••••"
                value={form.senha} onChange={handleChange} autoComplete="new-password"
                style={{ ...s.input, paddingRight: '44px', ...(erros.senha ? s.inputError : {}) }} />
              <button type="button" onClick={() => setShowPass(v => !v)} style={s.eyeBtn}
                aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}>
                {showPass ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </Field>

          <Field label="Telefone" htmlFor="telefone" hint="Opcional">
            <input id="telefone" name="telefone" type="tel" placeholder="(00) 00000-0000"
              value={form.telefone} onChange={handleChange} autoComplete="tel"
              style={s.input} />
          </Field>

          <Field label="Tipo de usuário" htmlFor="tipoUsuario" error={erros.tipoUsuario}>
            <select id="tipoUsuario" name="tipoUsuario" value={form.tipoUsuario} onChange={handleChange}
              style={{ ...s.input, ...(erros.tipoUsuario ? s.inputError : {}), color: form.tipoUsuario ? '#1A1A1A' : '#9CA3AF' }}>
              <option value="" disabled>Selecione uma opção</option>
              {TIPOS_USUARIO.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </Field>

          {erro && (
            <div style={s.errorBox} role="alert">
              <AlertIcon /><span>{erro}</span>
            </div>
          )}

          <button type="submit" disabled={loading} style={{ ...s.btnPrimary, ...(loading ? s.btnDisabled : {}) }}>
            {loading ? <Spinner /> : 'Criar conta'}
          </button>
        </form>

        <div style={s.divider}>
          <span style={s.dividerLine} />
          <span style={s.dividerText}>ou</span>
          <span style={s.dividerLine} />
        </div>

        <p style={s.loginText}>
          Já tem conta?{' '}
          <button type="button" onClick={onSwitchToLogin} style={s.linkBtn}>Entrar</button>
        </p>
      </div>
    </div>
  );
}