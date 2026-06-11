import React, { useState } from 'react';
import { dS } from '../styles/dashboardStyles';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C6B63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const ChevronDown = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2C3E35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const ChevronUp = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A6B3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

const FAQ_DATA = [
  { 
    id: 1, 
    cat: 'outros',
    q: "O que é o EduAlerta?", 
    a: "O EduAlerta é uma plataforma digital voltada para a segurança e comunicação escolar, permitindo que a comunidade acadêmica e cidadãos colaborem ativamente enviando chamados e relatos de melhorias ou ocorrências." 
  },
  { 
    id: 2, 
    cat: 'conta',
    q: "Quem pode utilizar o EduAlerta?", 
    a: "A plataforma pode ser utilizada por Alunos, Professores, Funcionários, Responsáveis legais e qualquer Cidadão que queira colaborar com os alertas de segurança escolar." 
  },
  { 
    id: 3, 
    cat: 'chamados',
    q: "Como abrir um chamado?", 
    a: "Para abrir um chamado, acesse o menu \"Novo Chamado\", preencha todas as informações solicitadas, anexe evidências se necessário e clique em \"Enviar chamado\". Você receberá um protocolo para acompanhar o andamento.", 
    dica: "Quanto mais detalhes forem informados, mais rápido será o atendimento pela equipe gestora." 
  },
  { 
    id: 4, 
    cat: 'chamados',
    q: "Como acompanhar o andamento do meu chamado?", 
    a: "Você pode acompanhar todo o histórico, atualizações, respostas de moderadores e evolução de suas postagens acessando diretamente a opção \"Meus Chamados\" no menu lateral esquerdo." 
  },
  { 
    id: 5, 
    cat: 'privacidade',
    q: "Posso abrir um chamado anonimamente?", 
    a: "Sim. O EduAlerta permite que você envie relatos sob completo anonimato se preferir resguardar a sua identidade perante a comunidade escolar." 
  },
  { 
    id: 6, 
    cat: 'chamados',
    q: "Quais tipos de chamado posso registrar?", 
    a: "É possível registrar denúncias de bullying, ameaças de infraestrutura física, problemas estruturais, vandalismo, sugestões e outras demandas ligadas diretamente à segurança e ao convívio do ambiente escolar." 
  },
  { 
    id: 7, 
    cat: 'privacidade',
    q: "Como funciona o anonimato?", 
    a: "Ao selecionar a opção de anonimato, nenhuma informação pessoal (como seu nome, e-mail ou documento de identificação) será atrelada à visualização pública ou aos relatórios encaminhados à gestão.",
    dica: "Mesmo em chamados anônimos, os anexos enviados não devem conter dados que revelem quem você é."
  },
  { 
    id: 8, 
    cat: 'conta',
    q: "Onde encontro minhas informações cadastrais?", 
    a: "Seus dados de perfil, telefone, RG, CPF e informações correlatas podem ser acessadas, conferidas e alteradas a qualquer momento no menu \"Meus Dados\"." 
  },
  { 
    id: 9, 
    cat: 'privacidade',
    q: "O EduAlerta é seguro?", 
    a: "Sim. Utilizamos criptografia de ponta no armazenamento do banco de dados e controle estrito de autenticação por tokens de acesso (JWT) para garantir a total integridade de todas as informações trafegadas." 
  },
  {
    id: 10,
    cat: 'chamados',
    q: "Posso editar ou excluir um chamado após o envio?",
    a: "Uma vez enviado, o chamado passa por triagem automática e não pode ser editado pelo usuário para preservar a integridade do processo de auditoria. Caso precise adicionar informações, você poderá usar o campo de réplicas quando disponível."
  },
  {
    id: 11,
    cat: 'conta',
    q: "Esqueci minha senha de acesso, o que fazer?",
    a: "Na tela inicial de login, clique na opção 'Esqueci minha senha'. Insira o e-mail cadastrado na sua conta para receber um link de redefinição segura de credenciais."
  },
  {
    id: 12,
    cat: 'outros',
    q: "Como as escolas recebem os alertas gerados?",
    a: "A secretaria de educação e a direção da instituição escolar correspondente possuem painéis administrativos exclusivos onde são notificados em tempo real sobre cada chamado triado para a unidade deles.",
    dica: "Certifique-se de selecionar a escola correta no formulário para acelerar as providências."
  }
];

const CATEGORIES = [
  { id: 'todas', label: 'Todas', icon: '⬜' },
  { id: 'chamados', label: 'Chamados', icon: '📋' },
  { id: 'conta', label: 'Conta e Acesso', icon: '👤' },
  { id: 'privacidade', label: 'Privacidade', icon: '🔒' },
  { id: 'outros', label: 'Outros', icon: '💬' }
];

