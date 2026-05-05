import { useState } from 'react';
import type { CSSProperties } from 'react';
import { getUserRank } from './LeaderboardDatabase';
import type { User } from '../types';

interface ConnectionsGameProps {
  user: User | null;
  onScoreUpdate?: (score: number, puzzleId: string) => void;
  onNavigate: (page: string) => void;
  onRegisterWithScore: (score: number, puzzleId: string) => void;
}

type Group = {
  title: string;
  words: string[];
  color: string;
};

type GameStatus = 'playing' | 'won' | 'lost';

const GROUPS: Group[] = [
  {
    title: 'Programming Languages',
    words: ['JAVA', 'PYTHON', 'RUBY', 'SWIFT'],
    color: 'var(--green)',
  },
  {
    title: 'Planets',
    words: ['MARS', 'VENUS', 'EARTH', 'SATURN'],
    color: 'var(--yellow)',
  },
  {
    title: 'Computer Terms',
    words: ['ARRAY', 'STACK', 'QUEUE', 'CLASS'],
    color: 'var(--blue)',
  },
  {
    title: 'Kitchen Items',
    words: ['SPOON', 'PLATE', 'OVEN', 'FRIDGE'],
    color: 'var(--purple)',
  },
];

const MAX_MISTAKES = 4;

const shuffle = (items: string[]): string[] => {
  return [...items].sort(() => Math.random() - 0.5);
};

const sameGroup = (selected: string[], groupWords: string[]): boolean => {
  const a = [...selected].sort().join('|');
  const b = [...groupWords].sort().join('|');
  return a === b;
};

