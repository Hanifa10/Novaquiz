
function QuestionCard({ question, children }) {
  const { text = '', number = 1, total = 1 } = question ?? {}

  const progress = (number / total) * 100

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderRadius: '16px',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '680px',
        width: '100%',
      }}
    >
      {/* Barre de progression + compteur */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-violet-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Question
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {number} / {total}
          </span>
        </div>

        {/* Barre de progression */}
        <div
          style={{
            height: '4px',
            background: 'var(--border)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--primary), var(--tertiary))',
              borderRadius: '2px',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* Texte de la question */}
      <h2
        style={{
          fontFamily: 'Newsreader',
          fontSize: '20px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.5,
        }}
      >
        {text}
      </h2>

      {/* Zone des réponses (ReponseCard en enfants) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {children}
      </div>
    </div>
  )
}

export default QuestionCard
