import { useState, useEffect } from 'react'
import { getLessonsByUser } from '../api/lesson'

function QuizForm({ quizInitial = null, onSubmit, onCancel, loading = false, error = '' }) {
  const editMode = quizInitial !== null

  const [name, setName] = useState(quizInitial?.name ?? '')
  const [lessonId, setLessonId] = useState(quizInitial?.lessonId ?? '')
  const [lessonList, setLessonList] = useState([])
  const [lessonLoading, setLessonLoading] = useState(true)

  // Charge la liste des cours pour le select
  useEffect(() => {
    async function load() {
      try {
        const data = await getLessonsByUser()
        setLessonList(Array.isArray(data) ? data : [])
      } catch {
        
      } finally {
        setLessonLoading(false)
      }
    }
    load()
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ name, lessonId })
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
        maxWidth: '560px',
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
        {editMode ? 'Modifier le quiz' : 'Nouveau quiz'}
      </h2>

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
          <label style={labelStyle}>Titre du quiz *</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ex : Quiz JS Fondamentaux"
            required
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = 'var(--accent-cyan)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)' }}
          />
        </div>

        {/* Cours associé */}
        <div>
          <label style={labelStyle}>Cours associé *</label>
          {lessonLoading ? (
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '10px 0' }}>
              Chargement des cours…
            </div>
          ) : lessonList.length > 0 ? (
            <select
              value={lessonId}
              onChange={e => setLessonId(e.target.value)}
              required
              style={{
                ...inputStyle,
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                paddingRight: '36px',
              }}
            >
              <option value="">-- Sélectionner un cours --</option>
              {lessonList.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          ) : (
            // Fallback si pas de cours dispo : saisie manuelle de l'id
            <input
              type="text"
              value={lessonId}
              onChange={e => setLessonId(e.target.value)}
              placeholder="ID du cours associé"
              required
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'var(--accent-cyan)' }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)' }}
            />
          )}
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
            Un cours ne peut avoir qu&apos;un seul quiz.
          </p>
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
            }}
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
            {editMode ? 'Enregistrer' : 'Créer le quiz'}
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

export default QuizForm