export default function AjudaPanel() {
  const [search, setSearch] = useState('');
  const [categoryActive, setCategoryActive] = useState('todas');
  const [openItem, setOpenItem] = useState(3); // Mantém o item 3 aberto inicialmente conforme o wireframe

  const toggleItem = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  const filteredFaqs = FAQ_DATA.filter(faq => {
    const matchesCategory = categoryActive === 'todas' || faq.cat === categoryActive;
    
    const matchesSearch = faq.q.toLowerCase().includes(search.toLowerCase()) || 
                          faq.a.toLowerCase().includes(search.toLowerCase());
                          
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={dS.container}>
      <div style={dS.headerRow}>
        <div>
          <h1 style={dS.title}>Perguntas e Respostas (FAQ)</h1>
          <p style={dS.subtitle}>Encontre respostas para as dúvidas mais comuns sobre o EduAlerta.</p>
        </div>
      </div>

      <div style={styles.searchContainer}>
        <div style={styles.searchWrapper}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Pesquisar dúvidas..."
            style={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div style={styles.categoryTitle}>Categorias</div>
      <div style={styles.categoryGrid}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setCategoryActive(cat.id);
              const itemPertenceACategoria = cat.id === 'todas' || FAQ_DATA.find(f => f.id === openItem)?.cat === cat.id;
              if (!itemPertenceACategoria) setOpenItem(null);
            }}
            style={{
              ...styles.categoryCard,
              borderColor: categoryActive === cat.id ? '#1A6B3C' : '#D1E3D9',
              backgroundColor: categoryActive === cat.id ? '#F0F7F3' : '#FFFFFF',
              color: categoryActive === cat.id ? '#1A6B3C' : '#2C3E35',
            }}
            type="button"
          >
            <span style={styles.categoryIcon}>{cat.icon}</span>
            <span style={styles.categoryLabel}>{cat.label}</span>
          </button>
        ))}
      </div>

      <div style={styles.faqList}>
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map(faq => {
            const isOpen = openItem === faq.id;
            return (
              <div key={faq.id} style={{ ...styles.faqItem, borderColor: isOpen ? '#1A6B3C' : '#D1E3D9' }}>
                <button 
                  onClick={() => toggleItem(faq.id)} 
                  style={styles.faqHeader}
                  type="button"
                >
                  <div style={styles.faqHeaderLeft}>
                    <span style={{ ...styles.faqNumber, color: isOpen ? '#1A6B3C' : '#2C3E35' }}>
                      {faq.id}
                    </span>
                    <span style={{ ...styles.faqQuestion, color: isOpen ? '#1A6B3C' : '#1A1A1A', fontWeight: isOpen ? '700' : '600' }}>
                      {faq.q}
                    </span>
                  </div>
                  {isOpen ? <ChevronUp /> : <ChevronDown />}
                </button>

                {isOpen && (
                  <div style={styles.faqContent}>
                    <p style={styles.faqAnswer}>{faq.a}</p>
                    
                    {faq.dica && (
                      <div style={styles.dicaBox}>
                        <span style={styles.dicaExclame}>!</span>
                        <p style={styles.dicaText}>
                          <strong>Dica:</strong> {faq.dica}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div style={styles.noResults}>
            Nenhuma dúvida encontrada para os critérios informados.
          </div>
        )}
      </div>

      <div style={styles.footerBox}>
        <div style={styles.footerLeft}>
          <div style={styles.headsetCircle}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1A6B3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
            </svg>
          </div>
          <div>
            <h3 style={styles.footerTitle}>Ainda precisa de ajuda?</h3>
            <p style={styles.footerSubtitle}>Nossa equipe está pronta para te ajudar.</p>
          </div>
        </div>
        <button style={styles.footerBtn} onClick={() => alert('Abrindo canal de atendimento...')}>
          <span>💬</span> Fale conosco
        </button>
      </div>
    </div>
  );
}

const styles = {
  searchContainer: {
    marginBottom: '20px',
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    border: '1.5px solid #D1E3D9',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    color: '#1A1A1A',
    width: '100%',
    fontFamily: 'inherit',
  },
  categoryTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#5C6B63',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '12px',
    marginBottom: '28px',
  },
  categoryCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 14px',
    border: '1.5px solid',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s',
    outline: 'none',
  },
  categoryIcon: {
    fontSize: '16px',
  },
  categoryLabel: {
    whiteSpace: 'nowrap',
  },
  faqList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '32px',
  },
  faqItem: {
    border: '1.5px solid',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  faqHeader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    outline: 'none',
  },
  faqHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  faqNumber: {
    fontSize: '14px',
    fontWeight: '700',
    border: '1.5px solid currentColor',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  faqQuestion: {
    fontSize: '14px',
  },
  faqContent: {
    padding: '0 20px 20px 56px',
  },
  faqAnswer: {
    margin: 0,
    fontSize: '14px',
    color: '#5C6B63',
    lineHeight: '1.6',
  },
  dicaBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginTop: '16px',
    padding: '12px 16px',
    border: '1.5px solid #D1E3D9',
    borderRadius: '6px',
    backgroundColor: '#F9FBF9',
  },
  dicaExclame: {
    color: '#A0ADA5',
    fontWeight: '700',
    fontSize: '14px',
  },
  dicaText: {
    margin: 0,
    fontSize: '13px',
    color: '#2C3E35',
    lineHeight: '1.5',
  },
  noResults: {
    textAlign: 'center',
    padding: '24px',
    color: '#5C6B63',
    backgroundColor: '#F9FBF9',
    border: '1.5px dashed #D1E3D9',
    borderRadius: '8px',
    fontSize: '14px',
  },
  footerBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    border: '1.5px solid #D1E3D9',
    borderRadius: '12px',
    backgroundColor: '#FFFFFF',
    flexWrap: 'wrap',
    gap: '16px',
  },
  footerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  headsetCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#E2EFE7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerTitle: {
    margin: '0 0 2px 0',
    fontSize: '16px',
    fontWeight: '700',
    color: '#1A1A1A',
  },
  footerSubtitle: {
    margin: 0,
    fontSize: '13px',
    color: '#5C6B63',
  },
  footerBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    backgroundColor: '#FFFFFF',
    color: '#2C3E35',
    border: '1.5px solid #D1E3D9',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
    outline: 'none',
  }
};