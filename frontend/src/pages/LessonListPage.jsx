import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LessonCard from '../components/LessonCard'
import { getLessonsByUser, deleteLesson } from '../api/lesson'

function LessonListPage() {
  const navigate = useNavigate()
  const [lesson, setLesson] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [research, setResearch] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const data = await getLessonsByUser()
        setLesson(Array.isArray(data) ? data : [])
      } catch {
        setError(`Impossible de charger les cours. Verifie que l'API est lancee.`)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleDelete(e, lessonId) {
    e.stopPropagation()
    if (!window.confirm('Supprimer ce cours ?')) return
    try {
      await deleteLesson(lessonId)
      setLesson(prev => prev.filter(c => c.id !== lessonId))
    } catch {
      alert('Impossible de supprimer le cours.')
    }
  }

  const lessonFilters = lesson.filter(c =>
    c.name?.toLowerCase().includes(research.toLowerCase())
  )

  return (
    <div style={{ padding: '40px 48px', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'Newsreader', fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>Cours</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            {lesson.length > 0 ? `${lesson.length} cours disponible${lesson.length > 1 ? 's' : ''}` : 'Explore les cours disponibles'}
          </p>
        </div>
        <button
          onClick={() => navigate('/lesson/new')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: '#fff', fontSize: '14px', fontWeight: 600, fontFamily: 'Plus Jakarta Sans', cursor: 'pointer' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nouveau cours
        </button>
      </div>

      <div style={{ marginBottom: '28px', position: 'relative', maxWidth: '400px' }}>
        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        </span>
        <input type="text" placeholder="Rechercher un cours..." value={research} onChange={e => setResearch(e.target.value)}
          style={{ width: '100%', padding: '10px 14px 10px 40px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--neutral)', color: 'var(--text-primary)', fontSize: '14px', fontFamily: 'Plus Jakarta Sans', outline: 'none' }}
          onFocus={e => { e.target.style.borderColor = 'var(--accent-violet)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--border)' }}
        />
      </div>

      {loading && <Loader />}
      {error && <MessageErreur message={error} />}
      {!loading && !error && lessonFilters.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <h3 style={{ fontFamily: 'Newsreader', fontSize: '18px', color: 'var(--text-primary)', marginBottom: '8px' }}>
            {research ? 'Aucun cours trouve' : 'Aucun cours disponible'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {research ? `Aucun resultat pour "${research}"` : 'Cree ton premier cours !'}
          </p>
        </div>
      )}

      {!loading && !error && lessonFilters.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {lessonFilters.map(c => (
            <div key={c.id} style={{ position: 'relative' }}>
              <LessonCard lesson={c} onClick={() => navigate(`/lesson/${c.id}`)} />
              {/* Actions édition/suppression */}
              <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px' }}>
                <BtnAction onClick={e => { e.stopPropagation(); navigate(`/lesson/${c.id}/edit`) }} title="Modifier" color="violet">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </BtnAction>
                <BtnAction onClick={e => handleDelete(e, c.id)} title="Supprimer" color="red">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  </svg>
                </BtnAction>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function BtnAction({ onClick, title, color, children }) {
  const colors = {
    violet: { bg: 'rgba(65,90,119,0.15)', border: 'rgba(65,90,119,0.3)', text: 'var(--accent-violet-light)' },
    red: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', text: '#ef4444' },
  }
  const c = colors[color]
  return (
    <button onClick={onClick} title={title}
      style={{ width: '28px', height: '28px', borderRadius: '7px', border: `1px solid ${c.border}`, background: c.bg, color: c.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
      {children}
    </button>
  )
}

function Loader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', padding: '40px 0' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      Chargement des cours...
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function MessageErreur({ message }) {
  return (
    <div style={{ padding: '16px 20px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '14px', maxWidth: '480px' }}>
      {message}
    </div>
  )
}

export default LessonListPage
