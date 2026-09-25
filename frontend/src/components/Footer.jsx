
function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        padding: '20px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}
    >
      {/* Logo + copyright */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span
          className="gradient-text"
          style={{ fontFamily: 'Newsreader', fontWeight: 700, fontSize: '16px' }}
        >
          NovaQuiz
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          © {year} — Tous droits réservés
        </span>
      </div>

      {/* Liens utiles */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {['Mentions légales', 'Confidentialité', 'Contact'].map(link => (
          <a
            key={link}
            href="#"
            style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => { e.target.style.color = 'var(--text-secondary)' }}
            onMouseLeave={e => { e.target.style.color = 'var(--text-muted)' }}
          >
            {link}
          </a>
        ))}
      </div>
    </footer>
  )
}

export default Footer
