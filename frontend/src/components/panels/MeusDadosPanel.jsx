
import React, { useState, useEffect } from 'react';
import { usuarioService } from '../../services/api';
import { dS } from '../styles/dashboardStyles';
import { Eye, EyeOff } from '../ui/Icons';

function mascararValor(valor) {
  if (!valor) return '••••••••';
  const str = String(valor).replace(/\D/g, '');
  return '•'.repeat(str.length > 0 ? str.length : 8);
}

function formatarCPF(v) {
  if (!v) return '';
  const c = String(v).replace(/\D/g, '');
  if (c.length !== 11) return c; // Retorna o que tiver de número se não tiver 11
  return c.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatarTelefone(v) {
  if (!v) return '';
  const c = String(v).replace(/\D/g, '');
  if (c.length === 11) return c.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  if (c.length === 10) return c.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  return v;
}

function formatarCEP(v) {
  if (!v) return '';
  const c = String(v).replace(/\D/g, '');
  if (c.length === 8) return c.replace(/(\d{5})(\d{3})/, '$1-$2');
  return v;
}

function mascaraTelefone(valor) {
  const c = String(valor).replace(/\D/g, '').slice(0, 11);
  if (c.length <= 2) return c;
  if (c.length <= 7) return `(${c.slice(0, 2)}) ${c.slice(2)}`;
  return `(${c.slice(0, 2)}) ${c.slice(2, 7)}-${c.slice(7)}`;
}

function mascaraCEP(valor) {
  const c = String(valor).replace(/\D/g, '').slice(0, 8);
  if (c.length <= 5) return c;
  return `${c.slice(0, 5)}-${c.slice(5)}`;
}

function getInitials(nome) {
  if (!nome) return '?';
  const parts = nome.trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function FieldRow({ label, value, visible, onToggle, editando, inputProps }) {
  const displayValue = value
    ? (visible ? value : mascararValor(value))
    : '–';

  return (
    <div style={pS.fieldRow}>
      <span style={pS.fieldLabel}>{label}</span>
      <div style={pS.fieldInputWrap}>
        {editando ? (
          <input
            {...inputProps}
            style={pS.fieldInput}
          />
        ) : (
          <div style={pS.fieldDisplay}>
            <span style={{ ...pS.fieldText, ...(value ? {} : pS.fieldEmpty) }}>
              {displayValue}
            </span>
            {value && (
              <button style={pS.eyeBtn} onClick={onToggle} type="button" title={visible ? 'Ocultar' : 'Mostrar'}>
                {visible ? <EyeOff /> : <Eye />}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const pS = {
  wrapper: {
    display: 'flex',
    gap: '48px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    minWidth: '130px',
  },
  avatarCircle: {
    width: '96px',
    height: '96px',
    borderRadius: '50%',
    backgroundColor: '#E2EFE7',
    border: '3px solid #D1E3D9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSvg: {
    display: 'block',
  },
  avatarName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1A1A1A',
    margin: 0,
    textAlign: 'center',
  },
  rightCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0px',
    minWidth: '260px',
  },
  fieldRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '10px 0',
    borderBottom: '1px solid #F0F7F3',
  },
  fieldLabel: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#2C3E35',
    width: '52px',
    flexShrink: 0,
  },
  fieldInputWrap: {
    flex: 1,
  },
  fieldDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 14px',
    border: '1.5px solid #D1E3D9',
    borderRadius: '8px',
    backgroundColor: '#F9FBF9',
    justifyContent: 'space-between',
  },
  fieldText: {
    fontSize: '14px',
    color: '#1A1A1A',
    fontWeight: '500',
    letterSpacing: '1px',
  },
  fieldEmpty: {
    color: '#A0ADA5',
    fontStyle: 'italic',
    letterSpacing: '0',
    fontWeight: '400',
  },
  fieldInput: {
    width: '100%',
    padding: '8px 14px',
    border: '1.5px solid #1A6B3C',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    color: '#1A1A1A',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  eyeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '2px',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  actionRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
    flexWrap: 'wrap',
  },
  btnAlterar: {
    padding: '9px 20px',
    backgroundColor: '#FFFFFF',
    color: '#1A6B3C',
    border: '1.5px solid #1A6B3C',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
  },
  btnSalvar: {
    padding: '9px 20px',
    backgroundColor: '#1A6B3C',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
  },
  btnCancelar: {
    padding: '9px 20px',
    backgroundColor: '#FFFFFF',
    color: '#5C6B63',
    border: '1.5px solid #D1E3D9',
    borderRadius: '8px',
    fontWeight: '500',
    cursor: 'pointer',
    fontSize: '14px',
  },
  feedbackBox: (type) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    backgroundColor: type === 'success' ? '#F0F7F3' : '#FEF2F2',
    border: `1px solid ${type === 'success' ? '#D1E3D9' : '#FECACA'}`,
    borderRadius: '8px',
    fontSize: '13px',
    color: type === 'success' ? '#1A6B3C' : '#C0392B',
    fontWeight: '500',
    marginBottom: '20px',
  }),
};

export default function MeusDadosPanel() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [form, setForm] = useState({});

  const [visivel, setVisivel] = useState({ cpf: false, rg: false, telefone: false, cep: false });

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      try {
        const d = await usuarioService.me();
        setUsuario(d);
        setForm({
          cpf: d.cpf || d.documento || '',
          rg: d.rg || d.identidade || '',
          telefone: d.telefone || d.phone || d.celular || '',
          cep: d.cep || d.zipCode || d.zip || '',
        });
      } catch (err) {
        setFeedback({ type: 'error', msg: 'Não foi possível carregar seus dados.' });
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  function toggle(campo) {
    setVisivel((v) => ({ ...v, [campo]: !v[campo] }));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === 'telefone') { setForm((f) => ({ ...f, telefone: mascaraTelefone(value) })); return; }
    if (name === 'cep') { setForm((f) => ({ ...f, cep: mascaraCEP(value) })); return; }
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleCancelar() {
    setEditando(false);
    setFeedback(null);
    setForm({
      cpf: usuario.cpf || usuario.documento || '',
      rg: usuario.rg || usuario.identidade || '',
      telefone: usuario.telefone || usuario.celular || '',
      cep: usuario.cep || usuario.zipCode || '',
    });
  }

  async function handleSalvar() {
    setSalvando(true);
    setFeedback(null);
    try {
      const atualizado = await usuarioService.atualizarMe({
        nome: usuario.nome,
        rg: form.rg,
        telefone: form.telefone,
        cep: form.cep,
      });
      setUsuario((prev) => ({ ...prev, ...atualizado }));
      setEditando(false);
      setFeedback({ type: 'success', msg: 'Dados atualizados com sucesso!' });
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message || 'Erro ao salvar alterações.' });
    } finally {
      setSalvando(false);
    }
  }

  if (loading) {
    return <div style={dS.container}><p style={dS.loadingText}>Carregando seus dados...</p></div>;
  }

  const displayCPF = form.cpf ? formatarCPF(form.cpf) : '';
  const displayRG = form.rg ? String(form.rg).trim() : '';
  const displayTEL = form.telefone ? formatarTelefone(form.telefone) : '';
  const displayCEP = form.cep ? formatarCEP(form.cep) : '';

  return (
    <div style={dS.container}>
      <div style={dS.headerRow}>
        <div>
          <h1 style={dS.title}>Meus Dados</h1>
          <p style={dS.subtitle}>Visualize e atualize suas informações cadastrais</p>
        </div>
      </div>

      {feedback && (
        <div style={pS.feedbackBox(feedback.type)}>
          <span>{feedback.type === 'success' ? '✅' : '⚠️'}</span>
          {feedback.msg}
        </div>
      )}

      <div style={pS.wrapper}>
        {/* Coluna esquerda — avatar + nome */}
        <div style={pS.leftCol}>
          <div style={pS.avatarCircle}>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={pS.avatarSvg}>
              <circle cx="28" cy="22" r="12" fill="#5C8A6B" />
              <ellipse cx="28" cy="46" rx="18" ry="10" fill="#5C8A6B" />
            </svg>
          </div>
          <p style={pS.avatarName}>{usuario?.nome?.split(' ')[0] || 'Usuário'}</p>
        </div>

        {/* Coluna direita — campos */}
        <div style={pS.rightCol}>
          <FieldRow
            label="CPF"
            value={displayCPF}
            visible={visivel.cpf}
            onToggle={() => toggle('cpf')}
            editando={false} 
          />
          <FieldRow
            label="RG"
            value={displayRG}
            visible={visivel.rg}
            onToggle={() => toggle('rg')}
            editando={editando}
            inputProps={{ name: 'rg', value: form.rg, onChange: handleChange, placeholder: 'Número do RG', inputMode: 'numeric' }}
          />
          <FieldRow
            label="TEL"
            value={displayTEL}
            visible={visivel.telefone}
            onToggle={() => toggle('telefone')}
            editando={editando}
            inputProps={{ name: 'telefone', value: form.telefone, onChange: handleChange, placeholder: '(00) 00000-0000', inputMode: 'numeric' }}
          />
          <FieldRow
            label="CEP"
            value={displayCEP}
            visible={visivel.cep}
            onToggle={() => toggle('cep')}
            editando={editando}
            inputProps={{ name: 'cep', value: form.cep, onChange: handleChange, placeholder: '00000-000', inputMode: 'numeric', maxLength: 9 }}
          />

          <div style={pS.actionRow}>
            {!editando ? (
              <button style={pS.btnAlterar} onClick={() => { setEditando(true); setFeedback(null); }}>
                Alterar dados
              </button>
            ) : (
              <>
                <button
                  style={{ ...pS.btnSalvar, ...(salvando ? { opacity: 0.6, cursor: 'not-allowed' } : {}) }}
                  onClick={handleSalvar}
                  disabled={salvando}
                >
                  {salvando ? 'Salvando...' : 'Salvar alterações'}
                </button>
                <button style={pS.btnCancelar} onClick={handleCancelar} disabled={salvando}>
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}