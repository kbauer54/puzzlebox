import { useState, useEffect } from 'react';
import type { User } from '../types';

// Trivia Categories 
const CATEGORIES = [
  { id: 1, title: "1 2x Heisman Trophy Winner" },
  { id: 2, title: "2 Female Major-Party VP Nominees (Pre-2020)" },
  { id: 3, title: "3 Alec Baldwin's Brothers" },
  { id: 4, title: "4 Beatles" },
  { id: 5, title: "5 Solar System Planets After Earth" },
  { id: 6, title: "6 Friends Lead Actors/Actresses" },
  { id: 7, title: "7 Continents" },
  { id: 8, title: "8 Rappers Eminem Ranks Above Himself ('Till I Collapse')" },
  { id: 9, title: "9 US States With Pop. Larger Than Michigan" },
  { id: 10, title: "10 Franchises Without An NBA Title" }
];
// Must have these four fields
type TriviaItem = { id: string; categoryId: number; display: string; accepts: string[] };
// Trivia Answers or Master Key (1 -1 is Category 1, Answer 1)  display is what user sees  
const ITEMS: TriviaItem[] = [
  // 1
  { id: '1-1', categoryId: 1, display: 'Archie Griffin', accepts: ['ARCHIE GRIFFIN', 'GRIFFIN'] },
  // 2
  { id: '2-1', categoryId: 2, display: 'Geraldine Ferraro', accepts: ['GERALDINE FERRARO', 'FERRARO'] },
  { id: '2-2', categoryId: 2, display: 'Sarah Palin', accepts: ['SARAH PALIN', 'PALIN'] },
  // 3
  { id: '3-1', categoryId: 3, display: 'Stephen', accepts: ['STEPHEN', 'STEPHEN BALDWIN'] },
  { id: '3-2', categoryId: 3, display: 'William', accepts: ['WILLIAM', 'WILLIAM BALDWIN', 'BILLY', 'BILLY BALDWIN'] },
  { id: '3-3', categoryId: 3, display: 'Daniel', accepts: ['DANIEL', 'DANIEL BALDWIN'] },
  // 4
  { id: '4-1', categoryId: 4, display: 'John Lennon', accepts: ['JOHN', 'JOHN LENNON', 'LENNON'] },
  { id: '4-2', categoryId: 4, display: 'Paul McCartney', accepts: ['PAUL', 'PAUL MCCARTNEY', 'MCCARTNEY'] },
  { id: '4-3', categoryId: 4, display: 'George Harrison', accepts: ['GEORGE', 'GEORGE HARRISON', 'HARRISON'] },
  { id: '4-4', categoryId: 4, display: 'Ringo Starr', accepts: ['RINGO', 'RINGO STARR', 'STARR'] },
  // 5
  { id: '5-1', categoryId: 5, display: 'Mars', accepts: ['MARS'] },
  { id: '5-2', categoryId: 5, display: 'Jupiter', accepts: ['JUPITER'] },
  { id: '5-3', categoryId: 5, display: 'Saturn', accepts: ['SATURN'] },
  { id: '5-4', categoryId: 5, display: 'Uranus', accepts: ['URANUS'] },
  { id: '5-5', categoryId: 5, display: 'Neptune', accepts: ['NEPTUNE'] },
  // 6 (Accepts Actor or Character names)
  { id: '6-1', categoryId: 6, display: 'Jennifer Aniston', accepts: ['JENNIFER ANISTON', 'ANISTON', 'RACHEL', 'RACHEL GREEN'] },
  { id: '6-2', categoryId: 6, display: 'Courteney Cox', accepts: ['COURTENEY COX', 'COX', 'MONICA', 'MONICA GELLER'] },
  { id: '6-3', categoryId: 6, display: 'Lisa Kudrow', accepts: ['LISA KUDROW', 'KUDROW', 'PHOEBE', 'PHOEBE BUFFAY'] },
  { id: '6-4', categoryId: 6, display: 'Matt LeBlanc', accepts: ['MATT LEBLANC', 'LEBLANC', 'JOEY', 'JOEY TRIBBIANI'] },
  { id: '6-5', categoryId: 6, display: 'Matthew Perry', accepts: ['MATTHEW PERRY', 'PERRY', 'CHANDLER', 'CHANDLER BING'] },
  { id: '6-6', categoryId: 6, display: 'David Schwimmer', accepts: ['DAVID SCHWIMMER', 'SCHWIMMER', 'ROSS', 'ROSS GELLER'] },
  // 7
  { id: '7-1', categoryId: 7, display: 'North America', accepts: ['NORTH AMERICA'] },
  { id: '7-2', categoryId: 7, display: 'South America', accepts: ['SOUTH AMERICA'] },
  { id: '7-3', categoryId: 7, display: 'Europe', accepts: ['EUROPE'] },
  { id: '7-4', categoryId: 7, display: 'Asia', accepts: ['ASIA'] },
  { id: '7-5', categoryId: 7, display: 'Africa', accepts: ['AFRICA'] },
  { id: '7-6', categoryId: 7, display: 'Australia', accepts: ['AUSTRALIA', 'OCEANIA'] },
  { id: '7-7', categoryId: 7, display: 'Antarctica', accepts: ['ANTARCTICA'] },
  // 8
  { id: '8-1', categoryId: 8, display: 'Redman', accepts: ['REDMAN', 'REGGIE', 'REGGIE NOBLE'] },
  { id: '8-2', categoryId: 8, display: 'Jay-Z', accepts: ['JAY-Z', 'JAY Z', 'JAYZ'] },
  { id: '8-3', categoryId: 8, display: 'Tupac', accepts: ['TUPAC', '2PAC', 'TUPAC SHAKUR', 'MAKAVELI'] },
  { id: '8-4', categoryId: 8, display: 'Biggie', accepts: ['BIGGIE', 'BIGGIE SMALLS', 'NOTORIOUS BIG', 'THE NOTORIOUS BIG', 'BIG'] },
  { id: '8-5', categoryId: 8, display: 'Andre 3000', accepts: ['ANDRE 3000', 'ANDRE', 'ANDRE FROM OUTKAST'] },
  { id: '8-6', categoryId: 8, display: 'Jadakiss', accepts: ['JADAKISS', 'JADA'] },
  { id: '8-7', categoryId: 8, display: 'Kurupt', accepts: ['KURUPT'] },
  { id: '8-8', categoryId: 8, display: 'Nas', accepts: ['NAS'] },
  // 9
  { id: '9-1', categoryId: 9, display: 'California', accepts: ['CALIFORNIA'] },
  { id: '9-2', categoryId: 9, display: 'Texas', accepts: ['TEXAS'] },
  { id: '9-3', categoryId: 9, display: 'Florida', accepts: ['FLORIDA'] },
  { id: '9-4', categoryId: 9, display: 'New York', accepts: ['NEW YORK'] },
  { id: '9-5', categoryId: 9, display: 'Pennsylvania', accepts: ['PENNSYLVANIA'] },
  { id: '9-6', categoryId: 9, display: 'Illinois', accepts: ['ILLINOIS'] },
  { id: '9-7', categoryId: 9, display: 'Ohio', accepts: ['OHIO'] },
  { id: '9-8', categoryId: 9, display: 'Georgia', accepts: ['GEORGIA'] },
  { id: '9-9', categoryId: 9, display: 'North Carolina', accepts: ['NORTH CAROLINA'] },
  // 10
  { id: '10-1', categoryId: 10, display: 'Suns', accepts: ['SUNS', 'PHOENIX SUNS'] },
  { id: '10-2', categoryId: 10, display: 'Jazz', accepts: ['JAZZ', 'UTAH JAZZ'] },
  { id: '10-3', categoryId: 10, display: 'Nets', accepts: ['NETS', 'BROOKLYN NETS', 'NEW JERSEY NETS'] },
  { id: '10-4', categoryId: 10, display: 'Magic', accepts: ['MAGIC', 'ORLANDO MAGIC'] },
  { id: '10-5', categoryId: 10, display: 'Pacers', accepts: ['PACERS', 'INDIANA PACERS'] },
  { id: '10-6', categoryId: 10, display: 'Hornets', accepts: ['HORNETS', 'CHARLOTTE HORNETS'] },
  { id: '10-7', categoryId: 10, display: 'Grizzlies', accepts: ['GRIZZLIES', 'MEMPHIS GRIZZLIES'] },
  { id: '10-8', categoryId: 10, display: 'Pelicans', accepts: ['PELICANS', 'NEW ORLEANS PELICANS'] },
  { id: '10-9', categoryId: 10, display: 'Clippers', accepts: ['CLIPPERS', 'LA CLIPPERS', 'LOS ANGELES CLIPPERS'] },
  { id: '10-10', categoryId: 10, display: 'Timberwolves', accepts: ['TIMBERWOLVES', 'MINNESOTA TIMBERWOLVES'] },
];
// function parameters
type Props = {
  user: User | null; //null means not logged in, otherwise contains user info
  onScoreUpdate: (score: number) => void; //called if user logged in
  onNavigate: (target: string) => void;
  onRegisterWithScore: (score: number, puzzleId: string) => void;
};

