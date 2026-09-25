const navItems = [
  { id: 'home', label: 'Accueil' },
  { id: 'lesson', label: 'Cours' },
  { id: 'quiz', label: 'Quiz' },
]

function NavBar({ activePage = 'home', onNavigate }) {
  function handleNav(id) {
    if (onNavigate) onNavigate(id)
  }

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        flex: 1,
        minWidth: 0,
      }}
    >
      {navItems.map(({ id, label }) => {
        const isActive = activePage === id

        return (
          <button
            key={id}
            type="button"
            onClick={() => handleNav(id)}
            title={label}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 12px 8px',
              border: 'none',
              background: 'transparent',
              color: isActive ? 'var(--text-on-dark)' : 'var(--neutral-mid)',
              cursor: 'pointer',
              fontFamily: 'Plus Jakarta Sans',
              fontSize: '14px',
              fontWeight: isActive ? 600 : 500,
              borderRadius: '10px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              if (!isActive) e.currentTarget.style.color = 'var(--text-on-dark)'
            }}
            onMouseLeave={e => {
              if (!isActive) e.currentTarget.style.color = 'var(--neutral-mid)'
            }}
          >
            <span style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
              {label}
              {isActive && (
                <span
                  style={{
                    width: '100%',
                    height: '2px',
                    borderRadius: '999px',
                    background: 'linear-gradient(90deg, var(--primary), var(--tertiary))',
                    marginTop: '6px',
                    display: 'block',
                  }}
                />
              )}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

export default NavBar
