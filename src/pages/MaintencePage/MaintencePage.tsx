// src/pages/MaintenancePage/MaintenancePage.tsx

export function MaintenancePage() {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f8fafc',
        padding: '24px',
        textAlign: 'center'
      }}
    >
      <h1
        style={{
          fontSize: '32px',
          marginBottom: '16px',
          color: '#0f172a'
        }}
      >
        Sistema em manutenção
      </h1>

      <p
        style={{
          maxWidth: '500px',
          color: '#64748b',
          lineHeight: 1.6
        }}
      >
        Estamos realizando atualizações para melhorar a plataforma.
        Voltaremos em breve...
      </p>
    </div>
  );
}