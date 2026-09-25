import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ProfileCard from '../components/ProfileCard'
import ResultCard from '../components/ResultCard'
import { getResults } from '../api/user'

function ProfilePage({ user, onLogout }) {
  const navigate = useNavigate()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await getResults()
        setResults(Array.isArray(data) ? data : [])
      } catch { }
      finally { setLoading(false) }
    }
    load()
  }, [])

  return (
    <div style={{ padding: '40px 48px', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{ fontFamily: 'Newsreader', fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>Profil</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Tes informations et ton historique</p>
      </div>

      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ProfileCard user={user} />
          <button onClick={onLogout}
            style={{ padding: '11px 20px', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)', color: '#ef4444', fontSize: '14px', fontWeight: 500, fontFamily: 'Plus Jakarta Sans', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Se deconnecter
          </button>
        </div>

        <div style={{ flex: 1, minWidth: '300px' }}>
          <h2 style={{ fontFamily: 'Newsreader', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px' }}>
             Mes resultats
          </h2>

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
              Chargement...
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {!loading && results.length === 0 && (
            <div style={{ padding: '32px', borderRadius: '14px', border: '1px dashed var(--border)', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎯</div>
              <p style={{ fontSize: '14px' }}>Aucun quiz passé pour l instant.</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {results.map((r, i) => (
                <ResultCard key={r.id ?? i} result={r}
                  onRestart={() => navigate(`/quiz/${r.quizId}/start`)}
                  onSeeLesson={r.lessonId ? () => navigate(`/lesson/${r.lessonId}`) : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
