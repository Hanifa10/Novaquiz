import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LessonForm from '../components/LessonForm'
import { getLessonById, addLesson, editLesson } from '../api/lesson'

function LessonFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const editMode = Boolean(id)

  const [lessonInitial, setLessonInitial] = useState(null)
  const [editLoading, setEditLoading] = useState(editMode)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // En mode édition, on charge le cours existant
  useEffect(() => {
    if (!editMode) return

    async function load() {
      try {
        const data = await getLessonById(id)
        setLessonInitial(data)
      } catch {
        setError('Impossible de charger le cours.')
      } finally {
        setEditLoading(false)
      }
    }

    load()
  }, [id, editMode])

  async function handleSubmit(payload) {
    console.log('[LESSON FORM PAGE] handleSubmit called with:', payload);
    setLoading(true)
    setError('')

    try {
      if (editMode) {
        console.log('[LESSON FORM PAGE] edit mode');
        await editLesson(id, payload)
        navigate(`/lesson/${id}`)
      } else {
        console.log('[LESSON FORM PAGE] create mode, calling addLesson');
        const newLesson = await addLesson(payload)
        console.log('[LESSON FORM PAGE] addLesson returned:', newLesson);
        navigate(`/lesson/${newLesson.id}`)
      }
    } catch (err) {
      console.error('[LESSON FORM PAGE] error:', err);
      setError(
        err.response?.data?.error ??
        err.response?.data?.message ??
        'Une erreur est survenue.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (editLoading) return <Loader />

  return (
    <div style={{ padding: '40px 48px', maxWidth: '800px' }}>
      {/* Bouton retour */}
      <button
        onClick={() => navigate(editMode ? `/lesson/${id}` : '/lesson')}
        style={btnRetourStyle}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
        </svg>
        {editMode ? 'Retour au cours' : 'Retour aux cours'}
      </button>

      <div style={{ marginTop: '28px' }}>
        <LessonForm
          lessonInitial={lessonInitial}
          onSubmit={handleSubmit}
          onCancel={() => navigate(editMode ? `/lesson/${id}` : '/lesson')}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}

function Loader() {
  return (
    <div style={{ padding: '60px 48px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      Chargement…
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

const btnRetourStyle = {
  display: 'flex', alignItems: 'center', gap: '6px',
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'var(--text-muted)', fontSize: '14px', fontFamily: 'Plus Jakarta Sans',
  padding: 0, transition: 'color 0.2s',
}

export default LessonFormPage
