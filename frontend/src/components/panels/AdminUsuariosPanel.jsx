import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';

export default function AdminUsuariosPanel() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    carregarUsuarios();
  }, [page]);

  const carregarUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.listarUsuarios(page, 10);
      setUsuarios(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Erro ao obter lista de usuários:", err);
      setError("Erro ao se conectar ao servidor para carregar a lista de usuários.");
    } finally {
      setLoading(false);
    }
  };

  const handleAlterarRole = async (id, novaRole) => {
    try {
      await adminService.alterarRole(id, novaRole);
      carregarUsuarios();
      alert("Permissão do usuário atualizada com sucesso!");
    } catch (err) {
      alert("Não foi possível alterar o cargo do usuário.");
    }
  };

  const handleToggleStatus = async (id, ativoAct) => {
    try {
      if (ativoAct) {
        await adminService.desativarUsuario(id);
      } else {
        await adminService.reativarUsuario(id);
      }
      carregarUsuarios();
    } catch (err) {
      alert("Falha ao modificar o status da conta.");
    }
  };

  if (loading && usuarios.length === 0) {
    return <div style={styles.alertText}>Carregando controle de acessos da plataforma...</div>;
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ margin: 0, color: '#1A6B3C', fontSize: '24px', fontWeight: '700' }}>Gestão de Usuários</h1>
        <p style={{ margin: '4px 0 0 0', color: '#5C6B63', fontSize: '14px' }}>Controle e auditoria de níveis de acesso do ecossistema EduAlerta.</p>
      </div>

      {error && <div style={styles.errorBanner}>{error}</div>}

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>Nome / Email</th>
              <th style={styles.th}>CPF</th>
              <th style={styles.th}>Nível de Acesso (Role)</th>
              <th style={styles.th}>Status</th>
              <th style={{ ...styles.th, textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user.id} style={styles.tr}>
                <td style={styles.td}>
                  <div style={{ fontWeight: '600', color: '#2C3E50' }}>{user.nome}</div>
                  <div style={{ fontSize: '12px', color: '#7F8C8D' }}>{user.email}</div>
                </td>
                <td style={styles.td}>{user.cpf || 'Não informado'}</td>
                
                {/* Modificação de Role Nativa via Select */}
                <td style={styles.td}>
                  <select
                    value={user.role}
                    onChange={(e) => handleAlterarRole(user.id, e.target.value)}
                    style={{
                      ...styles.selectRole,
                      color: user.role === 'ADMIN' ? '#1A6B3C' : user.role === 'ATENDENTE' ? '#3498DB' : '#5C6B63',
                      borderColor: user.role === 'ADMIN' ? '#1A6B3C' : user.role === 'ATENDENTE' ? '#3498DB' : '#D1E3D9',
                    }}
                  >
                    <option value="CIDADAO">👤 Cidadão</option>
                    <option value="ATENDENTE">🛠️ Atendente</option>
                    <option value="ADMIN">🛡️ Administrador</option>
                  </select>
                </td>

                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: user.ativo ? '#E8F5E9' : '#FADBD8',
                    color: user.ativo ? '#1A6B3C' : '#C0392B'
                  }}>
                    {user.ativo ? 'Ativo' : 'Suspenso'}
                  </span>
                </td>

                <td style={{ ...styles.td, textAlign: 'center' }}>
                  <button
                    onClick={() => handleToggleStatus(user.id, user.ativo)}
                    style={{
                      ...styles.btnAction,
                      backgroundColor: user.ativo ? '#FDEDEC' : '#E8F5E9',
                      color: user.ativo ? '#E74C3C' : '#1A6B3C',
                      border: `1px solid ${user.ativo ? '#F5B7B1' : '#A9DFBF'}`
                    }}
                  >
                    {user.ativo ? '🛑 Desativar Conta' : '✅ Reativar Conta'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.pagination}>
        <button 
          disabled={page === 0} 
          onClick={() => setPage(p => p - 1)} 
          style={styles.pageBtn}
        >
          Anterior
        </button>
        <span style={styles.pageIndicator}>Página {page + 1} de {totalPages}</span>
        <button 
          disabled={page >= totalPages - 1} 
          onClick={() => setPage(p => p + 1)} 
          style={styles.pageBtn}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}

const styles = {
  alertText: { padding: '20px', textAlign: 'center', color: '#5C6B63' },
  errorBanner: { backgroundColor: '#FADBD8', color: '#C0392B', padding: '12px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' },
  tableWrapper: { backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  theadRow: { backgroundColor: '#F9FBF9', borderBottom: '2px solid #E8F0EC' },
  th: { padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: '#5C6B63' },
  tr: { borderBottom: '1px solid #F0F5F2', transition: 'background 0.2s' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#333' },
  selectRole: { padding: '6px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', backgroundColor: '#FFF', cursor: 'pointer', outline: 'none' },
  badge: { padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
  btnAction: { padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '20px' },
  pageBtn: { padding: '6px 14px', border: '1px solid #D1E3D9', borderRadius: '4px', backgroundColor: '#FFF', cursor: 'pointer', fontSize: '13px', color: '#5C6B63' },
  pageIndicator: { fontSize: '13px', color: '#7F8C8D' }
};