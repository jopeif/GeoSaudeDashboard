import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/Auth.service';
import "./LoginPage.css"

export const LoginPage: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await authService.login(login, password);
      
      if (data.success) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      // Pega a mensagem da API ou um fallback amigável
      const message = err.response?.data?.message || 'Erro ao conectar com o servidor.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card-mobile">
        <div className="login-app-header">
          <div className="mosquito-logo-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>
                <path d="M12 8v4"/><path d="M12 16h.01"/>
            </svg>
          </div>
          <h1>Geo<span className="geo-destaque">Saúde</span></h1>
        </div>

        <div className="login-titles">
          <p className="login-intro">Bem vindo ao <span className="geo-destaque">GeoSaúde</span></p>
          <h2 className="login-large-title">Login</h2>
        </div>

        <form onSubmit={handleSubmit} className="login-form-mobile">
          {error && <div className="login-error-box">{error}</div>}

          <div className="form-group-mobile">
            <label>Coloque seu e-mail</label>
            <input
              type="email"
              required
              placeholder="E-mail"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>

          <div className="form-group-mobile">
            <label>Coloque sua senha</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.88 9.88L14.12 14.12M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7ZM12 9a3 3 0 103 3M4.35 4.35l15.3 15.3"/></svg>
                ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          <span className="forgot-password-link">Esqueceu sua senha?</span>

          <button type="submit" disabled={isLoading} className="btn-submit-mobile">
            {isLoading ? 'Acessando...' : 'Entrar'}
          </button>
        </form>

        <div className="login-footer-mobile">
          <p>Não tem conta? <span className="link-green">Cadastre-se</span></p>
        </div>
      </div>
    </div>
  );
};