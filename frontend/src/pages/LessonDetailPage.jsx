import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import QuizCard from '../components/QuizCard'
import { getLessonById, deleteLesson, getQuizByLesson } from '../api/lesson'

function LessonDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [lesson, setLesson] = useState(null)
  const [quizAssocie, setQuizAssocie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [dataLesson, dataQuiz] = await Promise.all([
          getLessonById(id),
          getQuizByLesson(id).catch(() => null),
        ])
        setLesson(dataLesson)
        setQuizAssocie(dataQuiz)
      } catch {
        setError('Impossible de charger le cours.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  async function handleDelete() {
    if (!window.confirm('Supprimer ce cours definitivement ?')) return
    try {
      await deleteLesson(id)
      navigate('/lesson')
    } catch {
      alert('Impossible de supprimer le cours.')
    }
  }

  if (loading) return <Loader />
  if (error) return (
    <div style={{ padding: '40px 48px' }}>
      <BtnRetour onClick={() => navigate('/lesson')} label="Retour aux cours" />
      <div style={{ marginTop: '24px', padding: '16px 20px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '14px', maxWidth: '480px' }}>{error}</div>
    </div>
  )

  return (
    <div style={{ padding: '40px 48px', maxWidth: '860px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <BtnRetour onClick={() => navigate('/lesson')} label="Retour aux cours" />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => navigate(`/lesson/${id}/edit`)}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '13px', fontFamily: 'Plus Jakarta Sans', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-violet)'; e.currentTarget.style.color = 'var(--accent-violet-light)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Modifier
          </button>
          <button onClick={handleDelete}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)', color: '#ef4444', fontSize: '13px', fontFamily: 'Plus Jakarta Sans', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            </svg>
            Supprimer
          </button>
        </div>
      </div>

      {/* En-tete */}

      <div style={{ height: '1px', background: 'var(--border)', marginBottom: '36px' }} />

      <div style={{ marginBottom: '48px' }}><LessonContent content={lesson.content} /></div>

      {quizAssocie && (
        <div style={{ background: 'linear-gradient(135deg, rgba(197,160,89,0.08) 0%, rgba(65,90,119,0.06) 100%)', border: '1px solid rgba(197,160,89,0.2)', borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ fontFamily: 'Newsreader', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Tester ses connaissances
          </h2>
          <QuizCard quiz={quizAssocie} onClick={() => navigate(`/quiz/${quizAssocie.id}/start`)} />
        </div>
      )}
    </div>
  )
}

function LessonContent({ content }) {
  if (!content) return <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '15px' }}>Le contenu de ce cours n'est pas encore disponible.</p>
  if (Array.isArray(content)) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {content.map((section, i) => (
          <section key={i}>
            {section.name && <h2 style={{ fontFamily: 'Newsreader', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>{section.name}</h2>}
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{section.content}</p>
          </section>
        ))}
      </div>
    )
  }
  return <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{content}</p>
}

function BtnRetour({ onClick, label }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '14px', fontFamily: 'Plus Jakarta Sans', padding: 0 }}
      onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)' }}
      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
      {label}
    </button>
  )
}

function Loader() {
  return (
    <div style={{ padding: '60px 48px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      Chargement du cours...
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default LessonDetailPage
