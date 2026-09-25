import { useState } from 'react'

function LoginForm({ onSubmit, onGoRegister, loading = false, error = '' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (onSubmit) onSubmit({ email, password })
  }

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '10px',
    border: '1px solid var(--border)',
    background: 'var(--neutral)',
    color: 'var(--text-primary)',
    fontSize: '15px',
    fontFamily: 'Plus Jakarta Sans',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderRadius: '18px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
      }}
    >
      {/* En-tête */}
      <h2
        style={{
          fontFamily: 'Newsreader',
          fontSize: '26px',
          fontWeight: 700,
          marginBottom: '6px',
          color: 'var(--text-primary)',
        }}
      >
        Connexion
      </h2>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '28px' }}>
        Bon retour sur NovaQuiz
      </p>

      {/* Message d'erreur */}
      {error && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '8px',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
            color: '#ef4444',
            fontSize: '14px',
            marginBottom: '20px',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Adresse email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="vous@exemple.com"
            required
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = 'var(--accent-violet)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Mot de passe
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{ ...inputStyle, paddingRight: '44px' }}
              onFocus={e => { e.target.style.borderColor = 'var(--accent-violet)' }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: 0,
                display: 'flex',
              }}
            >
              {showPassword
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
          </div>
        </div>

        {/* Bouton Se connecter */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            border: 'none',
            background: loading
              ? 'rgba(65,90,119,0.4)'
              : 'linear-gradient(135deg, var(--primary), var(--secondary))',
            color: '#fff',
            fontSize: '15px',
            fontWeight: 600,
            fontFamily: 'Plus Jakarta Sans',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '4px',
            transition: 'opacity 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          {loading && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          )}
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>

      {/* Lien inscription */}
      <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)', marginTop: '24px' }}>
        Pas encore de compte ?{' '}
        <button
          onClick={onGoRegister}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent-violet-light)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '14px',
            fontFamily: 'Plus Jakarta Sans',
          }}
        >
          Créer un compte
        </button>
      </p>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default LoginForm
