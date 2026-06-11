import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { dS } from '../styles/dashboardStyles';

export default function DashboardLayout({ children, activeTab, setActiveTab }) {
  const { user, logout } = useAuth();

  const isCidadao = user?.role === 'CIDADAO';
  const isAtendente = user?.role === 'ATENDENTE';
  const isAdmin = user?.role === 'ADMIN';

  const userMenuItems = [
    { id: 'inicio', label: 'Início', icon: '🏠' },
    { id: 'meus_chamados', label: 'Meus Chamados', icon: '📖' },
    { id: 'novo_chamado', label: 'Novo Chamado', icon: '➕' },
    { id: 'meus_dados', label: 'Meus Dados', icon: '👤' },
    { id: 'ajuda', label: 'Ajuda', icon: '❓' },
  ];

  const adminMenuItems = [
    { id: 'inicio', label: 'Início', icon: '🏠' },
    
    { id: 'admin_chamados', label: 'Chamados', icon: '📋' },
    
    { id: 'admin_relatorios', label: 'Relatórios', icon: '📊' },
    
    ...(isAdmin ? [{ id: 'admin_usuarios', label: 'Gestão de Usuários', icon: '👥' }] : []),
    
    { id: 'ajuda', label: 'Ajuda', icon: '❓' },
  ];

  const menuItems = isCidadao ? userMenuItems : adminMenuItems;

  const getRoleLabel = () => {
    if (isAdmin) return 'Administrador';
    if (isAtendente) return 'Atendente';
    return user?.tipoUsuario || 'Cidadão';
  };

  return (
    <div style={dS.layoutContainer}>
      <aside style={dS.sidebar}>
        <div style={dS.sidebarHeader}>
          <h2 style={{ color: '#1A6B3C', margin: 0, fontSize: '20px', fontWeight: 'bold' }}>EduAlerta</h2>
        </div>

        <nav style={dS.navigation}>
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  ...dS.menuButton,
                  backgroundColor: isActive ? '#E8F5E9' : 'transparent',
                }} 
              >
                {isActive && <div style={dS.activeIndicator} />}

                <span style={dS.icon}>{item.icon}</span>
                <span style={{
                  ...dS.label,
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#1A6B3C' : '#5C6B63'
                }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div style={dS.sidebarFooter}>
          <div style={dS.userInfo}>
            <p style={dS.userName}>{user?.nome || 'Usuário'}</p>
            <p style={{ ...dS.userRole, color: isAdmin ? '#1A6B3C' : isAtendente ? '#3498DB' : '#5C6B63' }}>
              {getRoleLabel()}
            </p>
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