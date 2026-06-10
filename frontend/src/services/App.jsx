import { useAuth } from './context/AuthContext';
import AuthPage from './pages/auth/AuthPage';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user)   return <AuthPage />;

  const role = user.role ?? user.tipoUsuario;

  if (role === 'ADMIN' || role === 'ATENDENTE') {
    return <AdminDashboardPlaceholder user={user} />;
  }

  return <CidadaoDashboardPlaceholder user={user} />;
}

function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#F0F7F3',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{ textAlign: 'center' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1A6B3C" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
            <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>
          </path>
        </svg>
        <p style={{ color: '#5C6B63', marginTop: '12px', fontSize: '14px' }}>Carregando…</p>
      </div>
    </div>
  );
}

function AdminDashboardPlaceholder({ user }) {
  const { logout } = useAuth();
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0F7F3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ textAlign: 'center', color: '#1A6B3C' }}>
        <p style={{ fontSize: '18px', fontWeight: '600' }}>Bem-vindo, {user.nome}!</p>
        <p style={{ color: '#5C6B63', fontSize: '14px' }}>Painel Admin — em construção</p>
        <button onClick={logout} style={{ marginTop: '16px', padding: '8px 20px', backgroundColor: '#1A6B3C', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
          Sair
        </button>
      </div>
    </div>
  );
}

function CidadaoDashboardPlaceholder({ user }) {
  const { logout } = useAuth();
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0F7F3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ textAlign: 'center', color: '#1A6B3C' }}>
        <p style={{ fontSize: '18px', fontWeight: '600' }}>Bem-vindo, {user.nome}!</p>
        <p style={{ color: '#5C6B63', fontSize: '14px' }}>Área do cidadão — em construção</p>
        <button onClick={logout} style={{ marginTop: '16px', padding: '8px 20px', backgroundColor: '#1A6B3C', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
          Sair
        </button>
      </div>
    </div>
  );
}
