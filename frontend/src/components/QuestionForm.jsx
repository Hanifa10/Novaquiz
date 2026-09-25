import { useState } from 'react'

const MIN_ANSWERS = 2
const MAX_ANSWERS = 4

function QuestionForm({ questionInitial = null, onSubmit, onCancel, loading = false, error = '' }) {
  const editMode = questionInitial !== null

  const [text, setText] = useState(questionInitial?.text ?? '')

  // Initialise les réponses : au moins MIN_REPONSES champs
  const answersInit = questionInitial?.answers?.length >= MIN_ANSWERS
    ? questionInitial.answers.map(r => ({ text: r.text, isCorrect: r.isCorrect }))
    : [
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
      ]

  const [answers, setAnswers] = useState(answersInit)

  // ── Gestion des réponses ───────────────────────────────────────────────────

  function editAnswer(index, value) {
    setAnswers(prev =>
      prev.map((r, i) => i === index ? { ...r, text: value } : r)
    )
  }

  function correct(index) {
    // Une seule réponse correcte à la fois
    setAnswers(prev =>
      prev.map((r, i) => ({ ...r, isCorrect: i === index }))
    )
  }

  function addAnswer() {
    if (answers.length >= MAX_ANSWERS) return
    setAnswers(prev => [...prev, { text: '', isCorrect: false }])
  }

  function deleteAnswer(index) {
    if (answers.length <= MIN_ANSWERS) return
    const news = answers.filter((_, i) => i !== index)
    // Si on supprime la bonne réponse, on met la première comme correcte
    const noneCorrect = !news.some(r => r.isCorrect)
    if (noneCorrect) news[0].isCorrect = true
    setAnswers(news)
  }

  // ── Soumission ─────────────────────────────────────────────────────────────

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ text, answers })
  }

  const inputStyle = {
    flex: 1,
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'var(--neutral)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    fontFamily: 'Plus Jakarta Sans',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderRadius: '16px',
        padding: '28px',
        width: '100%',
      }}
    >
      <h3
        style={{
          fontFamily: 'Newsreader',
          fontSize: '17px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '20px',
        }}
      >
        {editMode ? 'Modifier la question' : 'Nouvelle question'}
      </h3>

      {error && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '8px',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
            color: '#ef4444',
            fontSize: '14px',
            marginBottom: '16px',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Texte de la question */}
        <div>
          <label
            style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}
          >
            Question *
          </label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Ex : Quelle méthode permet de transformer un tableau en chaîne ?"
            required
            rows={3}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: 'var(--neutral)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontFamily: 'Plus Jakarta Sans',
              outline: 'none',
              resize: 'vertical',
              lineHeight: 1.6,
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--accent-violet)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)' }}
          />
        </div>

        {/* Réponses */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Réponses * <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(coche la bonne)</span>
            </label>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {answers.length}/{MAX_ANSWERS}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {answers.map((answer, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Bouton radio personnalisé — bonne réponse */}
                <button
                  type="button"
                  onClick={() => correct(index)}
                  title="Marquer comme bonne réponse"
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    border: answer.isCorrect ? '2px solid #10b981' : '2px solid var(--border)',
                    background: answer.isCorrect ? 'rgba(16,185,129,0.15)' : 'transparent',
                    cursor: 'pointer',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    transition: 'all 0.2s',
                  }}
                >
                  {answer.isCorrect && (
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'block' }} />
                  )}
                </button>

                {/* Champ texte de la réponse */}
                <input
                  type="text"
                  value={answer.text}
                  onChange={e => editAnswer(index, e.target.value)}
                  placeholder={`Réponse ${index + 1}`}
                  required
                  style={{
                    ...inputStyle,
                    borderColor: answer.isCorrect ? 'rgba(16,185,129,0.3)' : 'var(--border)',
                  }}
                  onFocus={e => { e.target.style.borderColor = answer.isCorrect ? '#10b981' : 'var(--accent-violet)' }}
                  onBlur={e => { e.target.style.borderColor = answer.isCorrect ? 'rgba(16,185,129,0.3)' : 'var(--border)' }}
                />

                {/* Supprimer la réponse */}
                <button
                  type="button"
                  onClick={() => deleteAnswer(index)}
                  disabled={answers.length <= MIN_ANSWERS}
                  title="Supprimer cette réponse"
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'transparent',
                    color: answers.length <= MIN_ANSWERS ? 'var(--text-muted)' : '#ef4444',
                    cursor: answers.length <= MIN_ANSWERS ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    padding: 0,
                    opacity: answers.length <= MIN_ANSWERS ? 0.3 : 1,
                    transition: 'all 0.2s',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Ajouter une réponse */}
          {answers.length < MAX_ANSWERS && (
            <button
              type="button"
              onClick={addAnswer}
              style={{
                marginTop: '10px',
                padding: '7px 14px',
                borderRadius: '8px',
                border: '1px dashed var(--border)',
                background: 'transparent',
                color: 'var(--text-muted)',
                fontSize: '13px',
                fontFamily: 'Plus Jakarta Sans',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--accent-violet)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Ajouter une réponse
            </button>
          )}
        </div>

        {/* Boutons d'action */}
        <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '9px 20px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: '14px',
              fontFamily: 'Plus Jakarta Sans',
              cursor: 'pointer',
            }}
          >
            Annuler
          </button>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '9px 24px',
              borderRadius: '10px',
              border: 'none',
              background: loading
                ? 'rgba(65,90,119,0.4)'
                : 'linear-gradient(135deg, var(--primary), var(--secondary))',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'Plus Jakarta Sans',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {loading && <Spinner />}
            {editMode ? 'Enregistrer' : 'Ajouter la question'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Spinner() {
  return (
    <>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  )
}

export default QuestionForm