export default function ConnectionsGame({
  user,
  onScoreUpdate,
  onNavigate,
  onRegisterWithScore,
}: ConnectionsGameProps) {
  const [words, setWords] = useState<string[]>(() =>
    shuffle(GROUPS.flatMap(group => group.words))
  );
  const [selected, setSelected] = useState<string[]>([]);
  const [solvedGroups, setSolvedGroups] = useState<Group[]>([]);
  const [mistakesLeft, setMistakesLeft] = useState(MAX_MISTAKES);
  const [status, setStatus] = useState<GameStatus>('playing');
  const [toast, setToast] = useState('');
  const [finalScore, setFinalScore] = useState(0);
  const [userRank, setUserRank] = useState<number | null>(null);

  const isGuest = !user;

  const remainingWords = words.filter(
    word => !solvedGroups.some(group => group.words.includes(word))
  );

  const showToast = (message: string, ms = 1800) => {
    setToast(message);
    setTimeout(() => setToast(''), ms);
  };

  const toggleWord = (word: string) => {
    if (status !== 'playing') return;

    if (selected.includes(word)) {
      setSelected(selected.filter(w => w !== word));
      return;
    }

    if (selected.length >= 4) {
      showToast('Only select 4 words');
      return;
    }

    setSelected([...selected, word]);
  };

  const submitGroup = () => {
    if (status !== 'playing') return;

    if (selected.length !== 4) {
      showToast('Select exactly 4 words');
      return;
    }

    const match = GROUPS.find(group =>
      sameGroup(selected, group.words) &&
      !solvedGroups.some(solved => solved.title === group.title)
    );

    if (match) {
      const updatedSolvedGroups = [...solvedGroups, match];
      setSolvedGroups(updatedSolvedGroups);
      setSelected([]);
      showToast(match.title);

      if (updatedSolvedGroups.length === GROUPS.length) {
        const mistakesMade = MAX_MISTAKES - mistakesLeft;
        const score = Math.max(100, 700 - mistakesMade * 125);

        setFinalScore(score);
        setStatus('won');

        if (!isGuest) {
          onScoreUpdate?.(score, 'connections');

          setTimeout(() => {
            if (user) {
              setUserRank(getUserRank(user.uid, 'connections'));
            }
          }, 100);
        }
      }

      return;
    }

    const newMistakesLeft = mistakesLeft - 1;
    setMistakesLeft(newMistakesLeft);
    setSelected([]);

    if (newMistakesLeft <= 0) {
      setStatus('lost');
      setFinalScore(0);
      showToast('Game over', 2500);
    } else {
      showToast('Not a group');
    }
  };

  const shuffleRemaining = () => {
    setWords([
      ...solvedGroups.flatMap(group => group.words),
      ...shuffle(remainingWords),
    ]);
  };

  const resetGame = () => {
    setWords(shuffle(GROUPS.flatMap(group => group.words)));
    setSelected([]);
    setSolvedGroups([]);
    setMistakesLeft(MAX_MISTAKES);
    setStatus('playing');
    setToast('');
    setFinalScore(0);
    setUserRank(null);
  };

  return (
    <div style={s.page} className="fade-up">
      <div style={s.breadcrumb} onClick={() => onNavigate('home')}>
        ← Home
      </div>

      <div style={s.header}>
        <h1 style={s.title}>CONNECTIONS</h1>
        <p style={s.subtitle}>Group 16 words into 4 hidden categories.</p>
      </div>

      <div style={{ ...s.toast, opacity: toast ? 1 : 0 }}>
        {toast || ' '}
      </div>

      <div style={s.solvedArea}>
        {solvedGroups.map(group => (
          <div key={group.title} style={{ ...s.solvedGroup, background: group.color }}>
            <p style={s.solvedTitle}>{group.title}</p>
            <p style={s.solvedWords}>{group.words.join(', ')}</p>
          </div>
        ))}
      </div>

      {status === 'playing' && (
        <>
          <div style={s.grid}>
            {remainingWords.map(word => {
              const isSelected = selected.includes(word);

              return (
                <button
                  key={word}
                  style={{
                    ...s.tile,
                    background: isSelected ? 'var(--yellow)' : 'var(--surface2)',
                    color: isSelected ? '#111' : 'var(--text)',
                    borderColor: isSelected ? 'var(--yellow)' : 'var(--border)',
                    transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                  }}
                  onClick={() => toggleWord(word)}
                >
                  {word}
                </button>
              );
            })}
          </div>

          <div style={s.mistakesRow}>
            <span style={s.mistakesLabel}>Mistakes remaining:</span>
            {Array.from({ length: MAX_MISTAKES }).map((_, index) => (
              <span
                key={index}
                style={{
                  ...s.dot,
                  opacity: index < mistakesLeft ? 1 : 0.2,
                }}
              />
            ))}
          </div>

          <div style={s.buttonRow}>
            <button style={s.btnGhost} onClick={shuffleRemaining}>
              Shuffle
            </button>
            <button style={s.btnGhost} onClick={() => setSelected([])}>
              Deselect All
            </button>
            <button style={s.btnPrimary} onClick={submitGroup}>
              Submit
            </button>
          </div>
        </>
      )}

      {status !== 'playing' && (
        <div style={s.endPanel} className="pop-in">
          {status === 'won' ? (
            <>
              <div style={s.endEmoji}>🏆</div>
              <div style={s.endScore}>{finalScore} pts</div>
              <p style={s.endSub}>
                You solved all 4 groups with {mistakesLeft} mistakes remaining.
              </p>

              {!isGuest && (
                <div style={s.rankRow}>
                  <span style={s.rankLabel}>Your Connections Rank</span>
                  <span style={s.rankValue}>
                    {userRank !== null ? `#${userRank}` : '…'}
                  </span>
                </div>
              )}

              {isGuest && (
                <div style={s.guestNudge}>
                  <p style={s.nudgeText}>
                    Register to save your{' '}
                    <strong style={{ color: 'var(--yellow)' }}>
                      {finalScore} pts
                    </strong>{' '}
                    and appear on the leaderboard.
                  </p>
                  <button
                    style={s.nudgeBtn}
                    onClick={() => onRegisterWithScore(finalScore, 'connections')}
                  >
                    Register &amp; Save Score →
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <div style={s.endEmoji}>😔</div>
              <div style={{ ...s.endScore, fontSize: 24 }}>Better luck next time</div>
              <p style={s.endSub}>You ran out of mistakes.</p>

              {isGuest && (
                <div style={s.guestNudge}>
                  <p style={s.nudgeText}>
                    Register free to track your progress and compete on the leaderboard.
                  </p>
                  <button
                    style={s.nudgeBtn}
                    onClick={() => onRegisterWithScore(0, 'connections')}
                  >
                    Register Free →
                  </button>
                </div>
              )}
            </>
          )}

          <div style={s.buttonRow}>
            <button style={s.btnGhost} onClick={() => onNavigate('leaderboard')}>
              Leaderboard
            </button>
            <button style={s.btnPrimary} onClick={resetGame}>
              Play Again →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  page: {
    maxWidth: 680,
    margin: '0 auto',
    padding: '28px 16px 60px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  breadcrumb: {
    alignSelf: 'flex-start',
    fontSize: 12,
    color: 'var(--text-muted)',
    cursor: 'pointer',
    marginBottom: 18,
  },
  header: {
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    letterSpacing: '0.18rem',
    color: 'var(--text)',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: 'var(--text-dim)',
    marginBottom: 8,
  },
  toast: {
    background: '#fff',
    color: '#111',
    fontWeight: 700,
    fontSize: 13,
    padding: '8px 18px',
    borderRadius: 6,
    minHeight: 34,
    margin: '8px 0 14px',
    transition: 'opacity 0.2s',
  },
  solvedArea: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 12,
  },
  solvedGroup: {
    borderRadius: 8,
    padding: '12px 16px',
    color: '#111',
    textAlign: 'center',
  },
  solvedTitle: {
    fontSize: 14,
    fontWeight: 800,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  solvedWords: {
    fontSize: 13,
    fontWeight: 600,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(90px, 1fr))',
    gap: 8,
    width: '100%',
    marginBottom: 16,
  },
  tile: {
    minHeight: 68,
    border: '1px solid var(--border)',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 800,
    cursor: 'pointer',
    transition: 'all 0.12s ease',
    fontFamily: 'Inter, sans-serif',
  },
  mistakesRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    marginBottom: 18,
  },
  mistakesLabel: {
    fontSize: 12,
    color: 'var(--text-dim)',
    marginRight: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: 'var(--yellow)',
  },
  buttonRow: {
    display: 'flex',
    gap: 10,
    justifyContent: 'center',
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
  },
  btnGhost: {
    background: 'transparent',
    color: 'var(--text-dim)',
    border: '1px solid var(--border)',
    borderRadius: 6,
    padding: '10px 18px',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
  },
  endPanel: {
    width: '100%',
    maxWidth: 380,
    textAlign: 'center',
    padding: '28px 24px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    marginTop: 18,
  },
  endEmoji: {
    fontSize: 42,
    marginBottom: 10,
  },
  endScore: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 32,
    color: 'var(--yellow)',
    fontWeight: 700,
    marginBottom: 6,
  },
  endSub: {
    fontSize: 13,
    color: 'var(--text-dim)',
    lineHeight: 1.5,
    marginBottom: 14,
  },
  rankRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '10px 16px',
    marginBottom: 14,
  },
  rankLabel: {
    fontSize: 12,
    color: 'var(--text-muted)',
  },
  rankValue: {
    fontSize: 20,
    fontWeight: 700,
    color: 'var(--green)',
    fontFamily: "'JetBrains Mono', monospace",
  },
  guestNudge: {
    background: 'rgba(200,168,75,0.08)',
    border: '1px solid var(--yellow-dim)',
    borderRadius: 8,
    padding: '12px 16px',
    marginBottom: 14,
  },
  nudgeText: {
    fontSize: 13,
    color: 'var(--text-dim)',
    lineHeight: 1.5,
    marginBottom: 10,
  },
  nudgeBtn: {
    background: 'var(--yellow)',
    color: '#111',
    border: 'none',
    borderRadius: 6,
    padding: '8px 18px',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    width: '100%',
  },
};