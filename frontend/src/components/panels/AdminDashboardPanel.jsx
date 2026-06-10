import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { dS } from '../styles/dashboardStyles';

export default function AdminDashboardPanel() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarEstatisticas() {
      try {
        const dados = await adminService.getEstatisticas();
        setStats(dados);
      } catch (err) {
        console.error("Erro ao carregar estatísticas:", err);
      } finally {
        setLoading(false);
      }
    }
    carregarEstatisticas();
  }, []);

  if (loading) return <p style={dS.loadingText}>Carregando indicadores do painel...</p>;

  return (
    <div>
      <h1 style={dS.title}>Painel de Controle</h1>
      <p style={dS.subtitle}>Visão geral do sistema de chamados EduAlerta</p>

      <div style={dS.grid}>
        <div style={{ ...dS.card, borderLeft: '4px solid #1A6B3C' }}>
          <span style={dS.cardLabel}>Total de Chamados</span>
          <h2 style={dS.cardValue}>{stats?.total || 0}</h2>
        </div>
        <div style={{ ...dS.card, borderLeft: '4px solid #D1A110' }}>
          <span style={dS.cardLabel}>Em Análise</span>
          <h2 style={dS.cardValue}>{stats?.emAnalise || 0}</h2>
        </div>
        <div style={{ ...dS.card, borderLeft: '4px solid #3498DB' }}>
          <span style={dS.cardLabel}>Em Atendimento</span>
          <h2 style={dS.cardValue}>{stats?.emAtendimento || 0}</h2>
        </div>
      </div>
    </div>
  );
}