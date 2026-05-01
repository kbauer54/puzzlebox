import { getAllPuzzles } from './PuzzleDatabase';
import type { User } from '../types';

interface HomePageProps {
  onNavigate: (page: string) => void;
  user: User | null;
}

const DOT_COLORS: Record<string, string> = {
  Wordle:      'var(--yellow)',
  Trivia:      'var(--blue)',
  Connections: 'var(--green)',
  Cipher:      'var(--purple)',
  Riddle:      'var(--red)',
  Anagram:     'var(--yellow)',
};

export default function HomePage({ onNavigate, user }: HomePageProps) {
  const puzzles  = getAllPuzzles();
  const featured = puzzles[0];

  return (
    <main style={s.page} className="fade-up">

      {/* ── Hero ── */}
      <section style={s.hero}>
        <h1 style={s.heroTitle}>
          Play. <em style={s.heroEm}>Solve.</em><br />Repeat.
        </h1>
        <p style={s.heroSub}>
          Daily puzzles across logic, wordplay, ciphers, and trivia.
          <br />Compete on the leaderboard. Sharpen your mind.
        </p>
        <div style={s.heroButtons}>
          <button style={s.btnPrimary} onClick={() => onNavigate('wordle')}>
            ⚡ Quick Play
          </button>
          <button style={s.btnPrimary} onClick={() => onNavigate('trivia')}>
            🧠 Trivia
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
      {featured && (
        <section style={{ marginBottom: 32 }}>
          <div style={s.featuredCard}>
            <div style={{ flex: 1 }}>
              <p style={s.sectionLabel}>Featured Puzzle</p>
              <p style={s.featuredName}>{featured.name}</p>
              <p style={s.featuredDesc}>{featured.description}</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <span style={s.badge}>{featured.puzzleType}</span>
                <span style={s.badge}>{featured.difficulty}</span>
                <span style={s.badge}>★ {featured.rating}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={s.featuredPoints}>{featured.maxScore.toLocaleString()}</div>
              <div style={s.featuredPointsLabel}>max pts</div>
              <button
                style={{ ...s.btnPrimary, marginTop: 12, whiteSpace: 'nowrap' }}
                onClick={() => onNavigate(featured.id)}
              >
                Play Now →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── Today's Games ── */}
      <section>
        <p style={{ ...s.sectionLabel, marginBottom: 16 }}>Today's Puzzles</p>
        <div style={s.gameGrid}>
          {puzzles.map(puzzle => {
            const isLive = puzzle.id === 'wordle' || puzzle.id === 'trivia';
            return (
              <div
                key={puzzle.id}
                style={{
                  ...s.gameCard,
                  cursor:  isLive ? 'pointer' : 'default',
                  opacity: isLive ? 1 : 0.55,
                }}
                onClick={() => isLive && onNavigate(puzzle.id)}
                onMouseEnter={e => {
                  if (isLive) {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--yellow-dim)';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLDivElement).style.transform = '';
                }}
              >
                <div style={{ ...s.dot, background: DOT_COLORS[puzzle.puzzleType] ?? 'var(--yellow)' }} />
                <p style={s.gameName}>{puzzle.name}</p>
                <p style={s.gameType}>{puzzle.puzzleType}</p>
                <div style={s.gameFooter}>
                  <span style={s.gameRating}>★ {puzzle.rating}</span>
                  {isLive
                    ? <span style={s.liveBadge}>Play →</span>
                    : <span style={s.comingSoon}>Soon</span>
                  }
                </div>
              </div>
            );
          })}
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
  hero: { marginBottom: 36, textAlign: 'center' },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(36px, 5vw, 54px)',
    fontWeight: 700,
    lineHeight: 1.1,
    color: 'var(--text)',
    marginBottom: 14,
  },
  heroEm: { fontStyle: 'italic', color: 'var(--yellow)' },
  heroSub: {
    fontSize: 15,
    color: 'var(--text-dim)',
    lineHeight: 1.7,
    marginBottom: 24,
    maxWidth: 460,
    margin: '0 auto 24px',
  },
  heroButtons: { display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' },
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
  divider: { height: 1, background: 'var(--border)', marginBottom: 32 },
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
  badge: {
    fontSize: 10,
    fontWeight: 600,
    color: 'var(--text-muted)',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 4,
    padding: '2px 8px',
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
  gameRating:  { fontSize: 11, color: 'var(--text-dim)' },
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