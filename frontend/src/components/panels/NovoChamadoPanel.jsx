import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { chamadoService } from '../../services/api';

const IconHeader = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

const IconShield = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A6B3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
);

const IconUpload = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#A0ADA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
);

const IconTime = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C6B63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

const CATEGORIAS = [
    { value: 'INFRAESTRUTURA', label: 'Infraestrutura', icon: '🏢' },
    { value: 'LIMPEZA', label: 'Limpeza', icon: '🗑️' },
    { value: 'SEGURANCA', label: 'Segurança', icon: '🛡️' },
    { value: 'PROBLEMA_PROFESSOR', label: 'Problema com Professor', icon: '👨‍🏫' },
    { value: 'PROBLEMA_ALUNO', label: 'Problema com Aluno', icon: '🧑‍🤝‍🧑' },
    { value: 'EQUIPAMENTOS', label: 'Equipamentos/Computadores', icon: '💻' },
    { value: 'INTERNET', label: 'Internet/Wi-Fi', icon: '🌐' },
    { value: 'BULLYING', label: 'Bullying', icon: '🗣️' },
    { value: 'ALIMENTACAO', label: 'Alimentação Escolar', icon: '🍎' },
    { value: 'DENUNCIA', label: 'Denúncia', icon: '📢' },
    { value: 'SUGESTAO', label: 'Sugestão', icon: '💡' },
    { value: 'OUTRO', label: 'Outro', icon: '➕' }
];

const URGENCIAS = [
    { value: 'BAIXA', label: 'Baixa', desc: 'Pode aguardar' },
    { value: 'MEDIA', label: 'Média', desc: 'Afeta parcialmente' },
    { value: 'ALTA', label: 'Alta', desc: 'Atrapalha atividades' },
    { value: 'CRITICA', label: 'Crítica', desc: 'Risco ou situação grave' }
];

const BLOCOS = ['Selecione o Bloco', 'Bloco A', 'Bloco B', 'Bloco C', 'Ginásio', 'Pátio', 'Refeitório'];
const SALAS = ['Selecione a Sala (opcional)', 'Sala 101', 'Sala 102', 'Laboratório 1', 'Biblioteca'];

