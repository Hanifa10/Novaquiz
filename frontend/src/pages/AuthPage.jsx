import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import { login, register } from '../api/auth'

function AuthPage({ onLoginSuccess }) {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin({ email, password }) {
    setLoading(true); setError('')
    try {
      const data = await login(email, password)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      onLoginSuccess(data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Email ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister({ lastName, firstName, email, password }) {
    setLoading(true); setError('')
    try {
      const data = await register(lastName, firstName, email, password)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      onLoginSuccess(data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message ?? "Erreur lors de l inscription.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-160px', left: '-160px', width: '480px', height: '480px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(65,90,119,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-120px', right: '-120px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(197,160,89,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Newsreader', fontSize: '36px', fontWeight: 700, marginBottom: '8px' }}>NovaQuiz</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Apprends. Teste-toi. Progresse.</p>
      </div>

      {mode === 'login'
        ? <LoginForm onSubmit={handleLogin} onGoRegister={() => { setMode('register'); setError('') }} loading={loading} error={error} />
        : <RegisterForm onSubmit={handleRegister} onGoLogin={() => { setMode('login'); setError('') }} loading={loading} error={error} />
      }
    </div>
  )
}

export default AuthPage
