import './index.css'
import { useState } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'

import NavBar from './components/NavBar'
import Header from './components/Header'
import Footer from './components/Footer'

import AuthPage     from './pages/AuthPage'
import HomePage  from './pages/HomePage'
import LessonListPage  from './pages/LessonListPage'
import LessonDetailPage from './pages/LessonDetailPage'
import LessonFormPage   from './pages/LessonFormPage'
import QuizListPage   from './pages/QuizListPage'
import QuizPage        from './pages/QuizPage'
import QuizFormPage    from './pages/QuizFormPage'
import QuizEditPage    from './pages/QuizEditPage'
import ProfilePage      from './pages/ProfilePage'
import { normalizeUser } from './api/auth'

function App() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')
    const userStocke = localStorage.getItem('user')
    if (token && userStocke) {
      try {
        const parsed = JSON.parse(userStocke)
        return normalizeUser(parsed)
      } catch {
        localStorage.clear()
      }
    }
    return null
  })
  const [initialize] = useState(true)

  function handleLoginSuccess(userRecu) {
    setUser(normalizeUser(userRecu))
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  // On n'affiche rien tant que la verif du token n'est pas faite
  if (!initialize) return null

  return (
    <Routes>
      {/* ── Pages publiques (sans layout) ──────────────────────────────────── */}
      <Route
        path="/login"
        element={
          user
            ? <Navigate to="/" replace />
            : <AuthPage onLoginSuccess={handleLoginSuccess} />
        }
      />

      {/* ── Pages protegees (avec layout) ──────────────────────────────────── */}
      <Route
        path="/*"
        element={
          !user
            ? <Navigate to="/login" replace />
            : <Layout user={user} onLogout={handleLogout} />
        }
      />
    </Routes>
  )
}

function Layout({ user, onLogout }) {
  const location = useLocation()
  const navigate = useNavigate()

  function getPageActive() {
    const path = location.pathname
    if (path.startsWith('/lesson')) return 'lesson'
    if (path.startsWith('/quiz'))  return 'quiz'
    if (path === '/profile')        return 'profile'
    return 'home'
  }

  function navigateViaNavbar(navbarId) {
    const routes = { home: '/', lesson: '/lesson', quiz: '/quiz'}
    navigate(routes[navbarId] ?? '/')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Header
          user={user}
          activePage={getPageActive()}
          onNavigate={navigateViaNavbar}
          onProfileClick={() => navigate('/profile')}
        />

        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Routes>
            <Route path="/"                       element={<HomePage user={user} />} />
            <Route path="/lesson"                  element={<LessonListPage />} />
            <Route path="/lesson/new"          element={<LessonFormPage />} />
            <Route path="/lesson/:id"              element={<LessonDetailPage />} />
            <Route path="/lesson/:id/edit"     element={<LessonFormPage />} />
            <Route path="/quiz"                   element={<QuizListPage />} />
            <Route path="/quiz/new"           element={<QuizFormPage />} />
            <Route path="/quiz/:id/start"         element={<QuizPage />} />
            <Route path="/quiz/:id/edit"      element={<QuizFormPage />} />
            <Route path="/quiz/:id/questions"     element={<QuizEditPage />} />
            <Route path="/profile"                 element={<ProfilePage user={user} onLogout={onLogout} />} />
            <Route path="*"                       element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default App
