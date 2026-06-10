import React, { useState, useEffect } from 'react';
import { chamadoService } from '../../services/api';
import { dS } from '../styles/dashboardStyles';

export default function CidadaoChamadosPanel() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFiltro, setStatusFiltro] = useState('');

  useEffect(() => {
    async function carregarChamados() {
      setLoading(true);
      try {
        const dados = await chamadoService.meus({ status: statusFiltro });
        setChamados(dados?.content || dados || []);
      } catch (err) {
        console.error("Erro ao buscar chamados:", err);
      } finally {
        setLoading(false);
      }
    }
    carregarChamados();
  }, [statusFiltro]);

  return (
    <div style={dS.container}>
      <div style={dS.headerRow}>
        <div>
          <h1 style={dS.title}>Meus Chamados</h1>
          <p style={dS.subtitle}>Acompanhe o andamento das suas solicitações</p>
        </div>
        <button style={dS.btnNovo}>+ Abrir Chamado</button>
      </div>

      <div style={dS.filterBar}>
        <label style={dS.filterLabel}>Filtrar por Status:</label>
        <select
          value={statusFiltro}
          onChange={(e) => setStatusFiltro(e.target.value)}
          style={dS.select}
        >
          <option value="">Todos os status</option>
          <option value="EM_ANALISE">Em Análise</option>
          <option value="EM_ATENDIMENTO">Em Atendimento</option>
          <option value="AGUARDANDO_RETORNO">Aguardando Retorno</option>
          <option value="RESOLVIDO">Resolvido</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </div>

      {loading ? (
        <p style={dS.loadingText}>Carregando chamados...</p>
      ) : chamados.length === 0 ? (
        <div style={dS.emptyBox}>Você não possui nenhum chamado registrado neste filtro.</div>
      ) : (
        <div style={dS.tableWrapper}>
          <table style={dS.table}>
            <thead>
              <tr style={dS.thRow}>
                <th style={dS.th}>Protocolo</th>
                <th style={dS.th}>Título / Descrição</th>
                <th style={dS.th}>Status</th>
                <th style={dS.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {chamados.map((c) => (
                <tr key={c.protocolo} style={dS.tr}>
                  <td style={{ ...dS.td, fontWeight: 'bold' }}>{c.protocolo}</td>
                  <td style={dS.td}>{c.titulo || c.descricao || 'Sem título'}</td>
                  <td style={dS.td}>
                    <span style={dS.badge}>{c.status}</span>
                  </td>
                  <td style={dS.td}>
                    <button style={dS.btnVer}>Visualizar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}