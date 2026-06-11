import { useState } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

export default function AuthPage() {
  const [view, setView] = useState('login');
  const [successMsg, setSuccessMsg] = useState('');
  const [protocoloBuscado, setProtocoloBuscado] = useState('');

  function handleRegisterSuccess() {
    setSuccessMsg('Conta criada com sucesso! Faça login para continuar.');
    setView('login');
  }

  function handleAcessoAnonimo() {
    setView('chamado_anonimo');
  }

  function handleBuscarProtocolo(protocolo) {
    setProtocoloBuscado(protocolo);
    setView('acompanhar_protocolo');
  }

  if (view === 'register') {
    return (
      <RegisterPage
        onSwitchToLogin={() => setView('login')}
        onSuccess={handleRegisterSuccess}
      />
    );
  }

  if (view === 'chamado_anonimo') {
    return (
      <div style={styles.devContainer}>
        <h2>Formulário de Chamado Anônimo</h2>
        <p>Aqui você criará a tela que consome o endpoint: <strong>POST /api/chamados/anonimo</strong></p>
        <button onClick={() => setView('login')} style={styles.btnVoltar}>Voltar para o Login</button>
      </div>
    );
  }

  if (view === 'acompanhar_protocolo') {
    return (
      <div style={styles.devContainer}>
        <h2>Acompanhar Chamado Público</h2>
        <p>Buscando informações do protocolo: <strong>{protocoloBuscado}</strong></p>
        <p>Aqui você criará a tela que consome o endpoint: <strong>GET /api/chamados/acompanhar/{"{"}protocolo{"}"}</strong></p>
        <button onClick={() => setView('login')} style={styles.btnVoltar}>Voltar para o Login</button>
      </div>
    );
  }

  return (
    <LoginPage
      onSwitchToRegister={() => { setSuccessMsg(''); setView('register'); }}
      successMessage={successMsg}
      onAcessarAnonimo={handleAcessoAnonimo}
      onBuscarProtocolo={handleBuscarProtocolo}
    />
  );
}

const styles = {
  devContainer: {
    padding: '40px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    maxWidth: '500px',
    margin: '100px auto',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    fontFamily: 'sans-serif'
  },
  btnVoltar: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#1A6B3C',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};