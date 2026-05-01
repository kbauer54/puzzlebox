import { useState, useEffect, useCallback } from 'react';
import { getUserRank } from './LeaderboardDatabase';
import type { User } from '../types';

const WORDS = [
  'crane','slate','trace','audio','raise','arose','stare','snare','share','score',
  'store','shore','horse','house','mouse','mouth','south','shout','scout','grout',
  'trout','black','blank','bland','blend','bleed','breed','bread','break','cream',
  'cleat','clean','clear','cheat','cheap','chair','chain','charm','chart','chase',
  'chest','chief','child','choir','chord','clash','clasp','class','crave','crawl',
  'early','earth','eight','elbow','elder','empty','enter','evade','event','exact',
  'faith','false','fancy','fatal','fault','feast','field','fifth','fifty','fight',
  'final','first','fixed','flame','flare','flash','flask','flesh','float','flock',
  'flood','floor','flute','focus','force','forge','forte','forum','found','frank',
  'fraud','freak','freed','fresh','front','frost','fruit','games','giant','given',
  'glass','glaze','gleam','glide','gloom','glory','grace','grade','grain','grand',
  'grant','grasp','grass','grave','graze','greed','green','greet','grief','grind',
  'groan','grove','growl','grown','guard','guess','guide','gusto','hardy','haste',
  'haunt','haven','heart','heavy','hedge','heist','hinge','hoist','homer','honey',
  'honor','horde','hotel','hover','human','humor','hurry','image','imply','incur',
  'index','infer','inner','input','inter','intro','irate','irony','joust','judge',
  'juice','juicy','knack','knave','kneel','knife','knock','knots','known','label',
  'lance','large','laser','latch','later','laugh','layer','learn','lease','least',
  'leave','ledge','legal','lemon','level','light','linen','liner','liver','lodge',
  'logic','loose','lower','loyal','lucky','lunar','lunch','magic','major','maker',
  'manor','maple','march','marsh','media','merge','merit','metal','might','minor',
  'minus','mirth','miser','mixed','model','mogul','moist','money','moose','moral',
  'mourn','movie','music','naval','nerve','night','ninja','noble','noise','north',
  'novel','ocean','offer','often','olive','onset','opera','orbit','order','outer',
  'paint','panic','paper','party','pasta','paste','patch','pause','peace','peach',
  'perch','peril','phase','piano','pilot','pitch','pixel','pizza','place','plain',
  'plane','plank','plant','plate','plaza','plead','pluck','plume','point','polar',
  'porch','pouch','power','prank','prawn','price','pride','prime','print','prior',
  'prize','probe','prose','proud','prove','pulse','punch','pupil','purge','purse',
  'queen','query','quest','quick','quiet','quirk','quota','quote','radar','radio',
  'rally','ranch','range','rapid','ratio','reach','react','realm','rebel','reign',
  'relax','repel','reply','rider','ridge','risky','rival','river','rivet','roast',
  'robin','robot','rocky','rouge','rough','round','route','royal','ruler','rusty',
  'saint','salad','sauce','scale','scalp','scare','scarf','scene','scone','scoop',
  'scope','scorn','scowl','screw','sedan','seize','sense','serum','setup','seven',
  'shake','shall','shame','shape','shark','shave','sheep','shelf','shell','shift',
  'shiny','shirt','shock','shook','shoot','short','siege','sigma','silly','since',
  'sixth','sixty','skill','skirt','skull','slant','slash','slave','sleek','sleep',
  'slice','slide','sling','small','smart','smash','smile','smirk','smoke','sneak',
  'snore','solar','solid','solve','sonic','sorry','spare','spark','spawn','speak',
  'spear','speed','spend','spice','spill','spine','spoke','spoon','sport','spray',
  'squad','squat','squid','stack','staff','stage','stain','stair','stake','stalk',
  'stall','stamp','stand','stark','start','steal','steam','steel','steep','steer',
  'stern','stick','stiff','still','sting','stock','stomp','stone','stool','storm',
  'story','stove','strap','straw','stray','strip','stuck','study','stump','style',
  'sugar','sunny','super','surge','swamp','swear','sweat','sweep','sweet','swift',
  'swing','swipe','swirl','swoop','sword','syrup','table','talon','tango','teach',
  'tease','teeth','tempo','tense','terms','terse','thank','their','theme','there',
  'thick','thief','think','third','thorn','those','three','threw','throw','thump',
  'tiger','tight','timer','tired','title','today','token','tonic','torch','total',
  'touch','tough','towel','tower','toxic','track','trail','train','trait','tramp',
  'trash','tread','treat','trend','trick','tried','troll','truck','trunk','trust',
  'truth','tulip','tumor','tuner','twist','ultra','uncle','unify','union','unite',
  'upset','usher','usual','utter','vague','valid','valor','valve','vault','vicar',
  'video','vigil','vigor','viral','virus','vista','vital','vivid','vocal','voter',
  'waist','waltz','waste','watch','water','weary','weave','wedge','weird','whale',
  'wheat','while','whirl','whisk','white','whole','witch','witty','world','worry',
  'worse','worst','worth','wrath','wrist','write','wrong','yacht','yearn','young',
  'youth','zesty','zippy',
];

