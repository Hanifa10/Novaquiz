function formatPassageDate(value) {
  if (!value) return ''

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function ResultCard({ result, onRestart, onSeeLesson }) {
  const {
    quizName = 'Quiz',
    score = 0,
    total = 0,
    datePassage = '',
    correctAnswers = 0,
    wrongAnswers = 0,
  } = result ?? {}

  const formattedDatePassage = formatPassageDate(datePassage)
  const pourcentage = total > 0 ? Math.round((score / total) * 100) : 0

  // Couleur et message selon le score
  const appreciation = (() => {
    if (pourcentage >= 80) return { label: 'Excellent !', color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' }
    if (pourcentage >= 60) return { label: 'Bien joué !', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' }
    return { label: 'À revoir…', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' }
  })()

  // Cercle de progression SVG
  const rayon = 48
  const circonference = 2 * Math.PI * rayon
  const offset = circonference - (pourcentage / 100) * circonference

  return (
    <div
      style={{

        border: `1px solid ${appreciation.border}`,
        borderRadius: '18px',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '480px',
        width: '100%',
        background: `linear-gradient(135deg, var(--bg-card) 0%, ${appreciation.bg} 100%)`,
      }}
    >
      {/* Titre du quiz */}
      <div>
        <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
          Résultat
        </p>
        <h3 style={{ fontFamily: 'Newsreader', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
          {quizName}
        </h3>
        {formattedDatePassage && (
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Passé le {formattedDatePassage}
          </p>
        )}
      </div>

      {/* Score circulaire + détails */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        {/* Cercle SVG */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            {/* Fond du cercle */}
            <circle cx="60" cy="60" r={rayon} fill="none" stroke="var(--border)" strokeWidth="8" />
            {/* Arc de progression */}
            <circle
              cx="60"
              cy="60"
              r={rayon}
              fill="none"
              stroke={appreciation.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circonference}
              strokeDashoffset={offset}
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>
          {/* Pourcentage au centre */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <span style={{ fontFamily: 'Newsreader', fontSize: '22px', fontWeight: 700, color: appreciation.color }}>
              {pourcentage}%
            </span>
          </div>
        </div>

        {/* Détails */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(16,185,129,0.07)',
              border: '1px solid rgba(16,185,129,0.15)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>✓ Correctes</span>
            <span style={{ fontFamily: 'Newsreader', fontWeight: 700, color: '#10b981' }}>{correctAnswers}</span>
          </div>
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.12)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>✗ Incorrectes</span>
            <span style={{ fontFamily: 'Newsreader', fontWeight: 700, color: '#ef4444' }}>{wrongAnswers}</span>
          </div>
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(27,38,59,0.6)',
              border: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Score</span>
            <span style={{ fontFamily: 'Newsreader', fontWeight: 700, color: 'var(--text-primary)' }}>
              {score} / {total}
            </span>
          </div>
        </div>
      </div>

      {/* Badge appréciation */}
      <div
        style={{
          textAlign: 'center',
          padding: '10px',
          borderRadius: '10px',
          background: appreciation.bg,
          border: `1px solid ${appreciation.border}`,
          fontFamily: 'Newsreader',
          fontSize: '16px',
          fontWeight: 700,
          color: appreciation.color,
        }}
      >
        {appreciation.label}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {onSeeLesson && (
          <button
            onClick={onSeeLesson}
            style={{
              flex: 1, padding: '10px', borderRadius: '10px',
              border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500,
              fontFamily: 'Plus Jakarta Sans', cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-violet)'; e.currentTarget.style.color = 'var(--accent-violet-light)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            Voir le cours
          </button>
        )}
        {onRestart && (
          <button
            onClick={onRestart}
            style={{
              flex: 1, padding: '10px', borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              color: '#fff', fontSize: '14px', fontWeight: 600,
              fontFamily: 'Plus Jakarta Sans', cursor: 'pointer',
            }}
          >
            Recommencer
          </button>
        )}
      </div>
    </div>
  )
}

export default ResultCard
