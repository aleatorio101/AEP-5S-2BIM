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

const maskCPF = (value) => value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2').substring(0, 14);
const maskCEP = (value) => value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').substring(0, 9);

export default function RegisterPage({ onSwitchToLogin, onSuccess }) {
  const [form, setForm] = useState({
    nome: '', email: '', senha: '', telefone: '', tipoUsuario: '',
    cpf: '', rg: '', cep: ''
  });

  const [erros, setErros] = useState({});
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  function handleChange(e) {
    let { name, value } = e.target;

    if (name === 'cpf') value = maskCPF(value);
    if (name === 'cep') value = maskCEP(value);
    if (name === 'rg') value = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 15);

    setForm(prev => ({ ...prev, [name]: value }));
    if (erros[name]) setErros(prev => ({ ...prev, [name]: '' }));
    if (erro) setErro('');
  }

  function validar() {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Nome é obrigatório.';
    if (!form.email.trim()) e.email = 'E-mail é obrigatório.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'E-mail inválido.';
    if (!form.senha || form.senha.length < 6) e.senha = 'Senha deve ter no mínimo 6 caracteres.';
    if (!form.tipoUsuario) e.tipoUsuario = 'Selecione o tipo de usuário.';

    const cleanCPF = form.cpf.replace(/\D/g, '');
    if (!cleanCPF) e.cpf = 'CPF é obrigatório.';
    else if (cleanCPF.length !== 11) e.cpf = 'CPF deve conter 11 dígitos.';

    if (!form.rg.trim()) e.rg = 'RG é obrigatório.';
    const cleanCEP = form.cep.replace(/\D/g, '');
    if (!cleanCEP) e.cep = 'CEP é obrigatório.';
    else if (cleanCEP.length !== 8) e.cep = 'CEP deve conter 8 dígitos.';

    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const v = validar();
    if (Object.keys(v).length) { setErros(v); return; }

    setLoading(true);
    setErro('');

    const dadosParaEnvio = {
      nome: form.nome,
      email: form.email,
      senha: form.senha,
      telefone: form.telefone.replace(/\D/g, ''),
      tipoUsuario: form.tipoUsuario,
      cpf: form.cpf.replace(/\D/g, ''),
      rg: form.rg.trim(),
      cep: form.cep.replace(/\D/g, '')
    };

    try {
      await authService.register(dadosParaEnvio);
      setErro('');
      onSuccess?.();
    } catch (err) {
      setErro(err.message || 'Erro ao criar conta.');
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
            <input id="nome" name="nome" type="text" placeholder="Seu nome completo" value={form.nome} onChange={handleChange} />
          </Field>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <Field label="CPF" htmlFor="cpf" error={erros.cpf}>
                <input id="cpf" name="cpf" type="text" placeholder="000.000.000-00" value={form.cpf} onChange={handleChange} />
              </Field>
            </div>
            <div style={{ flex: 1 }}>
              <Field label="RG" htmlFor="rg" error={erros.rg}>
                <input id="rg" name="rg" type="text" placeholder="Ex: 12345678-9" value={form.rg} onChange={handleChange} />
              </Field>
            </div>
          </div>

          <Field label="E-mail" htmlFor="email" error={erros.email}>
            <input id="email" name="email" type="email" placeholder="seu@email.com" value={form.email} onChange={handleChange} />
          </Field>

          <Field label="Senha" htmlFor="senha" error={erros.senha}>
            <div style={{ position: 'relative' }}>
              <input id="senha" name="senha" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.senha} onChange={handleChange} />
              <button type="button" onClick={() => setShowPass(v => !v)} style={s.eyeBtn}>
                {showPass ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </Field>

          <Field label="CEP" htmlFor="cep" error={erros.cep}>
            <input id="cep" name="cep" type="text" placeholder="00000-000" value={form.cep} onChange={handleChange} />
          </Field>

          <Field label="Telefone" htmlFor="telefone" hint="Opcional">
            <input id="telefone" name="telefone" type="tel" placeholder="(00) 00000-0000" value={form.telefone} onChange={handleChange} />
          </Field>

          <Field label="Tipo de usuário" htmlFor="tipoUsuario" error={erros.tipoUsuario}>
            <select id="tipoUsuario" name="tipoUsuario" value={form.tipoUsuario} onChange={handleChange}>
              <option value="" disabled>Selecione uma opção</option>
              {TIPOS_USUARIO.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </Field>

          {erro && <div style={s.errorBox}><AlertIcon /><span>{erro}</span></div>}

          <button type="submit" disabled={loading} style={{ ...s.btnPrimary, ...(loading ? s.btnDisabled : {}) }}>
            {loading ? <Spinner /> : 'Criar conta'}
          </button>
        </form>

        <p style={s.loginText}>
          Já tem conta? <button type="button" onClick={onSwitchToLogin} style={s.linkBtn}>Entrar</button>
        </p>
      </div>
    </div>
  );
}