type TileState = 'correct' | 'present' | 'absent' | 'filled' | 'empty';
type GameStatus = 'playing' | 'won' | 'lost';
interface TileResult { letter: string; state: TileState; }

const WORD_LENGTH  = 5;
const MAX_GUESSES  = 6;
const WIN_MESSAGES = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!'];
const SCORE_MAP: Record<number, number> = { 1: 600, 2: 500, 3: 400, 4: 300, 5: 200, 6: 100 };

const KEYBOARD_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','⌫'],
];

const TILE_BG: Record<TileState, string> = {
  correct: '#538d4e', present: '#b59f3b', absent: '#3a3a3c', filled: 'transparent', empty: 'transparent',
};
const TILE_BORDER: Record<TileState, string> = {
  correct: '#538d4e', present: '#b59f3b', absent: '#3a3a3c', filled: '#565758', empty: '#3a3a3c',
};
const KEY_BG: Record<string, string> = {
  correct: '#538d4e', present: '#b59f3b', absent: '#3a3a3c',
};

function pickRandom(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
}

function evaluateGuess(guess: string, answer: string): TileResult[] {
  const result: TileResult[] = Array.from({ length: WORD_LENGTH }, (_, i) => ({
    letter: guess[i], state: 'absent' as TileState,
  }));
  const remaining = answer.split('');
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === answer[i]) { result[i].state = 'correct'; remaining[i] = ''; }
  }
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i].state === 'correct') continue;
    const idx = remaining.indexOf(guess[i]);
    if (idx !== -1) { result[i].state = 'present'; remaining[idx] = ''; }
  }
  return result;
}

interface WordleGameProps {
  user: User | null;
  onScoreUpdate?: (score: number) => void;
  onNavigate: (page: string) => void;
  /** Called when a guest clicks Register after winning — passes the score so it can be saved immediately on account creation */
  onRegisterWithScore: (score: number, puzzleId: string) => void;
}