export default function NovoChamadoPanel() {
    const { user } = useAuth();
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        nomeCompleto: user?.nome || '',
        telefoneContato: user?.telefone || '',
        emailContato: user?.email || '',
        anonimo: 'Não', // Padrão do wireframe
        categoria: '',
        urgencia: '',
        bloco: '',
        sala: '',
        dataOcorrencia: '',
        horarioOcorrencia: '',
        titulo: '',
        descricao: '',
        consentimentoVeridico: false,
        consentimentoPrivacidade: false
    });

    const [arquivo, setArquivo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setArquivo(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedback(null);

        if (!form.consentimentoVeridico || !form.consentimentoPrivacidade) {
            setFeedback({ type: 'error', msg: 'É necessário aceitar os termos de consentimento.' });
            return;
        }

        if (!form.titulo.trim() || !form.descricao.trim() || !form.categoria || !form.urgencia) {
            setFeedback({ type: 'error', msg: 'Por favor, preencha os campos obrigatórios (Título, Descrição, Categoria e Urgência).' });
            return;
        }

        setLoading(true);
        try {
            const payload = {
                titulo: form.titulo.trim(),
                descricao: form.descricao.trim(),
                categoria: form.categoria,
                urgencia: form.urgencia,
                anonimo: form.anonimo === 'Sim',
                emailContatoAnonimo: form.anonimo === 'Sim' ? form.emailContato : null,
                bloco: form.bloco && form.bloco !== BLOCOS[0] ? form.bloco : null,
                sala: form.sala && form.sala !== SALAS[0] ? form.sala : null,
                dataOcorrencia: form.dataOcorrencia || null,
                horarioOcorrencia: form.horarioOcorrencia ? form.horarioOcorrencia + ":00" : null, // LocalTime (HH:mm:ss)
                consentimento: true
            };

            let resposta;

            if (payload.anonimo) {
                resposta = await chamadoService.abrirAnonimo(payload);
            } else {
                resposta = await chamadoService.abrirAutenticado(payload);
            }

            if (arquivo && resposta && resposta.protocolo) {
                try {
                    await chamadoService.enviarEvidencia(resposta.protocolo, arquivo);
                } catch (fileErr) {
                    setFeedback({
                        type: 'success',
                        msg: `Chamado registrado com o Protocolo: ${resposta.protocolo}, porém houve uma falha ao anexar a imagem: ${fileErr.message}`
                    });
                    setLoading(false);
                    return;
                }
            }

            setFeedback({ type: 'success', msg: `Chamado enviado com sucesso! Guarde seu Protocolo: ${resposta.protocolo}` });

            setForm(prev => ({
                ...prev,
                anonimo: 'Não', categoria: '', urgencia: '', bloco: '', sala: '',
                dataOcorrencia: '', horarioOcorrencia: '', titulo: '', descricao: '',
                consentimentoVeridico: false, consentimientoPrivacidade: false
            }));
            setArquivo(null);

        } catch (err) {
            setFeedback({ type: 'error', msg: err.message || 'Erro ao enviar dados do chamado.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={wS.pageContainer}>
            {/* Cabeçalho Principal (Réplica do Wireframe) */}
            <div style={wS.headerSection}>
                <div style={wS.headerLeft}>
                    <IconHeader />
                    <div>
                        <h1 style={wS.pageTitle}>Abertura de Chamado Escolar</h1>
                        <p style={wS.pageSubtitle}>Utilize este formulário para registrar solicitações, problemas ou denúncias relacionados ao ambiente escolar.</p>
                    </div>
                </div>
                <div style={wS.infoCard}>
                    <IconShield />
                    <p style={wS.infoCardText}>Todas as informações são tratadas com sigilo e responsabilidade. Sua comunicação faz a diferença!</p>
                </div>
            </div>

            {feedback && (
                <div style={{ ...wS.feedback, backgroundColor: feedback.type === 'success' ? '#E2EFE7' : '#FDE8E8', color: feedback.type === 'success' ? '#1A6B3C' : '#E53E3E' }}>
                    {feedback.msg}
                </div>
            )}

            <form onSubmit={handleSubmit} style={wS.formBody}>

                {/* Linha 1: Seções 1 e 2 */}
                <div style={wS.row}>
                    {/* 1. Identificação do Usuário */}
                    <div style={{ ...wS.card, flex: 2 }}>
                        <div style={wS.cardHeader}><span style={wS.cardNumber}>1</span> Identificação do Usuário</div>
                        <div style={wS.cardBody}>
                            <div style={wS.inputRow}>
                                
                                <div style={wS.inputGroup}>
                                    <label style={wS.label}>Telefone para Contato</label>
                                    <input type="text" name="telefoneContato" value={form.telefoneContato} onChange={handleChange} placeholder="(00) 00000-0000" style={wS.input} />
                                </div>
                            </div>
                            <div style={wS.inputGroup}>
                                <label style={wS.label}>Nome Completo</label>
                                <input type="text" name="nomeCompleto" value={form.nomeCompleto} onChange={handleChange} placeholder="Digite seu nome completo" style={wS.input} />
                            </div>
                            <div style={wS.inputGroup}>
                                <label style={wS.label}>E-mail</label>
                                <input type="email" name="emailContato" value={form.emailContato} onChange={handleChange} placeholder="exemplo@email.com" style={wS.input} />
                            </div>
                        </div>
                    </div>

                    {/* 2. Opção de Anonimato */}
                    <div style={{ ...wS.card, flex: 1 }}>
                        <div style={wS.cardHeader}><span style={wS.cardNumber}>2</span> Opção de Anonimato</div>
                        <div style={wS.cardBody}>
                            <label style={wS.label}>Deseja realizar o chamado anonimamente?</label>
                            <div style={wS.radioGroup}>
                                <label style={wS.radioLabel}><input type="radio" name="anonimo" value="Sim" checked={form.anonimo === 'Sim'} onChange={handleChange} style={wS.radio} /> Sim</label>
                                <label style={wS.radioLabel}><input type="radio" name="anonimo" value="Não" checked={form.anonimo === 'Não'} onChange={handleChange} style={wS.radio} /> Não</label>
                            </div>
                            <div style={wS.alertBox}>
                                <span>🔒</span>
                                <p style={wS.alertText}>Chamados anônimos garantem a não identificação do usuário.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Linha 2: Seções 3 e 4 */}
                <div style={wS.row}>
                    {/* 3. Categoria do Chamado (Grid de Ícones) */}
                    <div style={{ ...wS.card, flex: 2 }}>
                        <div style={wS.cardHeader}><span style={wS.cardNumber}>3</span> Categoria do Chamado</div>
                        <div style={wS.cardBody}>
                            <label style={wS.label}>Categoria</label>
                            <select name="categoria" value={form.categoria} onChange={handleChange} style={{ ...wS.select, marginBottom: '16px' }}>
                                <option value="">Selecione a Categoria</option>
                                {CATEGORIAS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>

                            <div style={wS.categoryGrid}>
                                {CATEGORIAS.map(cat => (
                                    <button
                                        key={cat.value}
                                        type="button"
                                        onClick={() => setForm(prev => ({ ...prev, categoria: cat.value }))}
                                        style={{ ...wS.categoryCard, borderColor: form.categoria === cat.value ? '#1A6B3C' : '#D1E3D9', backgroundColor: form.categoria === cat.value ? '#F0F7F3' : '#FFFFFF' }}
                                    >
                                        <span style={wS.categoryIcon}>{cat.icon}</span>
                                        <span style={wS.categoryLabel}>{cat.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 4. Nível de Urgência */}
                    <div style={{ ...wS.card, flex: 1 }}>
                        <div style={wS.cardHeader}><span style={wS.cardNumber}>4</span> Nível de Urgência</div>
                        <div style={wS.cardBody}>
                            <label style={wS.label}>Nível de Urgência</label>
                            <div style={wS.urgencyList}>
                                {URGENCIAS.map(urg => (
                                    <label key={urg.value} style={wS.urgencyOption}>
                                        <input type="radio" name="urgencia" value={urg.value} checked={form.urgencia === urg.value} onChange={handleChange} style={wS.radio} />
                                        <div>
                                            <span style={wS.urgencyLabel}>{urg.label}</span>
                                            <span style={wS.urgencyDesc}>{urg.desc}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            <div style={wS.infoBox}>
                                <IconTime />
                                <p style={wS.infoBoxText}>O nível de urgência influencia tempo de resposta da equipe responsável.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Local da Ocorrência */}
                <div style={wS.card}>
                    <div style={wS.cardHeader}><span style={wS.cardNumber}>5</span> Local da Ocorrência</div>
                    <div style={wS.cardBody}>
                        <div style={wS.row4Col}>
                            <div style={wS.inputGroup}><label style={wS.label}>Bloco / Setor</label>
                                <select name="bloco" value={form.bloco} onChange={handleChange} style={wS.select}>{BLOCOS.map(b => <option key={b}>{b}</option>)}</select>
                            </div>
                            <div style={wS.inputGroup}><label style={wS.label}>Sala</label>
                                <select name="sala" value={form.sala} onChange={handleChange} style={wS.select}>{SALAS.map(s => <option key={s}>{s}</option>)}</select>
                            </div>
                            <div style={wS.inputGroup}><label style={wS.label}>Data da ocorrência</label>
                                <input type="date" name="dataOcorrencia" value={form.dataOcorrencia} onChange={handleChange} style={wS.input} />
                            </div>
                            <div style={wS.inputGroup}><label style={wS.label}>Horário aproximado</label>
                                <input type="time" name="horarioOcorrencia" value={form.horarioOcorrencia} onChange={handleChange} style={wS.input} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Linha 4: Seções 6 e 7 */}
                <div style={wS.row}>
                    {/* 6. Descrição do Problema */}
                    <div style={{ ...wS.card, flex: 2 }}>
                        <div style={wS.cardHeader}><span style={wS.cardNumber}>6</span> Descrição do Problema</div>
                        <div style={wS.cardBody}>
                            <div style={wS.inputGroup}>
                                <label style={wS.label}>Título do chamado</label>
                                <input type="text" name="titulo" value={form.titulo} onChange={handleChange} placeholder="Resuma o problema em poucas palavras" style={wS.input} maxLength={100} />
                            </div>
                            <div style={wS.inputGroup}>
                                <label style={wS.label}>Descrição detalhada</label>
                                <p style={wS.subLabel}>Descreva o problema com o número máximo de detalhes possível</p>
                                <textarea name="descricao" value={form.descricao} onChange={handleChange} rows="10" placeholder="Digite aqui..." style={wS.textarea} />
                            </div>
                        </div>
                    </div>

                    {/* 7. Evidências (Upload Area) */}
                    <div style={{ ...wS.card, flex: 1 }}>
                        <div style={wS.cardHeader}><span style={wS.cardNumber}>7</span> Evidências</div>
                        <div style={wS.cardBody}>
                            <p style={wS.subLabel}>Anexar arquivos (imagens, PDFs, vídeos curtos)</p>
                            <div style={wS.uploadZone} onClick={() => fileInputRef.current?.click()}>
                                <IconUpload />
                                <p style={wS.uploadZoneText}>Arraste e solte os arquivos aqui</p>
                                <p style={wS.uploadZoneSubText}>ou clique para selecionar</p>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*,video/*,application/pdf" />
                            </div>
                            {arquivo && <div style={wS.fileAdded}>Arquivo selecionado: {arquivo.name}</div>}
                        </div>
                    </div>
                </div>

                {/* 8. Consentimento */}
                <div style={wS.card}>
                    <div style={wS.cardHeader}><span style={wS.cardNumber}>8</span> Consentimento</div>
                    <div style={wS.cardBody}>
                        <label style={wS.checkboxLabel}>
                            <input type="checkbox" name="consentimentoVeridico" checked={form.consentimentoVeridico} onChange={handleChange} style={wS.checkbox} />
                            Declaro que as informações fornecidas são verdadeiras.
                        </label>
                        <label style={wS.checkboxLabel}>
                            <input type="checkbox" name="consentimentoPrivacidade" checked={form.consentimentoPrivacidade} onChange={handleChange} style={wS.checkbox} />
                            Estou ciente do tratamento dos dados conforme a política de privacidade.
                        </label>
                    </div>
                </div>

                {/* Botões de Ação */}
                <div style={wS.actionRow}>
                    <button type="button" style={wS.btnCancel}>❌ Cancelar</button>
                    <button type="button" style={wS.btnClear} onClick={() => setForm(prev => ({ ...prev, titulo: '', descricao: '', categoria: '', urgencia: '', bloco: '', sala: '', dataOcorrencia: '', horarioOcorrencia: '', consentimentoVeridico: false, consentimentoPrivacidade: false }))}>🗑️ Limpar formulário</button>
                    <button type="submit" disabled={loading} style={{ ...wS.btnSubmit, opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Enviando...' : '🚀 Enviar chamado'}
                    </button>
                </div>

                <p style={wS.footerText}>Após a abertura, você pode acompanhar o andamento do seu chamado pela aba de 'Meus Chamados'!</p>

            </form>
        </div>
    );
}

const wS = {
    pageContainer: {
        fontFamily: "'Inter', sans-serif",
        color: '#1A1A1A',
        paddingBottom: '40px',
    },
    headerSection: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        gap: '24px',
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        flex: 1,
    },
    pageTitle: {
        fontSize: '22px',
        fontWeight: '700',
        margin: '0 0 4px 0',
    },
    pageSubtitle: {
        fontSize: '14px',
        color: '#5C6B63',
        margin: 0,
        lineHeight: '1.5',
    },
    infoCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        border: '1.5px solid #D1E3D9',
        borderRadius: '12px',
        backgroundColor: '#FFFFFF',
        width: '300px',
    },
    infoCardText: {
        fontSize: '12px',
        color: '#2C3E35',
        margin: 0,
        lineHeight: '1.4',
    },
    formBody: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    row: {
        display: 'flex',
        gap: '24px',
        flexWrap: 'wrap',
    },
    card: {
        border: '1.5px solid #D1E3D9',
        borderRadius: '12px',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 20px',
        borderBottom: '1.5px solid #F0F7F3',
        fontSize: '16px',
        fontWeight: '700',
        color: '#1A1A1A',
        backgroundColor: '#F9FBF9',
    },
    cardNumber: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '26px',
        height: '26px',
        border: '2px solid #1A1A1A',
        borderRadius: '50%',
        fontSize: '14px',
    },
    cardBody: {
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        flex: 1,
    },
    inputRow: {
        display: 'flex',
        gap: '16px',
    },
    row4Col: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
    },
    label: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#2C3E35',
    },
    subLabel: {
        fontSize: '12px',
        color: '#5C6B63',
        margin: '-4px 0 0 0',
    },
    input: {
        padding: '10px 14px',
        border: '1.5px solid #D1E3D9',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
    },
    select: {
        padding: '10px 14px',
        border: '1.5px solid #D1E3D9',
        borderRadius: '8px',
        fontSize: '14px',
        backgroundColor: '#FFFFFF',
        outline: 'none',
        appearance: 'none',
    },
    textarea: {
        padding: '12px 14px',
        border: '1.5px solid #D1E3D9',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        resize: 'vertical',
        fontFamily: 'inherit',
    },
    radioGroup: {
        display: 'flex',
        gap: '20px',
        margin: '4px 0',
    },
    radioLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        cursor: 'pointer',
    },
    radio: {
        margin: 0,
        accentColor: '#1A6B3C',
    },
    alertBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px',
        border: '1.5px solid #D1E3D9',
        borderRadius: '8px',
        backgroundColor: '#F9FBF9',
        marginTop: '8px',
    },
    alertText: {
        fontSize: '12px',
        color: '#5C6B63',
        margin: 0,
    },
    categoryGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
    },
    categoryCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '16px',
        border: '1.5px solid #D1E3D9',
        borderRadius: '8px',
        cursor: 'pointer',
        background: 'none',
        transition: 'all 0.2s',
    },
    categoryIcon: {
        fontSize: '24px',
    },
    categoryLabel: {
        fontSize: '11px',
        fontWeight: '600',
        textAlign: 'center',
        color: '#1A1A1A',
    },
    urgencyList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    urgencyOption: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        cursor: 'pointer',
    },
    urgencyLabel: {
        fontSize: '14px',
        fontWeight: '600',
        display: 'block',
    },
    urgencyDesc: {
        fontSize: '12px',
        color: '#5C6B63',
        display: 'block',
    },
    infoBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px',
        borderRadius: '8px',
        backgroundColor: '#F0F7F3',
        marginTop: '12px',
    },
    infoBoxText: {
        fontSize: '12px',
        color: '#1A6B3C',
        margin: 0,
        lineHeight: '1.4',
    },
    uploadZone: {
        border: '2px dashed #D1E3D9',
        borderRadius: '12px',
        backgroundColor: '#F9FBF9',
        padding: '40px 20px',
        textAlign: 'center',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '8px',
    },
    uploadZoneText: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#5C6B63',
        margin: '12px 0 2px 0',
    },
    uploadZoneSubText: {
        fontSize: '12px',
        color: '#A0ADA5',
        margin: 0,
    },
    fileAdded: {
        fontSize: '12px',
        color: '#1A6B3C',
        marginTop: '8px',
        wordBreak: 'break-all',
    },
    checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '13px',
        color: '#2C3E35',
        cursor: 'pointer',
    },
    checkbox: {
        margin: 0,
        accentColor: '#1A6B3C',
    },
    actionRow: {
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        marginTop: '12px',
        flexWrap: 'wrap',
    },
    btnCancel: {
        padding: '10px 24px',
        border: '1.5px solid #D1E3D9',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        fontWeight: '600',
        fontSize: '14px',
        cursor: 'pointer',
    },
    btnClear: {
        padding: '10px 24px',
        border: '1.5px solid #D1E3D9',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        fontWeight: '600',
        fontSize: '14px',
        cursor: 'pointer',
    },
    btnSubmit: {
        padding: '10px 32px',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: '#1A6B3C',
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: '14px',
        cursor: 'pointer',
    },
    footerText: {
        textAlign: 'center',
        fontSize: '14px',
        color: '#5C6B63',
        fontWeight: '600',
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#F9FBF9',
        borderRadius: '8px',
        border: '1.5px solid #D1E3D9',
    },
    feedback: {
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1.5px solid',
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '16px',
    }
};