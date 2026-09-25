
function QuizCard({ quiz, onClick }) {
  const {
    name = 'Quiz sans titre',
    nbQuestions = 0,
    lessonAssocie = '',
  } = quiz ?? {}

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
        e.currentTarget.style.borderColor = 'var(--accent-cyan)'
        e.currentTarget.style.background = 'var(--bg-card-hover)'
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(197,160,89,0.10)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.background = 'var(--bg-card)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Décoration */}
      <span
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '80px',
          height: '80px',
          background: 'radial-gradient(circle at top right, rgba(197,160,89,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Icône quiz */}
      <span
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'rgba(197,160,89,0.10)',
          border: '1px solid rgba(197,160,89,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-cyan)',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
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

      {/* Cours associé */}
      {lessonAssocie && (
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Cours : <span style={{ color: 'var(--accent-violet-light)' }}>{lessonAssocie}</span>
        </p>
      )}

      {/* Infos bas de carte */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: 'auto' }}>
        {nbQuestions > 0 && (
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            {nbQuestions} questions
          </span>
        )}

        {/* Bouton Commencer */}
        <button
          onClick={e => { e.stopPropagation(); onClick && onClick() }}
          style={{
            marginLeft: 'auto',
            padding: '6px 16px',
            borderRadius: '8px',
            border: '1px solid var(--accent-cyan)',
            background: 'rgba(197,160,89,0.08)',
            color: 'var(--accent-cyan)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Plus Jakarta Sans',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(197,160,89,0.18)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(197,160,89,0.08)'
          }}
        >
          Commencer
        </button>
      </div>
    </article>
  )
}

export default QuizCard
