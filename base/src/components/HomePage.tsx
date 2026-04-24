import type { User } from '../App';

interface HomePageProps {
  onNavigate: (page: string) => void;
  user: User | null;
}

const GAMES = [
  { id: 'wordle',      name: 'Wordle',      type: 'Word',   dot: 'var(--yellow)', rating: 4.8, status: 'live' },
  { id: 'trivia',      name: 'Trivia',      type: 'Trivia', dot: 'var(--blue)',   rating: 4.5, status: 'soon' },
  { id: 'connections', name: 'Connections', type: 'Word',   dot: 'var(--green)',  rating: 4.7, status: 'soon' },
  { id: 'wordle',      name: 'Cipher',      type: 'Logic',  dot: 'var(--purple)', rating: 4.6, status: 'soon' },
  { id: 'wordle',      name: 'Riddles',     type: 'Logic',  dot: 'var(--red)',    rating: 4.4, status: 'soon' },
  { id: 'wordle',      name: 'Anagrams',    type: 'Word',   dot: 'var(--yellow)', rating: 4.3, status: 'soon' },
];

export default function HomePage({ onNavigate, user }: HomePageProps) {
  return (
    <main style={s.page} className="fade-up">
      {/* ── Hero ── */}
      <section style={s.hero}>
        <h1 style={s.heroTitle}>
          Play. <em style={s.heroEm}>Solve.</em>
          <br />Repeat.
        </h1>
        <p style={s.heroSub}>
          Daily puzzles across logic, wordplay, ciphers, and trivia.
          <br />Compete on the leaderboard. Sharpen your mind.
        </p>
        <div style={s.heroButtons}>
          <button style={s.btnPrimary} onClick={() => onNavigate('wordle')}>
            ⚡ Quick Play
          </button>
          {!user && (
            <button style={s.btnGhost} onClick={() => onNavigate('register')}>
              Register — It's Free
            </button>
          )}
        </div>
      </section>

      <div style={s.divider} />

      {/* ── Featured Puzzle ── */}
      <section style={{ marginBottom: 32 }}>
        <div style={s.featuredCard}>
          <div>
            <p style={s.sectionLabel}>Featured Puzzle</p>
            <p style={s.featuredName}>Wordle</p>
            <p style={s.featuredDesc}>Guess the hidden 5-letter word in 6 tries. Letters turn green, yellow, or gray to guide you.</p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={s.featuredPoints}>600</div>
            <div style={s.featuredPointsLabel}>max pts</div>
            <button style={{ ...s.btnPrimary, marginTop: 12, whiteSpace: 'nowrap' }}
              onClick={() => onNavigate('wordle')}>
              Play Now →
            </button>
          </div>
        </div>
      </section>

      {/* ── Today's Games ── */}
      <section>
        <p style={{ ...s.sectionLabel, marginBottom: 16 }}>Today's Puzzles</p>
        <div style={s.gameGrid}>
          {GAMES.map((game, i) => (
            <div
              key={i}
              style={{
                ...s.gameCard,
                cursor: game.status === 'live' ? 'pointer' : 'default',
                opacity: game.status === 'live' ? 1 : 0.55,
              }}
              onClick={() => game.status === 'live' && onNavigate(game.id)}
              onMouseEnter={e => {
                if (game.status === 'live') {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--yellow-dim)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLDivElement).style.transform = '';
              }}
            >
              <div style={{ ...s.dot, background: game.dot }} />
              <p style={s.gameName}>{game.name}</p>
              <p style={s.gameType}>{game.type}</p>
              <div style={s.gameFooter}>
                <span style={s.gameRating}>★ {game.rating}</span>
                {game.status === 'soon' && <span style={s.comingSoon}>Soon</span>}
                {game.status === 'live' && <span style={s.liveBadge}>Play →</span>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 860,
    margin: '0 auto',
    padding: '40px 24px 60px',
  },
  hero: {
    marginBottom: 36,
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(36px, 5vw, 54px)',
    fontWeight: 700,
    lineHeight: 1.1,
    color: 'var(--text)',
    marginBottom: 14,
  },
  heroEm: {
    fontStyle: 'italic',
    color: 'var(--yellow)',
  },
  heroSub: {
    fontSize: 15,
    color: 'var(--text-dim)',
    lineHeight: 1.7,
    marginBottom: 24,
    maxWidth: 460,
  },
  heroButtons: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
  },
  btnPrimary: {
    background: 'var(--yellow)',
    color: '#111',
    border: 'none',
    borderRadius: 6,
    padding: '10px 20px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    letterSpacing: '0.2px',
  },
  btnGhost: {
    background: 'transparent',
    color: 'var(--text-dim)',
    border: '1px solid var(--border)',
    borderRadius: 6,
    padding: '10px 20px',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
  },
  divider: {
    height: 1,
    background: 'var(--border)',
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  featuredCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '20px 22px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 20,
  },
  featuredName: {
    fontSize: 20,
    fontWeight: 700,
    color: 'var(--text)',
    marginTop: 6,
    marginBottom: 8,
  },
  featuredDesc: {
    fontSize: 13,
    color: 'var(--text-dim)',
    lineHeight: 1.6,
    maxWidth: 420,
  },
  featuredPoints: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 40,
    color: 'var(--yellow)',
    fontWeight: 700,
    lineHeight: 1,
  },
  featuredPointsLabel: {
    fontSize: 11,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginTop: 2,
  },
  gameGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 12,
  },
  gameCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 9,
    padding: '14px 16px',
    transition: 'border-color 0.15s, transform 0.15s',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    marginBottom: 10,
  },
  gameName: {
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: 3,
  },
  gameType: {
    fontSize: 11,
    color: 'var(--text-muted)',
    marginBottom: 10,
  },
  gameFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameRating: {
    fontSize: 11,
    color: 'var(--text-dim)',
  },
  comingSoon: {
    fontSize: 10,
    fontWeight: 600,
    color: 'var(--text-muted)',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '2px 8px',
  },
  liveBadge: {
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--yellow)',
  },
};
