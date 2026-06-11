import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';

export default function AdminChamadosPanel() {
    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [busca, setBusca] = useState('');
    const [statusFiltro, setStatusFiltro] = useState('');
    const [categoriaFiltro, setCategoriaFiltro] = useState('');

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    const [selectedChamado, setSelectedChamado] = useState(null);
    const [novoStatus, setNovoStatus] = useState('');
    const [observacao, setObservacao] = useState('');
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        carregarChamados();
    }, [page, statusFiltro, categoriaFiltro]);

    const carregarChamados = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await adminService.listarTodos({
                page,
                size: 10,
                status: statusFiltro || undefined,
                categoria: categoriaFiltro || undefined,
                busca: busca.trim() || undefined
            });

            if (data) {
                setChamados(data.content || []);
                setTotalPages(data.totalPages || 1);
                setTotalElements(data.totalElements || 0);
            }
        } catch (err) {
            setError(err.message || 'Erro ao carregar lista de chamados.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(0);
        carregarChamados();
    };

    const handleOpenStatusModal = async (chamado) => {
        setModalLoading(true);
        try {
            const detalheCompleto = await adminService.buscarPorProtocolo(chamado.protocolo);
            setSelectedChamado(detalheCompleto);
            setNovoStatus(detalheCompleto.status);
            setObservacao('');
        } catch (err) {
            alert('Erro ao buscar detalhes do chamado: ' + err.message);
        } finally {
            setModalLoading(false);
        }
    };

    const handleSalvarStatus = async (e) => {
        e.preventDefault();
        if (!observacao.trim()) {
            alert('A observação é obrigatória para atualizar o status do chamado.');
            return;
        }

        setModalLoading(true);
        try {
            await adminService.atualizarStatus(selectedChamado.protocolo, {
                novoStatus: novoStatus,
                observacao: observacao.trim()
            });

            setSelectedChamado(null);
            carregarChamados();
        } catch (err) {
            alert('Erro ao atualizar status: ' + err.message);
        } finally {
            setModalLoading(false);
        }
    };

    const formatarData = (dataStr) => {
        if (!dataStr) return '-';
        const d = new Date(dataStr);
        return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'EM_ANALISE': return { bg: '#FFF3CD', text: '#856404', label: 'Em Análise' };
            case 'EM_ATENDIMENTO': return { bg: '#CCE5FF', text: '#004085', label: 'Em Atendimento' };
            case 'AGUARDANDO_RETORNO': return { bg: '#E2E3E5', text: '#383D41', label: 'Aguardando Retorno' };
            case 'RESOLVIDO': return { bg: '#D4EDDA', text: '#155724', label: 'Resolvido' };
            case 'CANCELADO': return { bg: '#F8D7DA', text: '#721C24', label: 'Cancelado' };
            default: return { bg: '#F0F7F3', text: '#5C6B63', label: status };
        }
    };

    const handleExibirArquivo = async (e, ev) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('edualerta_token') || localStorage.getItem('token');
      const urlCompleta = `http://localhost:8080/api/chamados/${selectedChamado.protocolo}/evidencias/${ev.id}`;
      
      const response = await fetch(urlCompleta, {
        method: 'GET',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (!response.ok) throw new Error(`Erro do servidor: ${response.status}`);

      const blob = await response.blob();
      const urlImagem = window.URL.createObjectURL(blob);

      const novaAba = window.open();
      if (novaAba) {
        novaAba.document.write(`
          <html>
            <body style="margin:0; background:#121214; display:flex; justify-content:center; align-items:center; height:100vh;">
              <img src="${urlImagem}" style="max-width:90%; max-height:90%; border-radius:6px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);" />
            </body>
          </html>
        `);
        novaAba.document.close();
      }
    } catch (err) {
      alert('Erro ao carregar imagem: ' + err.message);
    }
  };
    return (
        <div style={styles.container}>
            
            <div style={styles.header}>
                <h1 style={styles.pageTitle}>Gerenciamento de Chamados</h1>
                <p style={styles.pageSubtitle}>Consulte, filtre e gerencie os atendimentos e tramitações da instituição.</p>
            </div>

            <div style={styles.filterCard}>
                <form onSubmit={handleSearchSubmit} style={styles.filterForm}>
                    <div style={styles.inputGroupBusca}>
                        <label style={styles.label}>Buscar por termo</label>
                        <div style={styles.searchContainer}>
                            <input
                                type="text"
                                placeholder="Ex: Protocolo, título ou assunto..."
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                style={styles.searchInput}
                            />
                            <button type="submit" style={styles.btnSearch}>🔍 Buscar</button>
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Filtrar por Status</label>
                        <select
                            value={statusFiltro}
                            onChange={(e) => { setStatusFiltro(e.target.value); setPage(0); }}
                            style={styles.select}
                        >
                            <option value="">Todos os Status</option>
                            <option value="EM_ANALISE">Em Análise</option>
                            <option value="EM_ATENDIMENTO">Em Atendimento</option>
                            <option value="AGUARDANDO_RETORNO">Aguardando Retorno</option>
                            <option value="RESOLVIDO">Resolvido</option>
                            <option value="CANCELADO">Cancelado</option>
                        </select>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Filtrar por Categoria</label>
                        <select
                            value={categoriaFiltro}
                            onChange={(e) => { setCategoriaFiltro(e.target.value); setPage(0); }}
                            style={styles.select}
                        >
                            <option value="">Todas as Categorias</option>
                            <option value="INFRAESTRUTURA">Infraestrutura</option>
                            <option value="LIMPEZA">Limpeza</option>
                            <option value="SEGURANCA">Segurança</option>
                            <option value="INTERNET">Internet/Wi-Fi</option>
                            <option value="DENUNCIA">Denúncia</option>
                        </select>
                    </div>
                </form>
            </div>

            {error && <div style={styles.errorAlert}>{error}</div>}

            <div style={styles.tableCard}>
                {loading ? (
                    <div style={styles.loadingBox}>Carregando registros...</div>
                ) : chamados.length === 0 ? (
                    <div style={styles.emptyBox}>Nenhum chamado foi localizado com os critérios informados.</div>
                ) : (
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.thRow}>
                                    <th style={styles.th}>Protocolo</th>
                                    <th style={styles.th}>Título</th>
                                    <th style={styles.th}>Categoria</th>
                                    <th style={styles.th}>Urgência</th>
                                    <th style={styles.th}>Data de Abertura</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th} style={{ textAlign: 'center' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chamados.map((c) => {
                                    const sColor = getStatusColor(c.status);
                                    return (
                                        <tr key={c.protocolo} style={styles.tr}>
                                            <td style={{ ...styles.td, fontWeight: '700', color: '#1A6B3C' }}>{c.protocolo}</td>
                                            <td style={styles.td}>
                                                <div style={styles.titleCell}>{c.titulo}</div>
                                                {c.anonimo && <span style={styles.anonBadge}>🔒 Anônimo</span>}
                                            </td>
                                            <td style={styles.td}>{c.categoriaDescricao || c.categoria}</td>
                                            <td style={styles.td}>
                                                <span style={{ fontWeight: c.urgencia === 'CRITICA' || c.urgencia === 'ALTA' ? '700' : '400' }}>
                                                    {c.urgencia}
                                                </span>
                                            </td>
                                            <td style={styles.td}>{formatarData(c.dataAbertura)}</td>
                                            <td style={styles.td}>
                                                <span style={{ ...styles.badge, backgroundColor: sColor.bg, color: sColor.text }}>
                                                    {sColor.label}
                                                </span>
                                            </td>
                                            <td style={{ ...styles.td, textAlign: 'center' }}>
                                                <button
                                                    onClick={() => handleOpenStatusModal(c)}
                                                    style={styles.btnAction}
                                                    title="Tramitar status do chamado"
                                                >
                                                    ⚙️ Tramitar
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {totalElements > 0 && (
                    <div style={styles.paginationRow}>
                        <span style={styles.paginationInfo}>Exibindo total de {totalElements} registros</span>
                        <div style={styles.paginationButtons}>
                            <button
                                disabled={page === 0}
                                onClick={() => setPage(p => p - 1)}
                                style={{ ...styles.btnPage, opacity: page === 0 ? 0.5 : 1 }}
                            >
                                ◀ Voltar
                            </button>
                            <span style={styles.pageIndicator}>Página {page + 1} de {totalPages}</span>
                            <button
                                disabled={page >= totalPages - 1}
                                onClick={() => setPage(p => p + 1)}
                                style={{ ...styles.btnPage, opacity: page >= totalPages - 1 ? 0.5 : 1 }}
                            >
                                Avançar ▶
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {selectedChamado && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalBox}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>Tramitação e Detalhes do Chamado</h3>
                            <button style={styles.btnCloseModal} onClick={() => setSelectedChamado(null)}>✕</button>
                        </div>

                        <form onSubmit={handleSalvarStatus} style={styles.modalBody}>
                            <div style={styles.modalMetaInfo}>
                                <p style={styles.metaText}><strong>Protocolo:</strong> {selectedChamado.protocolo}</p>
                                <p style={styles.metaText}><strong>Título:</strong> {selectedChamado.titulo}</p>
                                <p style={styles.metaText}><strong>Localização:</strong> Bloco {selectedChamado.bloco || 'Não informado'} - Sala {selectedChamado.sala || 'Não informada'}</p>

                                <div style={styles.descContainer}>
                                    <strong style={{ color: '#1A6B3C', display: 'block', marginBottom: '4px' }}>Descrição do Requerente:</strong>
                                    <p style={styles.descText}>{selectedChamado.descricao || 'Sem descrição informada.'}</p>
                                </div>

                                <div style={{ marginTop: '12px' }}>
                                    <strong style={{ color: '#1A6B3C', display: 'block', marginBottom: '6px', fontSize: '13px' }}>
                                        Ficheiros e Evidências Anexadas:
                                    </strong>

                                    {!selectedChamado.evidencias || selectedChamado.evidencias.length === 0 ? (
                                        <p style={{ margin: 0, fontSize: '12px', color: '#85938A', fontStyle: 'italic' }}>
                                            Nenhuma imagem ou anexo foi enviado para este chamado.
                                        </p>
                                    ) : (
                                        <div style={styles.evidenceGrid}>
                                            {!selectedChamado.evidencias || selectedChamado.evidencias.length === 0 ? (
                                                <p style={{ margin: 0, fontSize: '12px', color: '#85938A', fontStyle: 'italic' }}>
                                                    Nenhuma imagem ou anexo foi enviado para este chamado.
                                                </p>
                                            ) : (
                                                <div style={styles.evidenceGrid}>
                                                    {selectedChamado.evidencias.map((ev) => {
                                                        const urlImagem = `http://localhost:8080/api/chamados/${selectedChamado.protocolo}/evidencias/${ev.id}`;

                                                        return (
                                                            <div key={ev.id} style={styles.evidenceCard}>
                                                                <a
                                                                    href="#"
                                                                    onClick={(e) => handleExibirArquivo(e, ev)}
                                                                    style={styles.evidenceLink}
                                                                    title="Clique para baixar o arquivo para o seu computador"
                                                                >
                                                                    <img
                                                                        src={urlImagem}
                                                                        alt={ev.nomeOriginal}
                                                                        style={styles.evidenceImg}
                                                                        onError={(e) => {
                                                                            e.target.src = 'https://placehold.co/100x100/F0F7F3/1A6B3C?text=Arquivo';
                                                                        }}
                                                                    />
                                                                    <span style={styles.evidenceName}>
                                                                        {ev.nomeOriginal}
                                                                        <span style={{ display: 'block', fontSize: '9px', color: '#1A6B3C', textDecoration: 'underline', marginTop: '2px' }}>
                                                                            💾 Baixar arquivo
                                                                        </span>
                                                                    </span>
                                                                </a>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Selecione o Novo Status</label>
                                <select
                                    value={novoStatus}
                                    onChange={(e) => setNovoStatus(e.target.value)}
                                    style={styles.select}
                                >
                                    <option value="EM_ANALISE">Em Análise</option>
                                    <option value="EM_ATENDIMENTO">Em Atendimento</option>
                                    <option value="AGUARDANDO_RETORNO">Aguardando Retorno</option>
                                    <option value="RESOLVIDO">Resolvido</option>
                                    <option value="CANCELADO">Cancelado</option>
                                </select>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Observação Interna / Histórico</label>
                                <p style={styles.subLabel}>Descreva o parecer técnico ou o motivo da alteração (obrigatório)</p>
                                <textarea
                                    rows="3"
                                    value={observacao}
                                    onChange={(e) => setObservacao(e.target.value)}
                                    placeholder="Justifique a mudança de status ou relate o andamento..."
                                    style={styles.textarea}
                                    required
                                />
                            </div>

                            <div style={styles.modalActions}>
                                <button
                                    type="button"
                                    style={styles.btnCancelModal}
                                    onClick={() => setSelectedChamado(null)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={modalLoading}
                                    style={styles.btnSaveModal}
                                >
                                    {modalLoading ? 'Salvando...' : 'Confirmar Tramitação'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        paddingBottom: '40px',
    },
    header: {
        marginBottom: '24px',
    },
    pageTitle: {
        fontSize: '22px',
        fontWeight: '700',
        color: '#1A1A1A',
        margin: '0 0 4px 0',
    },
    pageSubtitle: {
        fontSize: '14px',
        color: '#5C6B63',
        margin: 0,
    },
    filterCard: {
        backgroundColor: '#FFFFFF',
        border: '1.5px solid #D1E3D9',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
    },
    filterForm: {
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
    },
    inputGroupBusca: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        flex: 2,
        minWidth: '280px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        flex: 1,
        minWidth: '180px',
    },
    label: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#2C3E35',
    },
    subLabel: {
        fontSize: '11px',
        color: '#5C6B63',
        margin: '-4px 0 4px 0',
    },
    searchContainer: {
        display: 'flex',
        gap: '8px',
    },
    searchInput: {
        flex: 1,
        padding: '10px 14px',
        border: '1.5px solid #D1E3D9',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
    },
    btnSearch: {
        padding: '10px 16px',
        backgroundColor: '#1A6B3C',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    select: {
        padding: '10px 14px',
        border: '1.5px solid #D1E3D9',
        borderRadius: '8px',
        fontSize: '14px',
        backgroundColor: '#FFFFFF',
        outline: 'none',
    },
    textarea: {
        padding: '12px',
        border: '1.5px solid #D1E3D9',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        fontFamily: 'inherit',
        resize: 'none',
    },
    tableCard: {
        backgroundColor: '#FFFFFF',
        border: '1.5px solid #D1E3D9',
        borderRadius: '12px',
        overflow: 'hidden',
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px',
        textAlign: 'left',
    },
    thRow: {
        backgroundColor: '#F9FBF9',
        borderBottom: '1.5px solid #E2EFE7',
    },
    th: {
        padding: '14px 16px',
        color: '#1A6B3C',
        fontWeight: '700',
    },
    tr: {
        borderBottom: '1px solid #F0F7F3',
        transition: 'background-color 0.2s',
        ':hover': { backgroundColor: '#F9FBF9' }
    },
    td: {
        padding: '14px 16px',
        color: '#2C3E35',
        verticalAlign: 'middle',
    },
    titleCell: {
        fontWeight: '500',
        color: '#1A1A1A',
    },
    anonBadge: {
        display: 'inline-block',
        fontSize: '11px',
        backgroundColor: '#F0F2F5',
        color: '#65676B',
        padding: '2px 6px',
        borderRadius: '4px',
        marginTop: '4px',
        fontWeight: '600',
    },
    badge: {
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        display: 'inline-block',
    },
    btnAction: {
        padding: '6px 12px',
        border: '1.5px solid #D1E3D9',
        backgroundColor: '#FFFFFF',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        color: '#1A1A1A',
    },
    paginationRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        borderTop: '1.5px solid #F0F7F3',
        backgroundColor: '#F9FBF9',
    },
    paginationInfo: {
        fontSize: '13px',
        color: '#5C6B63',
    },
    paginationButtons: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    btnPage: {
        padding: '6px 14px',
        border: '1.5px solid #D1E3D9',
        borderRadius: '6px',
        backgroundColor: '#FFFFFF',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    pageIndicator: {
        fontSize: '13px',
        color: '#1A1A1A',
        fontWeight: '600',
    },
    loadingBox: { padding: '40px', textAlign: 'center', color: '#5C6B63' },
    emptyBox: { padding: '40px', textAlign: 'center', color: '#5C6B63' },
    errorAlert: {
        padding: '12px 16px',
        backgroundColor: '#FDE8E8',
        color: '#E53E3E',
        border: '1.5px solid #F8D7DA',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '14px',
        fontWeight: '600',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modalBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1.5px solid #D1E3D9',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        overflow: 'hidden',
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        backgroundColor: '#F9FBF9',
        borderBottom: '1.5px solid #F0F7F3',
    },
    modalTitle: { margin: 0, fontSize: '16px', fontWeight: '700' },
    btnCloseModal: { border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: '#A0ADA5' },
    modalBody: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' },
    modalMetaInfo: {
        backgroundColor: '#F0F7F3',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '13px',
    },
    metaText: { margin: '0 0 4px 0', color: '#2C3E35' },
    modalActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        marginTop: '8px',
    },
    btnCancelModal: {
        padding: '10px 16px',
        border: '1.5px solid #D1E3D9',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        fontWeight: '650',
        cursor: 'pointer',
    },
    btnSaveModal: {
        padding: '10px 20px',
        backgroundColor: '#1A6B3C',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '700',
        cursor: 'pointer',

        descContainer: {
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #D1E3D9',
            borderRadius: '6px',
            maxHeight: '120px',
            overflowY: 'auto',
        },
        descText: {
            margin: 0,
            fontSize: '13px',
            color: '#2C3E35',
            lineHeight: '1.4',
            whiteSpace: 'pre-wrap', // Preserva as quebras de linha que o cidadão digitou
        },
        evidenceGrid: {
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            marginTop: '6px',
            maxHeight: '140px',
            overflowY: 'auto',
            padding: '4px 0',
        },
        evidenceCard: {
            width: '90px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #D1E3D9',
            borderRadius: '6px',
            padding: '6px',
        },
        evidenceImg: {
            width: '76px',
            height: '60px',
            objectFit: 'cover',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            ':hover': { transform: 'scale(1.05)' }
        },
        evidenceName: {
            fontSize: '10px',
            color: '#5C6B63',
            width: '100%',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        // Adicione junto com os outros estilos de evidência lá embaixo:
        evidenceLink: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            textDecoration: 'none', // Remove o sublinhado azul do link
            color: 'inherit',
            width: '100%',
            height: '100%',
        },
        evidenceCard: {
            width: '100px', // Aumentei ligeiramente para caber o texto de ação
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            border: '1px solid #D1E3D9',
            borderRadius: '6px',
            padding: '6px',
            transition: 'transform 0.15s, border-color 0.15s',
            ':hover': {
                transform: 'translateY(-2px)',
                borderColor: '#1A6B3C'
            }
        },
    }
};