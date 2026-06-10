import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { dS } from '../styles/dashboardStyles';

export default function DashboardLayout({ children, activeTab, setActiveTab }) {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'inicio', label: 'Início', icon: '🏠' },
    { id: 'meus_chamados', label: 'Meus Chamados', icon: '📖' },
    { id: 'novo_chamado', label: 'Novo Chamado', icon: '➕' },
    { id: 'meus_dados', label: 'Meus Dados', icon: '👤' },
    { id: 'ajuda', label: 'Ajuda', icon: '❓' },
    { id: 'configuracoes', label: 'Configurações', icon: '⚙️' },
  ];

  return (
    <div style={dS.layoutContainer}>
      <aside style={dS.sidebar}>
        <div style={dS.brand}>
          <div style={dS.logoIcon}>
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
              <path d="M14 3L3 9v10l11 6 11-6V9L14 3z" fill="#1A6B3C"/>
              <path d="M9 13l3 3 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={dS.brandName}>EduAlerta</span>
        </div>

        <nav style={dS.navigation}>
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{ ...dS.menuButton, ...(isActive ? dS.menuButtonActive : {}) }}
              >
                {isActive && <div style={dS.activeIndicator} />}
                <span style={dS.icon}>{item.icon}</span>
                <span style={{ ...dS.label, fontWeight: isActive ? '600' : '500' }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div style={dS.sidebarFooter}>
          <div style={dS.userInfo}>
            <p style={dS.userName}>{user?.nome || 'Usuário'}</p>
            <p style={dS.userRole}>{user?.tipoUsuario || 'Cidadão'}</p>
          </div>
          <button onClick={logout} style={dS.btnLogout}>
            🚪 Sair da conta
          </button>
        </div>
      </aside>

      <main style={dS.mainContent}>
        <div style={dS.pageContainer}>
          {children}
        </div>
      </main>
    </div>
  );
}