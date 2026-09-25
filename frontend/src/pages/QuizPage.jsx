import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import QuestionCard from '../components/QuestionCard'
import AnswerCard from '../components/AnswerCard'
import ResultCard from '../components/ResultCard'
import { getQuizById, getQuestions, answeringQuestion } from '../api/quiz'
import { saveResult } from '../api/user'

function QuizPage() {
  const navigate = useNavigate()
  const { id: quizId } = useParams()

  const STATE = { LOADING: 'chargement', ON_PROCESS: 'en_cours', FINISHED: 'termine', ERROR: 'erreur' }
  const [state, setState] = useState(STATE.LOADING)
  const [quiz, setQuiz] = useState(null)
  const [questions, setQuestions] = useState([])
  const [indexQuestion, setIndexQuestion] = useState(0)
  const [choosenAnswer, setChoosenAnswer] = useState(null)
  const [isValid, setIsValid] = useState(false)
  const [correctAnswer, setCorrectAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [error, setError] = useState('')
  const [sendOnProcess, setSendOnProcess] = useState(false)
  const [answers, setAnswers] = useState([]) // Accumule les réponses

  useEffect(() => {
    async function load() {
      try {
        const [dataQuiz, dataQuestions] = await Promise.all([
          getQuizById(quizId),
          getQuestions(quizId),
        ])
        const list = Array.isArray(dataQuestions) ? dataQuestions : []
        if (list.length === 0) { setError('Ce quiz ne contient aucune question.'); setState(STATE.ERROR); return }
        setQuiz(dataQuiz)
        setQuestions(list)
        setState(STATE.ON_PROCESS)
      } catch {
        setError('Impossible de charger les questions.')
        setState(STATE.ERROR)
      }
    }
    load()
  }, [quizId])

  const currentQuestion = questions[indexQuestion] ?? null
  const total = questions.length

  async function validateAnswer() {
    if (!choosenAnswer || isValid) return
    setSendOnProcess(true)
    try {
      const data = await answeringQuestion(quizId, currentQuestion.id, choosenAnswer)
      const rightAnswerId = data?.rightAnswerId ?? currentQuestion.correct_answer
      setCorrectAnswer(rightAnswerId)
      setIsValid(true)
      if (data?.correct) setScore(s => s + 1)
    } catch {
      setCorrectAnswer(currentQuestion.correct_answer ?? null)
      setIsValid(true)
    } finally {
      setSendOnProcess(false)
    }
  }

  async function nextQuestion() {
    const currentAnswer = {
      question: currentQuestion.id,
      userAnswer: choosenAnswer,
    }

    if (indexQuestion + 1 >= total) {
      await SaveAndFinish([...answers, currentAnswer])
      return
    }

    setAnswers(prev => [...prev, currentAnswer])
    setIndexQuestion(i => i + 1)
    setChoosenAnswer(null)
    setIsValid(false)
    setCorrectAnswer(null)
  }

  async function SaveAndFinish(finalAnswers = answers) {
    try {
      const userStr = localStorage.getItem('user')
      const user = userStr ? JSON.parse(userStr) : null

      if (user?.id && finalAnswers.length > 0) {
        await saveResult(user.id, quizId, finalAnswers)
      }
    } catch (err) {
      console.error("Erreur lors de l'enregistrement du résultat:", err)
    } finally {
      setState(STATE.FINISHED)
    }
  }

  function restart() {
    setIndexQuestion(0)
    setChoosenAnswer(null)
    setIsValid(false)
    setCorrectAnswer(null)
    setScore(0)
    setAnswers([])
    setState(STATE.ON_PROCESS)
  }

  function answerState(answerId) {
    if (!isValid) return answerId === choosenAnswer ? 'selected' : 'default'
    if (answerId === correctAnswer) return 'correct'
    if (answerId === choosenAnswer) return 'incorrect'
    return 'default'
  }

  if (state === STATE.LOADING) return <Loader />

  if (state === STATE.ERROR) return (
    <div style={{ padding: '40px 48px' }}>
      <BtnRetour onClick={() => navigate('/quiz')} />
      <div style={{ marginTop: '24px', padding: '16px 20px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '14px', maxWidth: '480px' }}>{error}</div>
    </div>
  )

  if (state === STATE.FINISHED) {
    const result = {
      quizName: quiz?.name,
      score, total,
      correctAnswers: score,
      wrongAnswers: total - score,
      datePassage: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
    }
    return (
      <div style={{ padding: '40px 48px', maxWidth: '600px' }}>
        <BtnRetour onClick={() => navigate('/quiz')} />
        <div style={{ marginTop: '28px' }}>
          <h1 style={{ fontFamily: 'Newsreader', fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '24px' }}>Quiz termine !</h1>
          <ResultCard
            result={result}
            onRestart={restart}
            onSeeLesson={quiz?.lessonId ? () => navigate(`/lesson/${quiz.lessonId}`) : undefined}
          />
        </div>
      </div>
    )
  }

  const answerList = currentQuestion?.answers ?? currentQuestion?.reponses ?? []

  return (
    <div style={{ padding: '40px 48px', maxWidth: '800px' }}>
      <BtnRetour onClick={() => navigate('/quiz')} />
      <div style={{ margin: '24px 0 32px' }}>
        <h1 style={{ fontFamily: 'Newsreader', fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>{quiz?.name}</h1>
      </div>

      {currentQuestion && (
        <QuestionCard question={{ text: currentQuestion.text ?? currentQuestion.question, number: indexQuestion + 1, total }}>
          {answerList.map((r, index) => (
            <AnswerCard key={r.id ?? `${r.text}-${index}`} answer={r} state={answerState(r.id)} onClick={id => !isValid && setChoosenAnswer(id)} disabled={isValid} />
          ))}
        </QuestionCard>
      )}

      {isValid && (
        <div style={{ marginTop: '16px', padding: '14px 20px', borderRadius: '10px', background: choosenAnswer === correctAnswer ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.07)', border: `1px solid ${choosenAnswer === correctAnswer? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.2)'}`, color: choosenAnswer === correctAnswer ? '#10b981' : '#ef4444', fontSize: '14px', fontWeight: 500 }}>
          {choosenAnswer === correctAnswer ? '✓ Bonne reponse !' : '✗ Mauvaise reponse.'}
        </div>
      )}

      <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
        {!isValid && (
          <button onClick={validateAnswer} disabled={!choosenAnswer || sendOnProcess}
            style={{ padding: '12px 28px', borderRadius: '10px', border: 'none', background: choosenAnswer ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'var(--bg-card)', color: choosenAnswer ? '#fff' : 'var(--text-muted)', fontSize: '15px', fontWeight: 600, fontFamily: 'Plus Jakarta Sans', cursor: choosenAnswer ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {sendOnProcess && <Spinner />}
            Valider
          </button>
        )}
        {isValid && (
          <button onClick={nextQuestion}
            style={{ padding: '12px 28px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: '#fff', fontSize: '15px', fontWeight: 600, fontFamily: 'Plus Jakarta Sans', cursor: 'pointer' }}>
            {indexQuestion + 1 >= total ? 'Voir les resultats' : 'Question suivante'}
          </button>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function BtnRetour({ onClick }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '14px', fontFamily: 'Plus Jakarta Sans', padding: 0 }}
      onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)' }}
      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
      Retour aux quiz
    </button>
  )
}

function Spinner() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
}

function Loader() {
  return (
    <div style={{ padding: '60px 48px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
      Chargement du quiz...
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default QuizPage