export default function WordleGame({ user, onScoreUpdate, onNavigate, onRegisterWithScore }: WordleGameProps) {
  const [answer, setAnswer]         = useState(pickRandom);
  const [guesses, setGuesses]       = useState<TileResult[][]>([]);
  const [current, setCurrent]       = useState('');
  const [status, setStatus]         = useState<GameStatus>('playing');
  const [revealRow, setRevealRow]   = useState<number | null>(null);
  const [shakeRow, setShakeRow]     = useState(false);
  const [toast, setToast]           = useState('');
  const [finalScore, setFinalScore] = useState(0);
  const [userRank, setUserRank]     = useState<number | null>(null);

  const isGuest = !user;

  // If the user registers after winning, fetch their rank immediately
  useEffect(() => {
    if (user && status === 'won' && userRank === null) {
      const rank = getUserRank(user.uid, 'wordle');
      setUserRank(rank);
    }
  }, [user, status, userRank]);

  const showToast = (msg: string, ms = 1800) => {
    setToast(msg); setTimeout(() => setToast(''), ms);
  };

  const keyStates = guesses.reduce<Record<string, TileState>>((acc, row) => {
    row.forEach(({ letter, state }) => {
      const prev = acc[letter];
      if (prev === 'correct') return;
      if (prev === 'present' && state !== 'correct') return;
      acc[letter] = state;
    });
    return acc;
  }, {});

  const submitGuess = useCallback(() => {
    if (current.length !== WORD_LENGTH) {
      setShakeRow(true); setTimeout(() => setShakeRow(false), 500);
      showToast('Not enough letters'); return;
    }
    if (!WORDS.includes(current.toLowerCase())) {
      setShakeRow(true); setTimeout(() => setShakeRow(false), 500);
      showToast('Not in word list'); return;
    }

    const result     = evaluateGuess(current, answer);
    const newGuesses = [...guesses, result];
    setGuesses(newGuesses);
    setRevealRow(newGuesses.length - 1);
    setCurrent('');

    const won = result.every(t => t.state === 'correct');

    if (won) {
      const score = SCORE_MAP[newGuesses.length] ?? 100;
      setFinalScore(score);
      setTimeout(() => {
        setStatus('won');
        showToast(WIN_MESSAGES[newGuesses.length - 1] ?? 'Nice!', 2000);
        if (!isGuest) {
          onScoreUpdate?.(score);
          setTimeout(() => {
            if (user) setUserRank(getUserRank(user.uid, 'wordle'));
          }, 100);
        }
      }, WORD_LENGTH * 350 + 300);
    } else if (newGuesses.length >= MAX_GUESSES) {
      setTimeout(() => {
        setStatus('lost');
        showToast(answer, 3500);
      }, WORD_LENGTH * 350 + 300);
    }
  }, [current, guesses, answer, isGuest, user, onScoreUpdate]);

  const handleKey = useCallback((key: string) => {
    if (status !== 'playing') return;
    if (key === 'ENTER')                                           { submitGuess(); }
    else if (key === 'BACKSPACE' || key === '⌫')                   { setCurrent(g => g.slice(0, -1)); }
    else if (/^[A-Z]$/.test(key) && current.length < WORD_LENGTH) { setCurrent(g => g + key); }
  }, [status, current, submitGuess]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      handleKey(e.key.toUpperCase());
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleKey]);

  const reset = () => {
    setAnswer(pickRandom()); setGuesses([]); setCurrent('');
    setStatus('playing'); setRevealRow(null); setToast('');
    setFinalScore(0); setUserRank(null);
  };

  return (
    <div style={s.page}>
      <div style={s.breadcrumb} onClick={() => onNavigate('home')}>← Home</div>

      <div style={s.gameArea}>
        <div style={s.header}>
          <h1 style={s.title}>WORDLE</h1>
          {/* DEBUG — remove before final submission */}
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, fontFamily: 'monospace' }}>
            🛠 answer: {answer}
          </div>
          <div style={s.divider} />
        </div>

        <div style={{ ...s.toast, opacity: toast ? 1 : 0 }}>{toast}</div>

        <div style={s.grid}>
          {Array.from({ length: MAX_GUESSES }).map((_, rowIdx) => {
            const isCurrent   = rowIdx === guesses.length && status === 'playing';
            const completed   = guesses[rowIdx];
            const isRevealing = revealRow === rowIdx;
            const doShake     = isCurrent && shakeRow;
            return (
              <div key={rowIdx} style={{ ...s.row, animation: doShake ? 'wShake 0.5s ease' : undefined }}>
                {Array.from({ length: WORD_LENGTH }).map((_, colIdx) => {
                  let letter = ''; let state: TileState = 'empty';
                  if (completed) { letter = completed[colIdx].letter; state = completed[colIdx].state; }
                  else if (isCurrent) { letter = current[colIdx] ?? ''; state = letter ? 'filled' : 'empty'; }
                  const delay = isRevealing ? `${colIdx * 350}ms` : '0ms';
                  return (
                    <div key={colIdx} style={{
                      ...s.tile,
                      background:  completed ? TILE_BG[state] : 'transparent',
                      borderColor: TILE_BORDER[state],
                      transform:   (!completed && letter) ? 'scale(1.06)' : 'scale(1)',
                      transition:  'transform 0.08s ease',
                      animation:   isRevealing ? `wFlip 0.6s ease ${delay} forwards` : undefined,
                    }}>
                      {letter}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div style={s.keyboard}>
          {KEYBOARD_ROWS.map((row, ri) => (
            <div key={ri} style={s.keyRow}>
              {row.map(key => {
                const wide = key === 'ENTER' || key === '⌫';
                const bg   = KEY_BG[keyStates[key]] ?? '#818384';
                return (
                  <button key={key} onClick={() => handleKey(key)}
                    style={{ ...s.key, ...(wide ? s.keyWide : {}), background: bg, fontSize: key === 'ENTER' ? 10 : 14 }}>
                    {key}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {status !== 'playing' && (
          <div style={s.overlay}>
            <div style={s.endPanel} className="pop-in">

              {status === 'won' && (
                <>
                  <div style={s.endEmoji}>🏆</div>
                  <div style={s.endScore}>{finalScore} pts</div>
                  <div style={s.endSub}>
                    Solved in {guesses.length} {guesses.length === 1 ? 'guess' : 'guesses'}
                  </div>
                  {!isGuest && (
                    <div style={s.rankRow}>
                      <span style={s.rankLabel}>Your Wordle Rank</span>
                      <span style={s.rankValue}>
                        {userRank !== null ? `#${userRank}` : '…'}
                      </span>
                    </div>
                  )}
                  {isGuest && (
                    <div style={s.guestNudge}>
                      <p style={s.nudgeText}>
                        Register to save your <strong style={{ color: 'var(--yellow)' }}>{finalScore} pts</strong> and appear on the leaderboard!
                      </p>
                      <button style={s.nudgeBtn} onClick={() => onRegisterWithScore(finalScore, 'wordle')}>
                        Register &amp; Save Score →
                      </button>
                    </div>
                  )}
                </>
              )}

              {status === 'lost' && (
                <>
                  <div style={s.endEmoji}>😔</div>
                  <div style={{ ...s.endScore, fontSize: 22 }}>Better luck next time</div>
                  <div style={s.endSub}>
                    The word was <strong style={{ color: 'var(--yellow)' }}>{answer}</strong>
                  </div>
                  {isGuest && (
                    <div style={s.guestNudge}>
                      <p style={s.nudgeText}>
                        Register free to track your progress and compete on the leaderboard.
                      </p>
                      <button style={s.nudgeBtn} onClick={() => onRegisterWithScore(0, 'wordle')}>
                        Register Free →
                      </button>
                    </div>
                  )}
                </>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'center' }}>
                <button style={s.btnGhost} onClick={() => onNavigate('leaderboard')}>Leaderboard</button>
                <button style={s.btnPrimary} onClick={reset}>Play Again →</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes wFlip {
          0%   { transform: rotateX(0deg); }
          49%  { transform: rotateX(-90deg); }
          50%  { transform: rotateX(-90deg); }
          100% { transform: rotateX(0deg); }
        }
        @keyframes wShake {
          0%, 100% { transform: translateX(0); }
          15%      { transform: translateX(-5px); }
          45%      { transform: translateX(5px); }
          75%      { transform: translateX(-3px); }
          90%      { transform: translateX(3px); }
        }
      `}</style>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { maxWidth: 520, margin: '0 auto', padding: '24px 16px 60px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  breadcrumb: { alignSelf: 'flex-start', fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer', marginBottom: 16 },
  gameArea: { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' },
  header: { textAlign: 'center', width: '100%', maxWidth: 360, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: 700, letterSpacing: '0.3rem', color: 'var(--text)', fontFamily: 'Inter, sans-serif', marginBottom: 12 },
  divider: { width: '100%', height: 1, background: 'var(--border)' },
  toast: { background: '#fff', color: '#121213', fontWeight: 700, fontSize: 13, padding: '9px 20px', borderRadius: 6, margin: '10px 0', transition: 'opacity 0.2s', pointerEvents: 'none', minHeight: 36, display: 'flex', alignItems: 'center' },
  grid: { display: 'flex', flexDirection: 'column', gap: 5, margin: '8px 0 20px' },
  row: { display: 'flex', gap: 5 },
  tile: { width: 58, height: 58, border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, textTransform: 'uppercase', color: '#fff', borderRadius: 2, fontFamily: 'Inter, sans-serif' },
  keyboard: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 },
  keyRow: { display: 'flex', gap: 5, justifyContent: 'center' },
  key: { height: 54, minWidth: 40, borderRadius: 4, border: 'none', color: '#fff', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px', fontFamily: 'Inter, sans-serif', transition: 'background 0.1s', WebkitTapHighlightColor: 'transparent' },
  keyWide: { minWidth: 62, fontSize: 10 },
  overlay: { position: 'absolute', inset: 0, background: 'rgba(14,14,14,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)', zIndex: 10, borderRadius: 8 },
  endPanel: { textAlign: 'center', padding: '28px 24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, width: '100%', maxWidth: 320, margin: '0 16px' },
  endEmoji: { fontSize: 40, marginBottom: 10 },
  endScore: { fontFamily: "'Playfair Display', serif", fontSize: 30, color: 'var(--yellow)', fontWeight: 700, marginBottom: 4 },
  endSub: { fontSize: 13, color: 'var(--text-dim)', marginBottom: 14 },
  rankRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 16px', marginBottom: 14 },
  rankLabel: { fontSize: 12, color: 'var(--text-muted)' },
  rankValue: { fontSize: 20, fontWeight: 700, color: 'var(--green)', fontFamily: "'JetBrains Mono', monospace" },
  guestNudge: { background: 'rgba(200,168,75,0.08)', border: '1px solid var(--yellow-dim)', borderRadius: 8, padding: '12px 16px', marginBottom: 14 },
  nudgeText: { fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.5, marginBottom: 10 },
  nudgeBtn: { background: 'var(--yellow)', color: '#111', border: 'none', borderRadius: 6, padding: '8px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif', width: '100%' },
  btnPrimary: { background: '#538d4e', color: '#fff', border: 'none', borderRadius: 6, padding: '11px 22px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
  btnGhost: { background: 'transparent', color: 'var(--text-dim)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 18px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
};