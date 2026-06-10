import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/auth/AuthPage';
import DashboardLayout from './components/layout/DashboardLayout';
import CidadaoChamadosPanel from './components/panels/CidadaoChamadosPanel';

export default function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('inicio');

  if (loading) return <LoadingScreen />;
  if (!user) return <AuthPage />;

  function renderContent() {
    switch (activeTab) {
      case 'inicio':
        return (
          <div style={styles.cardPlaceholder}>
            <h2 style={styles.title}>Início</h2>
            <p style={styles.text}>Bem-vindo ao EduAlerta, {user.nome}! Selecione uma opção na barra lateral para começar.</p>
          </div>
        );
      case 'meus_chamados':
        return <CidadaoChamadosPanel />;
      case 'novo_chamado':
        return (
          <div style={styles.cardPlaceholder}>
            <h2 style={styles.title}>Novo Chamado</h2>
            <p style={styles.text}>Formulário de abertura de solicitações em desenvolvimento...</p>
          </div>
        );
      case 'meus_dados':
        return (
          <div style={styles.cardPlaceholder}>
            <h2 style={styles.title}>Meus Dados</h2>
            <p style={styles.text}>Tela de perfil do usuário em desenvolvimento...</p>
          </div>
        );
      default:
        return (
          <div style={styles.cardPlaceholder}>
            <h2 style={styles.title}>Em Construção</h2>
            <p style={styles.text}>Esta seção estará disponível em breve.</p>
          </div>
        );
    }
  }

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}

// Telas auxiliares simples
function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0F7F3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <p style={{ color: '#5C6B63', fontSize: '14px' }}>Carregando dados de acesso...</p>
    </div>
  );
}

const styles = {
  cardPlaceholder: {
    padding: '24px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  title: {
    margin: '0 0 8px 0',
    color: '#1A6B3C',
    fontSize: '20px',
    fontWeight: '700',
  },
  text: {
    margin: 0,
    color: '#5C6B63',
    fontSize: '14px',
    lineHeight: '1.5',
  }
};