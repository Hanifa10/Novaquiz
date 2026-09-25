import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import QuizForm from '../components/QuizForm'
import { getQuizById, addQuiz, editQuiz } from '../api/quiz'


function QuizFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const editMode = Boolean(id)

  const [quizInitial, setQuizInitial] = useState(null)
  const [editLoading, setEditLoading] = useState(editMode)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!editMode) return
    async function load() {
      try {
        const data = await getQuizById(id)
        setQuizInitial(data)
      } catch {
        setError('Impossible de charger le quiz.')
      } finally {
        setEditLoading(false)
      }
    }
    load()
  }, [id, editMode])

  async function handleSubmit(payload) {
    setLoading(true)
    setError('')
    try {
      if (editMode) {
        await editQuiz(id, payload)
        navigate(`/quiz/${id}/questions`)
      } else {
        const newQuiz = await addQuiz(payload)
        navigate(`/quiz/${newQuiz.id}/questions`)
      }
    } catch (err) {
      setError(err.response?.data?.message ?? 'Une erreur est survenue.')
      setLoading(false)
    }
  }

  if (editLoading) return <Loader />

  return (
    <div style={{ padding: '40px 48px', maxWidth: '660px' }}>
      <button
        onClick={() => navigate(editMode ? `/quiz/${id}/questions` : '/quiz')}
        style={btnRetourStyle}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
        </svg>
        {editMode ? 'Retour aux questions' : 'Retour aux quiz'}
      </button>

      <div style={{ marginTop: '28px' }}>
        <QuizForm
          quizInitial={quizInitial}
          onSubmit={handleSubmit}
          onCancel={() => navigate(editMode ? `/quiz/${id}/questions` : '/quiz')}
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

export default QuizFormPage
