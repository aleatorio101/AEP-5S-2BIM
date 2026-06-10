import { useState } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

export default function AuthPage() {
  const [view, setView] = useState('login');
  const [successMsg, setSuccessMsg] = useState('');

  function handleRegisterSuccess() {
    setSuccessMsg('Conta criada com sucesso! Faça login para continuar.');
    setView('login');
  }

  if (view === 'register') {
    return (
      <RegisterPage
        onSwitchToLogin={() => setView('login')}
        onSuccess={handleRegisterSuccess}
      />
    );
  }

  return (
    <LoginPage
      onSwitchToRegister={() => { setSuccessMsg(''); setView('register'); }}
      successMessage={successMsg}
    />
  );
}