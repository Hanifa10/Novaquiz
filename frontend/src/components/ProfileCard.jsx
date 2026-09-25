
function ProfileCard({ user, onEdit }) {
  const firstName = user?.firstName ?? ''
  const lastName =  user?.lastName ?? ''
  const email = user?.email ?? ''

  const initiales = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase()

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderRadius: '18px',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        maxWidth: '360px',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Décoration de fond */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '80px',
          background: 'linear-gradient(135deg, rgba(65,90,119,0.12), rgba(197,160,89,0.08))',
          borderBottom: '1px solid rgba(65,90,119,0.1)',
        }}
      />

      {/* Avatar anonyme avec initiales */}
      <div style={{ position: 'relative', zIndex: 1, marginTop: '8px' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--tertiary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            fontFamily: 'Newsreader',
            fontWeight: 700,
            color: '#fff',
            border: '3px solid var(--bg-card)',
            boxShadow: '0 4px 20px rgba(65,90,119,0.3)',
          }}
        >
          {initiales || (
            // Icône silhouette si pas d'initiales
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          )}
        </div>
      </div>

      {/* Nom complet */}
      <div style={{ textAlign: 'center' }}>
        <h3
          style={{
            fontFamily: 'Newsreader',
            fontSize: '20px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '4px',
          }}
        >
          {`${firstName} ${lastName}`.trim() || 'Utilisateur'}
        </h3>
        <span
          style={{
            fontSize: '13px',
            color: 'var(--text-muted)',
            padding: '2px 10px',
            borderRadius: '20px',
            background: 'rgba(65,90,119,0.08)',
            border: '1px solid rgba(65,90,119,0.15)',
          }}
        >
          Étudiant
        </span>
      </div>

      {/* Séparateur */}
      <div style={{ width: '100%', height: '1px', background: 'var(--border)' }} />

      {/* Infos de contact */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Email */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'rgba(197,160,89,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent-cyan)', flexShrink: 0,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </span>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '1px' }}>Email</p>
            <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{email || '—'}</p>
          </div>
        </div>

        {/* Prénom */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'rgba(65,90,119,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent-violet-light)', flexShrink: 0,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '1px' }}>Prénom</p>
            <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{firstName || '—'}</p>
          </div>
        </div>

        {/* Nom */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'rgba(65,90,119,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent-violet-light)', flexShrink: 0,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="18" rx="2" ry="2" />
              <line x1="8" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="13" y2="14" />
            </svg>
          </span>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '1px' }}>Nom</p>
            <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{lastName || '—'}</p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ProfileCard
