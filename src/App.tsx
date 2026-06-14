import { useEffect, useState } from 'react';
import './App.css';
import { MapPin, ChevronRight, CheckCircle, BarChart3, Users, Sun, Moon } from 'lucide-react';
import logoTrans from './assets/logoTrans.png';

function App() {
  const [isDark, setIsDark] = useState(false);

  // Toggle Dark Mode
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up');
          entry.target.classList.remove('opacity-0');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="app-wrapper">
      {/* HEADER */}
      <header className="glass" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000, transition: 'all 0.3s ease' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px var(--padding-horizontal)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={logoTrans} alt="GeoSaúde Logo" style={{ height: '36px', objectFit: 'contain' }} />
          </div>
          <nav className="desktop-nav" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <a href="#sobre" className="body-text" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Plataforma</a>
            <a href="#como-funciona" className="body-text" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Funcionalidades</a>
            
            <button 
              onClick={toggleTheme} 
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Alternar Tema"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <a href="https://geo-saude-dashboard.vercel.app" className="btn btn-primary" style={{ height: '40px', padding: '0 20px', borderRadius: '6px' }}>
              Entrar no Sistema
            </a>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '120px' }}>
        <div className="container grid-2">
          <div className="reveal opacity-0">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '20px', fontSize: '14px', fontWeight: 600, marginBottom: '24px' }}>
               Sistema de Supervisão Epidemiológica
            </div>
            <h1 className="title-main" style={{ fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 1.15, marginBottom: '24px' }}>
              Inteligência e <span style={{ color: 'var(--primary)' }}>Precisão</span> na Saúde Pública
            </h1>
            <p className="subtitle" style={{ fontSize: 'clamp(16px, 2vw, 20px)', marginBottom: '40px', maxWidth: '540px', lineHeight: 1.6 }}>
              Uma plataforma robusta para otimizar o trabalho de supervisores e agentes de saúde, com análise de dados em tempo real e mapas de calor epidemiológicos.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a href="https://geo-saude-dashboard.vercel.app" className="btn btn-primary">
                Acessar Painel <ChevronRight size={18} />
              </a>
              <a href="#sobre" className="btn btn-secondary">
                Ver Documentação
              </a>
            </div>
            <div style={{ marginTop: '48px', display: 'flex', gap: '32px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={20} color="var(--primary)" />
                <span className="body-text" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Dados em Tempo Real</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={20} color="var(--primary)" />
                <span className="body-text" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Mapa de Calor</span>
              </div>
            </div>
          </div>
          <div className="reveal delay-200 opacity-0" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            {/* Abstract Dashboard Mockup */}
            <div style={{ width: '100%', maxWidth: '600px', backgroundColor: 'var(--card-background)', borderRadius: '16px', border: '1px solid var(--input-border)', boxShadow: 'var(--card-elevation)', overflow: 'hidden' }}>
              {/* Dashboard Header Mock */}
              <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--input-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EF4444' }}></div>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F59E0B' }}></div>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981' }}></div>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Painel de Supervisão</div>
              </div>
              {/* Dashboard Content Mock */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div style={{ backgroundColor: 'var(--primary)', color: 'var(--background)', padding: '16px', borderRadius: '8px', border: '1px solid var(--input-border)' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, opacity: 0.9, marginBottom: '8px' }}>TOTAL DE VISITAS</div>
                    <div style={{ fontSize: '28px', fontWeight: 700 }}>290</div>
                  </div>
                  <div style={{ backgroundColor: 'var(--background)', padding: '16px', borderRadius: '8px', border: '1px solid var(--input-border)' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>VISITAS INSPECIONADAS</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>229</div>
                  </div>
                  <div style={{ backgroundColor: 'var(--background)', padding: '16px', borderRadius: '8px', border: '1px solid var(--input-border)' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>CASAS COM FOCO</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#EF4444' }}>9</div>
                  </div>
                </div>
                {/* Chart Mock */}
                <div style={{ height: '180px', backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--input-border)', position: 'relative', padding: '16px' }}>
                   <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>EVOLUÇÃO DE VISITAS</div>
                   {/* Fake chart lines */}
                   <svg style={{ position: 'absolute', bottom: '20px', left: '20px', width: 'calc(100% - 40px)', height: '100px', overflow: 'visible' }}>
                     <path d="M0,80 Q50,90 100,70 T200,60 T300,80 T400,50 T500,40" fill="none" stroke="var(--primary)" strokeWidth="2" />
                     <path d="M0,95 L500,95" fill="none" stroke="#EF4444" strokeWidth="2" />
                   </svg>
                </div>
              </div>
            </div>
            
            {/* Floating Element */}
            <div className="glass reveal delay-300 opacity-0" style={{ position: 'absolute', bottom: '-20px', right: '-20px', padding: '16px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
               <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BarChart3 size={20} color="var(--primary)" />
               </div>
               <div>
                 <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Taxa de Infestação</div>
                 <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '18px' }}>3.93%</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="sobre" className="section" style={{ backgroundColor: 'var(--card-background)', borderTop: '1px solid var(--input-border)', borderBottom: '1px solid var(--input-border)' }}>
        <div className="container text-center reveal opacity-0">
          <h2 className="title-main">A Plataforma <span style={{ color: 'var(--primary)' }}>GeoSaúde</span></h2>
          <p className="subtitle" style={{ maxWidth: '800px', margin: '0 auto 64px auto' }}>
            Desenhado para supervisores e agentes de saúde, integrando um painel analítico robusto com dados coletados diretamente no campo.
          </p>
          
          <div className="grid-3">
            <div className="card reveal delay-100 opacity-0" style={{ textAlign: 'left' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <BarChart3 size={24} color="var(--primary)" />
              </div>
              <h3 className="body-large" style={{ fontWeight: 600, marginBottom: '12px' }}>Painel de Supervisão</h3>
              <p className="body-text" style={{ color: 'var(--text-secondary)' }}>
                Acompanhe o total de visitas, depósitos tratados e a taxa de infestação de forma centralizada.
              </p>
            </div>

            <div className="card reveal delay-200 opacity-0" style={{ textAlign: 'left' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <MapPin size={24} color="var(--primary)" />
              </div>
              <h3 className="body-large" style={{ fontWeight: 600, marginBottom: '12px' }}>Mapa de Calor Epidemiológico</h3>
              <p className="body-text" style={{ color: 'var(--text-secondary)' }}>
                Identifique instantaneamente os focos através do mapa interativo integrado, melhorando a tomada de decisão.
              </p>
            </div>

            <div className="card reveal delay-300 opacity-0" style={{ textAlign: 'left' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Users size={24} color="var(--primary)" />
              </div>
              <h3 className="body-large" style={{ fontWeight: 600, marginBottom: '12px' }}>Gestão de Agentes</h3>
              <p className="body-text" style={{ color: 'var(--text-secondary)' }}>
                Gerencie facilmente a atividade dos agentes e supervisores no sistema.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="como-funciona" className="section" style={{ backgroundColor: 'var(--background)' }}>
        <div className="container">
          <div className="grid-2">
            <div className="reveal opacity-0">
              <h2 className="title-main">Login Rápido e Seguro</h2>
              <p className="subtitle" style={{ marginBottom: '40px' }}>
                Acesse o sistema com facilidade usando as credenciais institucionais, seja como Agente ou Supervisor.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>1</div>
                  <div>
                    <h4 className="body-large" style={{ fontWeight: 600 }}>Acesse a Plataforma</h4>
                    <p className="body-text" style={{ color: 'var(--text-secondary)' }}>Disponível web ou mobile para flexibilidade em campo ou escritório.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>2</div>
                  <div>
                    <h4 className="body-large" style={{ fontWeight: 600 }}>Autenticação Segura</h4>
                    <p className="body-text" style={{ color: 'var(--text-secondary)' }}>Controles de acesso rigorosos para proteção de dados de saúde.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="reveal delay-200 opacity-0" style={{ display: 'flex', justifyContent: 'center' }}>
              {/* Login Page Mock */}
              <div className="card" style={{ width: '100%', maxWidth: '380px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'var(--card-background)' }}>
                 <div style={{ marginBottom: '16px' }}>
                    <img src={logoTrans} alt="GeoSaúde" style={{ height: '48px', objectFit: 'contain' }} />
                 </div>
                 <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plataforma de Supervisão</div>
                 <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '32px', color: 'var(--text-primary)' }}>Entrar no Sistema</div>
                 
                 <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label className="caption" style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>E-mail</label>
                      <input type="text" className="input-field" placeholder="Digite seu e-mail" disabled />
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <label className="caption" style={{ fontWeight: 500 }}>Senha</label>
                        <span className="caption" style={{ color: 'var(--primary)', cursor: 'pointer' }}>Esqueceu sua senha?</span>
                      </div>
                      <input type="password" className="input-field" placeholder="Digite sua senha" disabled />
                    </div>
                    <a href="https://geo-saude-dashboard.vercel.app" className="btn btn-primary" style={{ width: '100%', marginTop: '8px', borderRadius: '8px' }}>
                      Entrar
                    </a>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: 'var(--card-background)', padding: '48px 0 24px 0', borderTop: '1px solid var(--input-border)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={logoTrans} alt="GeoSaúde" style={{ height: '32px', objectFit: 'contain' }} />
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              <a href="#" className="body-text" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Termos de Uso</a>
              <a href="#" className="body-text" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Privacidade</a>
              <a href="#" className="body-text" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Suporte</a>
            </div>
          </div>
          <div style={{ marginTop: '48px', textAlign: 'center', borderTop: '1px solid var(--input-border)', paddingTop: '24px' }}>
            <p className="caption">© 2026 GeoSaúde. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
