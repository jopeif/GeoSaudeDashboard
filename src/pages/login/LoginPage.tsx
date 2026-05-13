import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import logo from "../../imgs/logo.png"
import { useAuth } from '../../contexts/AuthContext';

import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const { signIn } = useAuth();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setIsLoading(true);

    try {
      await signIn(login, password);

      navigate('/dashboard');
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Erro ao realizar login.';

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
            <img src={logo} alt="" />
          </div>

          <h1>
            Geo<span className="geo-destaque">Saúde</span>
          </h1>
        </div>

        <div className="login-titles">
          <p className="login-intro">
            Plataforma de Supervisão Epidemiológica
          </p>

          <h2 className="login-large-title">
            Entrar no Sistema
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="login-form-mobile">
          
          {error && (
            <div className="login-error-box">
              {error}
            </div>
          )}

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
            <label>Senha</label>

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
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-submit-mobile"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};