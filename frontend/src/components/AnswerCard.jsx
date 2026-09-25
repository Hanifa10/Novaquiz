
function AnswerCard({ answer, state = 'default', onClick, disabled = false }) {
  const { id, text = '' } = answer ?? {}

  // Styles selon l'état
  const statesStyles = {
    default: {
      border: '1px solid var(--border)',
      background: 'rgba(10,15,30,0.4)',
      color: 'var(--text-primary)',
      iconBg: 'rgba(27,38,59,0.8)',
      iconColor: 'var(--text-muted)',
    },
    selected: {
      border: '1px solid var(--accent-violet)',
      background: 'rgba(65,90,119,0.1)',
      color: 'var(--text-primary)',
      iconBg: 'rgba(65,90,119,0.2)',
      iconColor: 'var(--accent-violet-light)',
    },
    correct: {
      border: '1px solid rgba(16,185,129,0.6)',
      background: 'rgba(16,185,129,0.08)',
      color: '#10b981',
      iconBg: 'rgba(16,185,129,0.15)',
      iconColor: '#10b981',
    },
    incorrect: {
      border: '1px solid rgba(239,68,68,0.5)',
      background: 'rgba(239,68,68,0.07)',
      color: '#ef4444',
      iconBg: 'rgba(239,68,68,0.12)',
      iconColor: '#ef4444',
    },
  }

  const style = statesStyles[state] ?? statesStyles.default

  // Icône selon l'état
  const renderStateIcon = () => {
    if (state === 'correct') return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    )
    if (state === 'incorrect') return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    )
    if (state === 'selected') return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="6" />
      </svg>
    )
    return null
  }

  return (
    <button
      onClick={() => !disabled && onClick && onClick(id)}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '14px 16px',
        borderRadius: '10px',
        border: style.border,
        background: style.background,
        color: style.color,
        cursor: disabled ? 'default' : 'pointer',
        textAlign: 'left',
        fontFamily: 'Plus Jakarta Sans',
        fontSize: '15px',
        fontWeight: state === 'default' ? 400 : 500,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        transition: 'all 0.2s ease',
        lineHeight: 1.4,
      }}
      onMouseEnter={e => {
        if (!disabled && state === 'default') {
          e.currentTarget.style.borderColor = 'var(--accent-violet)'
          e.currentTarget.style.background = 'rgba(65,90,119,0.06)'
        }
      }}
      onMouseLeave={e => {
        if (!disabled && state === 'default') {
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.background = 'rgba(10,15,30,0.4)'
        }
      }}
    >
      {/* Indicateur d'état */}
      <span
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: style.iconBg,
          color: style.iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          border: state === 'selected' ? '1px solid var(--accent-violet)' : '1px solid transparent',
        }}
      >
        {renderStateIcon()}
      </span>

      {text}
    </button>
  )
}

export default AnswerCard
