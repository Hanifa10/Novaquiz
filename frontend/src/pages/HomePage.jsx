import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LessonCard from '../components/LessonCard'
import QuizCard from '../components/QuizCard'
import { getLessonsByUser } from '../api/lesson'
import { getQuizzesByUser } from '../api/quiz'
import { getProgression } from '../api/user'

function HomePage({ user }) {
  const navigate = useNavigate()
  const [lastLesson, setLastLesson] = useState(null)
  const [availableLessons, setAvailableLessons] = useState([])
  const [availableQuiz, setAvailableQuiz] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [lesson, quiz] = await Promise.all([getLessonsByUser(), getQuizzesByUser()])
        setAvailableLessons((lesson ?? []).slice(0, 3))
        setAvailableQuiz((quiz ?? []).slice(0, 4))

        try {
          const prog = await getProgression()
          setLastLesson(prog?.lastLesson ?? (lesson?.[0] ?? null))
        } catch {
          setLastLesson(lesson?.[0] ?? null)
        }
      } catch (err) {
        console.error('Erreur chargement accueil :', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const hour = new Date().getHours()
  const salutation = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'

  if (loading) return <Loader />

  return (
    <div style={{ padding: '40px 48px', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontFamily: 'Newsreader', fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
          {salutation},{' '}
          <span className="gradient-text">{user?.firstName ?? 'Etudiant'}</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Pret a continuer ton apprentissage ?
        </p>
      </div>

      {lastLesson && (
        <section style={{ marginBottom: '48px' }}>
          <SectionTitre  label="Continuer" sublabel={lastLesson.onProcess ? "Reprends ou tu en etais" : 'Nouveau cours recommande'} />
          <div
            onClick={() => navigate(`/lesson/${lastLesson.id}`)}
            style={{
              background: 'linear-gradient(135deg, rgba(65,90,119,0.12) 0%, rgba(197,160,89,0.08) 100%)',
              border: '1px solid rgba(65,90,119,0.25)', borderRadius: '16px',
              padding: '28px 32px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: '24px', flexWrap: 'wrap', transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-violet)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(65,90,119,0.15)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(65,90,119,0.25)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <div style={{ flex: 1, minWidth: '200px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-violet-light)', background: 'rgba(65,90,119,0.12)', padding: '3px 10px', borderRadius: '20px', display: 'inline-block', marginBottom: '12px' }}>
                {lastLesson.onProcess ? '▶ En cours' : ' Suggere'}
              </span>
              <h2 style={{ fontFamily: 'Newsreader', fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.3 }}>
                {lastLesson.name}
              </h2>
              {lastLesson.progression !== undefined && (
                <div style={{ marginTop: '16px', maxWidth: '300px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Progression</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-violet-light)' }}>{lastLesson.progression}%</span>
                  </div>
                  <div style={{ height: '5px', background: 'rgba(27,38,59,0.8)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${lastLesson.progression}%`, background: 'linear-gradient(90deg, var(--primary), var(--tertiary))', borderRadius: '3px' }} />
                  </div>
                </div>
              )}
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </div>
        </section>
      )}

      {availableQuiz.length > 0 && (
        <section style={{ marginBottom: '48px' }}>
          <SectionTitre label="Quiz disponibles" sublabel="Teste tes connaissances" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {availableQuiz.map(q => (
              <QuizCard key={q.id} quiz={q} onClick={() => navigate(`/quiz/${q.id}/start`)} />
            ))}
          </div>
        </section>
      )}

      {availableLessons.length > 0 && (
        <section>
          <SectionTitre  label="Cours disponibles" sublabel="Explore de nouveaux sujets" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {availableLessons.map(c => (
              <LessonCard key={c.id} lesson={c} onClick={() => navigate(`/lesson/${c.id}`)} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function SectionTitre({ icone, label, sublabel }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
      <h2 style={{ fontFamily: 'Newsreader', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{label}</h2>
      {sublabel && <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{sublabel}</span>}
    </div>
  )
}

function Loader() {
  return (
    <div style={{ padding: '80px 48px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      Chargement…
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default HomePage
