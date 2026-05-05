import { useState } from 'react';
import type { CSSProperties } from 'react';
import { getUserRank } from './LeaderboardDatabase';
import type { User } from '../App';

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

// These are the hidden groups for the game, I only made one iteration of the game.
// Each group has a title, the 4 correct words, and the color shown after it is solved (always the same right now).
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

// The player gets 4 wrong guesses --> losing
const MAX_MISTAKES = 4;

// Makes a shuffled copy of the word list so the board is different each game.
const shuffle = (items: string[]): string[] => {
  return [...items].sort(() => Math.random() - 0.5);
};

// Checks if the selected 4 words are the same as one of the real groups.
// Sorting makes it not matter what order the user clicked them in.
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
  // All words on the board, shuffled at the start.
  const [words, setWords] = useState<string[]>(() =>
    shuffle(GROUPS.flatMap(group => group.words))
  );

  // The words the player currently has clicked.
  const [selected, setSelected] = useState<string[]>([]);

  // Groups the player has already solved.
  const [solvedGroups, setSolvedGroups] = useState<Group[]>([]);

  // How many mistakes the player has left.
  const [mistakesLeft, setMistakesLeft] = useState(MAX_MISTAKES);

  // Tracks if the game is still going, won, or lost.
  const [status, setStatus] = useState<GameStatus>('playing');

  // Small message that pops up when something happens.
  const [toast, setToast] = useState('');

  // Final score shown at the end of the game.
  const [finalScore, setFinalScore] = useState(0);

  // Used to show the logged-in user's leaderboard rank after winning.
  const [userRank, setUserRank] = useState<number | null>(null);

  // If there is no user, they can still play, but their score is not saved yet.
  const isGuest = !user;

  // Only show words that are not already part of a solved group.
  const remainingWords = words.filter(
    word => !solvedGroups.some(group => group.words.includes(word))
  );

  // Shows a temporary message, then clears it after a little bit.
  const showToast = (message: string, ms = 1800) => {
    setToast(message);
    setTimeout(() => setToast(''), ms);
  };

  const toggleWord = (word: string) => {
    // Do not let the user keep clicking after the game ends.
    if (status !== 'playing') return;

    // If the word is already selected, clicking it again removes it.
    if (selected.includes(word)) {
      setSelected(selected.filter(w => w !== word));
      return;
    }

    // Connections only lets you pick 4 words at a time.
    if (selected.length >= 4) {
      showToast('Only select 4 words');
      return;
    }

    // Add the clicked word to the selected list.
    setSelected([...selected, word]);
  };

  const submitGroup = () => {
    // Stops submit from doing anything if the game is already over.
    if (status !== 'playing') return;

    // The user needs exactly 4 words before checking the answer.
    if (selected.length !== 4) {
      showToast('Select exactly 4 words');
      return;
    }

    // Look for a group that matches the 4 selected words.
    // Also makes sure they are not solving the same group again.
    const match = GROUPS.find(group =>
      sameGroup(selected, group.words) &&
      !solvedGroups.some(solved => solved.title === group.title)
    );

    if (match) {
      // Add the correct group to the solved list and clear the selected words.
      const updatedSolvedGroups = [...solvedGroups, match];
      setSolvedGroups(updatedSolvedGroups);
      setSelected([]);
      showToast(match.title);

      // If all 4 groups are solved, the player wins.
      if (updatedSolvedGroups.length === GROUPS.length) {
        const mistakesMade = MAX_MISTAKES - mistakesLeft;

        // Score goes down for each mistake, but does not go below 100.
        const score = Math.max(100, 700 - mistakesMade * 125);

        setFinalScore(score);
        setStatus('won');

        // Logged-in users get their score saved to the leaderboard.
        if (!isGuest) {
          onScoreUpdate?.(score, 'connections');

          // Small delay so the leaderboard has time to update before getting the rank.
          setTimeout(() => {
            if (user) {
              setUserRank(getUserRank(user.uid, 'connections'));
            }
          }, 100);
        }
      }

      return;
    }

    // If the selected words are wrong, take away one mistake.
    const newMistakesLeft = mistakesLeft - 1;
    setMistakesLeft(newMistakesLeft);
    setSelected([]);

    // If there are no mistakes left, the player loses.
    if (newMistakesLeft <= 0) {
      setStatus('lost');
      setFinalScore(0);
      showToast('Game over', 2500);
    } else {
      showToast('Not a group');
    }
  };

  const shuffleRemaining = () => {
    // Keeps solved groups where they are and only shuffles the unsolved words.
    setWords([
      ...solvedGroups.flatMap(group => group.words),
      ...shuffle(remainingWords),
    ]);
  };

  const resetGame = () => {
    // Resets everything back to a fresh game.
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

// All the styling for this page is kept down  here so the game logic stays easier to read
// and so it can be changed easier
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