import NavBar from './NavBar';


function Header({ user, onProfileClick, activePage, onNavigate }) {
  const firstName = user?.firstName ?? ''
  const lastName =  user?.lastName ?? ''

  // Initiales pour l'avatar
  const initiales = user
    ? `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase()
    : '?'

  return (
    <header
      style={{
        height: '64px',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '0 28px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', minWidth: '170px' }}>
        <span
          style={{
            fontFamily: 'Newsreader',
            fontWeight: 700,
            fontSize: '22px',
            letterSpacing: '-0.3px',
            color: 'white',
          }}
        >
          NovaQuiz
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 0 }}>
        <NavBar activePage={activePage} onNavigate={onNavigate} />
      </div>

      {/* Skipper profil */}
      <button
        onClick={onProfileClick}
        title="Mon profil"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(65,90,119,0.08)',
          border: '1px solid var(--border)',
          borderRadius: '40px',
          padding: '6px 14px 6px 6px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          color: 'var(--text-on-dark)',
          minWidth: '170px',
          justifyContent: 'flex-end',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--accent-violet)'
          e.currentTarget.style.background = 'rgba(65,90,119,0.15)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.background = 'rgba(65,90,119,0.08)'
        }}
      >
        {/* Avatar avec initiales */}
        <span
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--tertiary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Newsreader',
            fontWeight: 700,
            fontSize: '12px',
            color: '#fff',
            flexShrink: 0,
          }}
        >
          {initiales}
        </span>

        {/* Nom affiché */}
        <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '14px', fontWeight: 500 }}>
          {user ? `${firstName} ${lastName}`.trim() || 'Invité' : 'Invité'}
        </span>

        {/* Chevron */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ color: 'var(--neutral-mid)' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </header>
  )
}

export default Header
