import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/auth/AuthPage';
import DashboardLayout from './components/layout/DashboardLayout';
import CidadaoChamadosPanel from './components/panels/CidadaoChamadosPanel';
import MeusDadosPanel from './components/panels/MeusDadosPanel';
import AjudaPanel from './components/panels/AjudaPanel';
import NovoChamadoPanel from './components/panels/NovoChamadoPanel';
import AdminChamadosPanel from './components/panels/AdminChamadosPanel';
import AdminRelatoriosPanel from './components/panels/AdminRelatoriosPanel';
import AdminUsuariosPanel from './components/panels/AdminUsuariosPanel';

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
        return <NovoChamadoPanel />;
      case 'meus_dados':
        return <MeusDadosPanel />;
      case 'ajuda':
        return <AjudaPanel />;
      case 'admin_chamados':
        return <AdminChamadosPanel />;
      case 'admin_relatorios':
        return <AdminRelatoriosPanel />;
      case 'admin_usuarios':
        return <AdminUsuariosPanel />;


      case 'admin_chamados':
        return (
          <div style={styles.cardPlaceholder}>
            <h2 style={styles.title}>Painel de Gestão de Chamados</h2>
            <p style={styles.text}>Tela de monitoramento e atendimento em desenvolvimento...</p>
          </div>
        );
      case 'admin_relatorios':
        return (
          <div style={styles.cardPlaceholder}>
            <h2 style={styles.title}>Relatórios Estatísticos</h2>
            <p style={styles.text}>Módulo de extração de relatórios e totais em desenvolvimento...</p>
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