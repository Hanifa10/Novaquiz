
function LessonCard({ lesson, onClick }) {
  const { name = 'Cours sans titre'} = lesson ?? {}

  return (
    <article
      onClick={onClick}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderRadius: '14px',
        padding: '20px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--accent-violet)'
        e.currentTarget.style.background = 'var(--bg-card-hover)'
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(65,90,119,0.12)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.background = 'var(--bg-card)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Décoration coin */}
      <span
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '80px',
          height: '80px',
          background: 'radial-gradient(circle at top right, rgba(65,90,119,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Icône livre */}
      <span
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'rgba(65,90,119,0.12)',
          border: '1px solid rgba(65,90,119,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-violet-light)',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      </span>

      {/* Titre */}
      <h3
        style={{
          fontFamily: 'Newsreader',
          fontSize: '16px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.3,
        }}
      >
        {name}
      </h3>
    </article>
  )
}

export default LessonCard