export default function CountdownTrivia({ user, onScoreUpdate, onRegisterWithScore, onNavigate }: Props) {
  const [foundIds, setFoundIds] = useState<string[]>([]); //foundIds tracks which users get it right stored as an array starts at 0
  const [inputValue, setInputValue] = useState(''); //what user is currently typing in 
  
  const [gameStarted, setGameStarted] = useState(false); //start quiz button pressed or not
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes timer 

  const isWon = foundIds.length === ITEMS.length; 
  const isLost = timeLeft === 0 && !isWon; //user won! or time ran out without finding all answers
  const isGameOver = isWon || isLost; //either condition ends game

  useEffect(() => {
    if (!gameStarted || isGameOver) return;
    const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timerId); // cleanup stops timer when component unmounts or game ends
  }, [gameStarted, isGameOver]); // important for memory leaks

  const minutes = Math.floor(timeLeft / 60); //timer visuals
  const seconds = String(timeLeft % 60).padStart(2, '0');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value;
    const guess = rawInput.trim().toUpperCase();
    setInputValue(rawInput);

    // The guess must match master key exactly, future iterations would allow typos and partial matches
    const match = ITEMS.find(item => 
      !foundIds.includes(item.id) && 
      item.accepts.some(alias => alias === guess)
    );

    if (match) {
      const newFoundIds = [...foundIds, match.id];
      setFoundIds(newFoundIds);
      setInputValue(''); 

      if (newFoundIds.length === ITEMS.length) {
        if (user) onScoreUpdate(800);
        else onRegisterWithScore(800, 'countdown-trivia');
      }
    }
  };
   // shows the found answers and hides the others, answers in red when game is over
  const renderCategory = (categoryId: number) => { 
    const category = CATEGORIES.find(c => c.id === categoryId);
    const categoryItems = ITEMS.filter(item => item.categoryId === categoryId);

    return ( // columns
      <div key={categoryId} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <h6 style={{ 
          textAlign: 'center', 
          color: 'var(--yellow, #f5c518)', 
          fontSize: '12px', 
          fontWeight: 'bold', 
          margin: '0 0 4px 0',
          textTransform: 'uppercase' 
        }}>
          {category?.title}
        </h6>
        
        {categoryItems.map((item) => { // looks through categorys and checks
          const isFound = foundIds.includes(item.id);
          const isMissed = isGameOver && !isFound; 
          
          let bgColor = '#111'; 
          let borderColor = '#222';
          let textColor = '#444';

          if (isFound) {
            bgColor = '#0f5132'; borderColor = '#198754'; textColor = '#d1e7dd'; //correct its green
          } else if (isMissed) {
            bgColor = '#441111'; borderColor = '#dc3545'; textColor = '#f8d7da'; //wrong its red
          }

          return (
            <div 
              key={item.id} 
              style={{ // answer box sizes and styles
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', borderRadius: '2px', height: '20px', fontSize: '11px', 
                border: `1px solid ${borderColor}`, backgroundColor: bgColor, color: textColor,
                transition: 'all 0.2s ease', overflow: 'hidden', whiteSpace: 'nowrap'
              }}
            >
              {isFound || isMissed ? item.display : ''}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '10px 20px' }}>
      {/* HEADER SECTION - MADE COMPACT */}
      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase' }}>Score</div>
            <h3 style={{ margin: 0, fontWeight: 'bold', color: '#fff' }}>{foundIds.length} / {ITEMS.length}</h3>
          </div>
          
          {/* PLAY BUTTON / INPUT BOX CENTERED */}
          <div style={{ minWidth: '300px' }}> // start quiz button stuff
            {!gameStarted ? (
              <button 
                onClick={() => setGameStarted(true)} 
                style={{ backgroundColor: 'var(--yellow, #f5c518)', color: '#111', border: 'none', borderRadius: '4px', padding: '8px 30px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}
              >
                START QUIZ
              </button>
            ) : isGameOver ? (
              <div style={{ padding: '8px', backgroundColor: isWon ? '#0f5132' : '#661111', color: '#fff', borderRadius: '4px', fontWeight: 'bold' }}>
                {isWon ? 'Perfect!' : 'Game Over'}
              </div>
            ) : (
              <input
                type="text"
                placeholder="Type an answer..."
                value={inputValue}
                onChange={handleInputChange}
                autoComplete="off"
                autoFocus
                style={{ backgroundColor: '#111', color: '#fff', border: '1px solid #444', borderRadius: '4px', padding: '8px', fontSize: '16px', textAlign: 'center', width: '100%' }}
              />
            )}
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase' }}>Time</div>
            <h3 style={{ margin: 0, fontWeight: 'bold', color: timeLeft <= 60 ? '#ff4444' : '#fff' }}>{minutes}:{seconds}</h3>
          </div>

          {/* DEV — for testing */}
            {gameStarted && !isGameOver && (
              <button
                onClick={() => setTimeLeft(0)}
                style={{
                  background: '#661111', color: '#fff', border: '1px solid #dc3545',
                  borderRadius: 4, padding: '4px 10px', fontSize: 11,
                  fontWeight: 700, cursor: 'pointer',
                }}
              >
                🛠 End
              </button>
            )}
        </div>
      </div>

      {/* 2-COLUMN LAYOUT WITH REDUCED GAPS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Left Column (Odds: 1, 3, 5, 7, 9) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 3, 5, 7, 9].map(renderCategory)}
        </div>
        
        {/* Right Column (Evens: 2, 4, 6, 8, 10) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[2, 4, 6, 8, 10].map(renderCategory)}
        </div>
      </div>

      {isGameOver && ( // endgame stuff like time remaining and register button if user is logged out
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(14,14,14,0.88)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(6px)', zIndex: 50,
        }}>
          <div style={{
            textAlign: 'center', padding: '32px 28px', background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 12,
            width: '100%', maxWidth: 340, margin: '0 16px',
          }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>{isWon ? '🏆' : '😔'}</div>

            <div style={{
              fontFamily: "'Playfair Display', serif", fontSize: 32,
              color: 'var(--yellow)', fontWeight: 700, marginBottom: 6,
            }}>
              {isWon ? '800 pts' : '0 pts'}
            </div>

            <div style={{ fontSize: 14, color: 'var(--text-dim)', marginBottom: 6 }}>
              {isWon
                ? `All ${ITEMS.length} answers found!`
                : `You found ${foundIds.length} of ${ITEMS.length} answers`}
            </div>

            {isWon && (
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                Time remaining: {minutes}:{seconds}
              </div>
            )}

            {!user && (
              <div style={{
                background: 'rgba(200,168,75,0.08)', border: '1px solid var(--yellow-dim)',
                borderRadius: 8, padding: '12px 16px', marginBottom: 16,
              }}>
                <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.5, marginBottom: 10 }}>
                  {isWon
                    ? <>Register to save your <strong style={{ color: 'var(--yellow)' }}>800 pts</strong> and appear on the leaderboard!</>
                    : 'Register free to track your progress and compete on the leaderboard.'}
                </p>
                <button
                  onClick={() => onRegisterWithScore(isWon ? 800 : 0, 'countdown')}
                  style={{
                    background: 'var(--yellow)', color: '#111', border: 'none',
                    borderRadius: 6, padding: '8px 18px', fontSize: 12,
                    fontWeight: 700, cursor: 'pointer', width: '100%',
                  }}
                >
                  Register &amp; Save Score →
                </button>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                onClick={() => onNavigate('leaderboard')}
                style={{
                  background: 'transparent', color: 'var(--text-dim)',
                  border: '1px solid var(--border)', borderRadius: 6,
                  padding: '10px 18px', fontSize: 13, cursor: 'pointer',
                }}
              >
                Leaderboard
              </button>
              <button
                onClick={() => {
                  setFoundIds([]); setInputValue('');
                  setGameStarted(false); setTimeLeft(1200);
                }}
                style={{
                  background: '#538d4e', color: '#fff', border: 'none',
                  borderRadius: 6, padding: '11px 22px', fontSize: 13,
                  fontWeight: 700, cursor: 'pointer',
                }}
              >
                Play Again →
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  ); 
}