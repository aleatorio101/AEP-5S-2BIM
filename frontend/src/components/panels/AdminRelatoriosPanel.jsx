import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api'; 
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

export default function AdminRelatoriosPanel() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function carregarDadosRelatorio() {
      try {
        setLoading(true);
        const dados = await adminService.getEstatisticas();
        setStats(dados);
      } catch (err) {
        console.error("Erro ao carregar dados dos relatórios:", err);
        setError("Não foi possível conectar ao servidor para extrair os relatórios.");
      } finally {
        setLoading(false);
      }
    }
    carregarDadosRelatorio();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#5C6B63', fontFamily: 'sans-serif' }}>
        Carregando dados estatísticos e compilando gráficos...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#E74C3C', fontFamily: 'sans-serif' }}>
        {error}
      </div>
    );
  }

  const dadosStatus = [
    { name: 'Em Análise', value: stats?.emAnalise || 0, color: '#D1A110' },
    { name: 'Em Atendimento', value: stats?.emAtendimento || 0, color: '#3498DB' },
    { name: 'Resolvidos', value: stats?.resolvidos || 0, color: '#1A6B3C' },
    { name: 'Cancelados', value: stats?.cancelados || 0, color: '#E74C3C' },
  ];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#333' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, color: '#1A6B3C', fontSize: '24px', fontWeight: '700' }}>Relatórios Estatísticos</h1>
        <p style={{ margin: '4px 0 0 0', color: '#5C6B63', fontSize: '14px' }}>Análise detalhada de volumetria, status e encerramento de chamados.</p>
      </div>

      <div style={styles.gridCards}>
        <div style={{ ...styles.cardMetric, borderLeft: '4px solid #5C6B63' }}>
          <span style={styles.cardLabel}>Total Histórico</span>
          <h2 style={styles.cardValue}>{stats?.total || 0}</h2>
        </div>
        
        <div style={{ ...styles.cardMetric, borderLeft: '4px solid #D1A110' }}>
          <span style={styles.cardLabel}>Em Análise</span>
          <h2 style={{ ...styles.cardValue, color: '#D1A110' }}>{stats?.emAnalise || 0}</h2>
        </div>
        
        <div style={{ ...styles.cardMetric, borderLeft: '4px solid #3498DB' }}>
          <span style={styles.cardLabel}>Em Atendimento</span>
          <h2 style={{ ...styles.cardValue, color: '#3498DB' }}>{stats?.emAtendimento || 0}</h2>
        </div>

        <div style={{ ...styles.cardMetric, borderLeft: '4px solid #1A6B3C' }}>
          <span style={styles.cardLabel}>Resolvidos</span>
          <h2 style={{ ...styles.cardValue, color: '#1A6B3C' }}>{stats?.resolvidos || 0}</h2>
        </div>

        <div style={{ ...styles.cardMetric, borderLeft: '4px solid #E74C3C' }}>
          <span style={styles.cardLabel}>Cancelados</span>
          <h2 style={{ ...styles.cardValue, color: '#E74C3C' }}>{stats?.cancelados || 0}</h2>
        </div>
      </div>

      <div style={styles.gridGraficos}>
        
        <div style={styles.cardGrafico}>
          <h3 style={styles.graficoTitle}>Evolução Mensal de Ocorrências</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={stats?.historicoMensal}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="abertos" name="Abertos" fill="#3498DB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolvidos" name="Resolvidos" fill="#1A6B3C" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cancelados" name="Cancelados" fill="#E74C3C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={styles.cardGrafico}>
          <h3 style={styles.graficoTitle}>Proporção por Status Atual</h3>
          <div style={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosStatus}
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {dadosStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  gridCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '14px',
    marginBottom: '24px',
  },
  cardMetric: {
    backgroundColor: '#FFFFFF',
    padding: '16px 20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.04)',
  },
  cardLabel: {
    fontSize: '12px',
    color: '#7F8C8D',
    fontWeight: '600',
    display: 'block',
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  cardValue: {
    margin: 0,
    fontSize: '26px',
    fontWeight: '700',
    color: '#2C3E50'
  },
  gridGraficos: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
  },
  cardGrafico: {
    backgroundColor: '#FFFFFF',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  graficoTitle: {
    margin: '0 0 20px 0',
    fontSize: '15px',
    fontWeight: '600',
    color: '#1A6B3C',
  }
};