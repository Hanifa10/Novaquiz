import { useState } from 'react'

function LessonForm({ lessonInitial = null, onSubmit, onCancel, loading = false, error = '' }) {
  const editMode = lessonInitial !== null

  const [name, setName] = useState(lessonInitial?.name ?? '')
  const [content, setContent] = useState(lessonInitial?.content  ?? '')

  function handleSubmit(e) {
    console.log('[LESSON FORM] handleSubmit called');
    e.preventDefault()
    console.log('[LESSON FORM] calling onSubmit with:', { name, content});
    onSubmit({ name, content})
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid var(--border)',
    background: 'var(--neutral)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    fontFamily: 'Plus Jakarta Sans',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  const labelStyle = {
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    marginBottom: '6px',
    display: 'block',
  }

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '720px',
        width: '100%',
      }}
    >
      <h2
        style={{
          fontFamily: 'Newsreader',
          fontSize: '20px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '24px',
        }}
      >
        {editMode ? 'Modifier le cours' : 'Nouveau cours'}
      </h2>

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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Titre */}
        <div>
          <label style={labelStyle}>Titre *</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ex : Introduction à JavaScript"
            required
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = 'var(--accent-violet)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)' }}
          />
        </div>

        {/* Contenu */}
        <div>
          <label style={labelStyle}>Contenu du cours *</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Écris le contenu du cours ici. Tu peux utiliser ## Titre de section pour structurer."
            rows={12}
            required
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.8, fontFamily: 'monospace', fontSize: '13px' }}
            onFocus={e => { e.target.style.borderColor = 'var(--accent-violet)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)' }}
          />
        </div>

        {/* Boutons */}
        <div style={{ display: 'flex', gap: '12px', paddingTop: '4px' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '10px 24px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: '14px',
              fontFamily: 'Plus Jakarta Sans',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text-muted)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            Annuler
          </button>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 28px',
              borderRadius: '10px',
              border: 'none',
              background: loading
                ? 'rgba(65,90,119,0.4)'
                : 'linear-gradient(135deg, var(--primary), var(--secondary))',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'Plus Jakarta Sans',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {loading && <Spinner />}
            {editMode ? 'Enregistrer les modifications' : 'Créer le cours'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Spinner() {
  return (
    <>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  )
}

export default LessonForm
