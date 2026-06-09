import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

import logo from "../../imgs/logo.png";
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/Auth.service';

import './LoginPage.css';
import { AdminPanelSelector } from './components/AdminPanelSelector';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, setSelectedPanel } = useAuth();

  // Login states
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPanelSelector, setShowPanelSelector] = useState(false);

  // Recovery states
  const [view, setView] = useState<'login' | 'forgot_password' | 'reset_password'>('login');
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Global UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setIsLoading(true);

    try {
      const loggedUser = await signIn(login, password);
      const role = loggedUser.role.toUpperCase();
      const isAdmin = role === 'ADM' || role === 'ADMIN' || role === 'SUPERADMIN';

      if (isAdmin) {
        setShowPanelSelector(true);
        return;
      }

      setSelectedPanel('supervisor');
      navigate('/dashboard');
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Erro ao realizar login.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setIsLoading(true);

    try {
      await authService.requestPasswordReset(resetEmail);
      setSuccessMessage('Código enviado para redefinição de senha');
      setView('reset_password');
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) setError('Usuário não encontrado.');
      else if (status === 429) setError('Você já solicitou recentemente. Há um intervalo de segurança de 5 dias para novos envios.');
      else setError('Erro interno ao solicitar redefinição.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/;
    if (!passwordRegex.test(newPassword)) {
      setError('A senha deve conter pelo menos um caracter maiúsculo, um número e um caracter especial.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword({
        email: resetEmail,
        code: resetCode,
        newPassword
      });
      
      setSuccessMessage('Senha redefinida com sucesso!');
      setView('login');
      setResetCode('');
      setNewPassword('');
      setConfirmPassword('');
      setPassword('');
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 400) setError('Senha inválida (não atende aos requisitos).');
      else if (status === 401) setError('Código inválido ou expirado.');
      else if (status === 404) setError('Usuário não encontrado.');
      else setError('Erro interno ao redefinir senha.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderHeader = (title: string, intro: string) => (
    <>
      <div className="login-app-header">
        <div className="mosquito-logo-placeholder">
          <img src={logo} alt="GeoSaúde" />
        </div>
        <h1>Geo<span className="geo-destaque">Saúde</span></h1>
      </div>
      <div className="login-titles">
        <p className="login-intro">{intro}</p>
        <h2 className="login-large-title">{title}</h2>
      </div>
    </>
  );

  const renderLoginForm = () => (
    <form onSubmit={handleLoginSubmit} className="login-form-mobile">
      {successMessage && <div className="login-success-box">{successMessage}</div>}
      {error && <div className="login-error-box">{error}</div>}

      <div className="form-group-mobile">
        <label>E-mail</label>
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="Digite seu e-mail"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
      </div>

      <div className="form-group-mobile">
        <div className="password-label-row">
          <label>Senha</label>
          <button 
            type="button" 
            className="forgot-password-link"
            onClick={() => {
              clearMessages();
              setResetEmail(login);
              setView('forgot_password');
            }}
          >
            Esqueceu sua senha?
          </button>
        </div>
        <div className="password-input-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="current-password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPassword(prev => !prev)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button type="submit" disabled={isLoading} className="btn-submit-mobile">
        {isLoading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );

  const renderForgotPasswordForm = () => (
    <form onSubmit={handleRequestReset} className="login-form-mobile">
      {error && <div className="login-error-box">{error}</div>}

      <div className="form-group-mobile">
        <label>Seu e-mail de acesso</label>
        <input
          type="email"
          required
          placeholder="Digite seu e-mail"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
        />
      </div>

      <button type="submit" disabled={isLoading || !resetEmail} className="btn-submit-mobile">
        {isLoading ? 'Enviando...' : 'Enviar Código'}
      </button>
      
      <button 
        type="button" 
        className="btn-back-link"
        onClick={() => { clearMessages(); setView('login'); }}
        disabled={isLoading}
      >
        <ArrowLeft size={16} /> Voltar para o Login
      </button>
    </form>
  );

  const renderResetPasswordForm = () => (
    <form onSubmit={handleResetPassword} className="login-form-mobile">
      {successMessage && <div className="login-success-box">{successMessage}</div>}
      {error && <div className="login-error-box">{error}</div>}

      <div className="form-group-mobile">
        <label>Código de Verificação (6 dígitos)</label>
        <input
          type="text"
          required
          placeholder="Ex: 123456"
          value={resetCode}
          onChange={(e) => setResetCode(e.target.value)}
          maxLength={6}
        />
      </div>

      <div className="form-group-mobile">
        <label>Nova Senha</label>
        <div className="password-input-wrapper">
          <input
            type={showNewPassword ? 'text' : 'password'}
            required
            placeholder="Digite sua nova senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowNewPassword(prev => !prev)}
          >
            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="form-group-mobile">
        <label>Confirme a Nova Senha</label>
        <div className="password-input-wrapper">
          <input
            type={showNewPassword ? 'text' : 'password'}
            required
            placeholder="Digite sua nova senha novamente"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      <button type="submit" disabled={isLoading || !resetCode || !newPassword || !confirmPassword} className="btn-submit-mobile">
        {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
      </button>
      
      <button 
        type="button" 
        className="btn-back-link"
        onClick={() => { clearMessages(); setView('login'); }}
        disabled={isLoading}
      >
        <ArrowLeft size={16} /> Voltar para o Login
      </button>
    </form>
  );

  return (
    <div className="login-wrapper">
      <div className="login-card-mobile">
        {view === 'login' && renderHeader('Entrar no Sistema', 'Plataforma de Supervisão Epidemiológica')}
        {view === 'forgot_password' && renderHeader('Recuperar Senha', 'Enviaremos um código para o seu e-mail')}
        {view === 'reset_password' && renderHeader('Nova Senha', 'Informe o código recebido e sua nova senha')}

        {view === 'login' && renderLoginForm()}
        {view === 'forgot_password' && renderForgotPasswordForm()}
        {view === 'reset_password' && renderResetPasswordForm()}
      </div>

      {showPanelSelector && (
        <AdminPanelSelector
          onSupervisor={() => setSelectedPanel('supervisor')}
          onAdmin={() => setSelectedPanel('admin')}
        />
      )}
    </div>
  );
};