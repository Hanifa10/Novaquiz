import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import QuestionForm from '../components/QuestionForm'
import {
  getQuizById,
  getQuestions,
  addQuestion,
  editQuestion,
  deleteQuestion,
} from '../api/quiz'

function QuizEditPage() {
  const navigate = useNavigate()
  const { id: quizId } = useParams()

  const [quiz, setQuiz] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Formulaire : null = caché, 'nouveau' = création, objet = édition
  const [questionOnEdit, setQuestionOnEdit] = useState(null)
  const [loadingForm, setLoadingForm] = useState(false)
  const [errorForm, setErrorForm] = useState('')

  // ── Chargement initial ─────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const [dataQuiz, dataQuestions] = await Promise.all([
          getQuizById(quizId),
          getQuestions(quizId),
        ])
        setQuiz(dataQuiz)
        setQuestions(Array.isArray(dataQuestions) ? dataQuestions : [])
      } catch {
        setErreur('Impossible de charger le quiz.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [quizId])

  // ── Ajouter une question ───────────────────────────────────────────────────
  async function handleAddQuestion(payload) {
    setLoadingForm(true)
    setErrorForm('')
    try {
      const newQuestion = await addQuestion(quizId, payload)
      setQuestions(prev => [...prev, newQuestion])
      setQuestionOnEdit(null)
    } catch (err) {
      setErrorForm(err.answer?.data?.message ?? 'Erreur lors de la création.')
    } finally {
      setLoadingForm(false)
    }
  }

  // ── Modifier une question ──────────────────────────────────────────────────
  async function handleEditQuestion(payload) {
    setLoadingForm(true)
    setErrorForm('')
    try {
      const updated = await editQuestion(quizId, questionOnEdit.id, payload)
      setQuestions(prev => prev.map(q => q.id === updated.id ? updated : q))
      setQuestionOnEdit(null)
    } catch (err) {
      setErrorForm(err.answer?.data?.message ?? 'Erreur lors de la modification.')
    } finally {
      setLoadingForm(false)
    }
  }

  // ── Supprimer une question ─────────────────────────────────────────────────
  async function handleDeleteQuestion(questionId) {
    if (!window.confirm('Supprimer cette question ?')) return
    try {
      await deleteQuestion(quizId, questionId)
      setQuestions(prev => prev.filter(q => q.id !== questionId))
    } catch {
      alert('Impossible de supprimer la question.')
    }
  }

  // ── Rendu ──────────────────────────────────────────────────────────────────
  if (loading) return <Loader />
  if (error) return <MessageErreur message={error} onRetour={() => navigate('/quiz')} />

  const formVisible = questionOnEdit !== null

  return (
    <div style={{ padding: '40px 48px', maxWidth: '860px' }}>
      <button
        onClick={() => navigate('/quiz')}
        style={btnRetourStyle}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
        </svg>
        Retour aux quiz
      </button>

      {/* En-tête */}
      <div style={{ margin: '24px 0 32px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'Newsreader', fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            {quiz?.name}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {questions.length} question{questions.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* ── Liste des questions ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
        {questions.length === 0 && !formVisible && (
          <div style={{ padding: '40px', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: '14px', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '14px' }}>Aucune question pour l&apos;instant. Ajoutes-en une ci-dessous !</p>
          </div>
        )}

        {questions.map((q, index) => (
          <QuestionCard
            key={q.id}
            question={q}
            number={index + 1}
            onEdit={() => { setQuestionOnEdit(q); setErrorForm('') }}
            onDelete={() => handleDeleteQuestion(q.id)}
          />
        ))}
      </div>

      {/* ── Formulaire question (création ou édition) ──────────────────────── */}
      {formVisible && (
        <div style={{ marginBottom: '24px' }}>
          <QuestionForm
            questionInitial={questionOnEdit === 'nouveau' ? null : questionOnEdit}
            onSubmit={questionOnEdit === 'nouveau' ? handleAddQuestion : handleEditQuestion}
            onCancel={() => { setQuestionOnEdit(null); setErrorForm('') }}
            loading={loadingForm}
            error={errorForm}
          />
        </div>
      )}

      {/* Bouton "Ajouter une question" */}
      {!formVisible && (
        <button
          onClick={() => { setQuestionOnEdit('nouveau'); setErrorForm('') }}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', borderRadius: '10px',
            border: '1px dashed rgba(65,90,119,0.4)',
            background: 'rgba(124,58,237,0.05)',
            color: 'var(--accent-violet-light)',
            fontSize: '14px', fontWeight: 600, fontFamily: 'Plus Jakarta Sans',
            cursor: 'pointer', width: '100%', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(65,90,119,0.1)'; e.currentTarget.style.borderColor = 'var(--accent-violet)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.05)'; e.currentTarget.style.borderColor = 'rgba(65,90,119,0.4)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Ajouter une question
        </button>
      )}
    </div>
  )
}

// ─── Carte d'une question existante ──────────────────────────────────────────
function QuestionCard({ question, number, onEdit, onDelete }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}
    >
      {/* En-tête de la question */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '14px 18px', cursor: 'pointer',
        }}
        onClick={() => setOpen(!open)}
      >
        <span
          style={{
            width: '26px', height: '26px', borderRadius: '8px', flexShrink: 0,
            background: 'rgba(65,90,119,0.12)', border: '1px solid rgba(65,90,119,0.2)',
            color: 'var(--accent-violet-light)', fontSize: '12px', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {number}
        </span>

        <p style={{ flex: 1, fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.4 }}>
          {question.text ?? question.question}
        </p>

        <span style={{ fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0 }}>
          {question.answers?.length ?? 0} rép.
        </span>

        {/* Chevron */}
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{ color: 'var(--text-muted)', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* Réponses (accordéon) */}
      {open && (
        <div style={{ padding: '0 18px 16px', borderTop: '1px solid var(--border)' }}>
          <div style={{ paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {(question.answers ?? []).map((r, i) => (
              <div
                key={r.id ?? i}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '7px 10px', borderRadius: '8px',
                  background: r.isCorrect ? 'rgba(16,185,129,0.07)' : 'rgba(10,15,30,0.3)',
                  border: `1px solid ${r.isCorrect ? 'rgba(16,185,129,0.2)' : 'var(--border)'}`,
                }}
              >
                <span style={{ fontSize: '13px', color: r.isCorrect ? '#10b981' : 'var(--text-muted)', flexShrink: 0 }}>
                  {r.isCorrect ? '✓' : '○'}
                </span>
                <span style={{ fontSize: '13px', color: r.isCorrect ? '#10b981' : 'var(--text-secondary)' }}>
                  {r.text}
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
            <button
              onClick={onEdit}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 14px', borderRadius: '7px',
                border: '1px solid var(--border)', background: 'transparent',
                color: 'var(--text-secondary)', fontSize: '13px', fontFamily: 'Plus Jakarta Sans',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-violet)'; e.currentTarget.style.color = 'var(--accent-violet-light)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Modifier
            </button>
            <button
              onClick={onDelete}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 14px', borderRadius: '7px',
                border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.05)',
                color: '#ef4444', fontSize: '13px', fontFamily: 'Plus Jakarta Sans',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.05)' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
              </svg>
              Supprimer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Utilitaires ──────────────────────────────────────────────────────────────
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

function MessageErreur({ message, onRetour }) {
  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ padding: '16px 20px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '14px', maxWidth: '480px', marginBottom: '12px' }}>
        {message}
      </div>
      <button onClick={onRetour} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '14px', fontFamily: 'Plus Jakarta Sans' }}>
        ← Retour aux quiz
      </button>
    </div>
  )
}

const btnRetourStyle = {
  display: 'flex', alignItems: 'center', gap: '6px',
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'var(--text-muted)', fontSize: '14px', fontFamily: 'Plus Jakarta Sans',
  padding: 0, transition: 'color 0.2s',
}

export default QuizEditPage
