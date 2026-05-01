import { useState, useEffect } from 'react';
import type { User } from '../types';

// --- DATA STRUCTURE ---
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

type TriviaItem = { id: string; categoryId: number; display: string; accepts: string[] };

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

type Props = {
  user: User | null;
  onScoreUpdate: (score: number) => void;
  onNavigate: (target: string) => void;
  onRegisterWithScore: (score: number, puzzleId: string) => void;
};

export default function CountdownTrivia({ user, onScoreUpdate, onRegisterWithScore }: Props) {
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes = 1200 seconds

  const isWon = foundIds.length === ITEMS.length;
  const isLost = timeLeft === 0 && !isWon;
  const isGameOver = isWon || isLost;

  useEffect(() => {
    if (!gameStarted || isGameOver) return;
    const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [gameStarted, isGameOver]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, '0');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value;
    const guess = rawInput.trim().toUpperCase();
    setInputValue(rawInput);

    // Look for any item that hasn't been found yet, where the guess matches one of its accepted aliases
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

  const renderCategory = (categoryId: number) => {
    const category = CATEGORIES.find(c => c.id === categoryId);
    const categoryItems = ITEMS.filter(item => item.categoryId === categoryId);

    return (
      <div key={categoryId} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h5 style={{ textAlign: 'center', color: '#fff', fontSize: '15px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
          {category?.title}
        </h5>
        
        {categoryItems.map((item) => {
          const isFound = foundIds.includes(item.id);
          const isMissed = isGameOver && !isFound; 
          
          let bgColor = '#1a1a1a'; 
          let borderColor = '#333';
          let textColor = '#666';

          if (isFound) {
            bgColor = '#0f5132'; borderColor = '#198754'; textColor = '#d1e7dd';
          } else if (isMissed) {
            bgColor = '#842029'; borderColor = '#dc3545'; textColor = '#f8d7da';
          }

          return (
            <div 
              key={item.id} 
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', borderRadius: '4px', height: '26px', fontSize: '13px', 
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
    <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted, #888)', textTransform: 'uppercase', letterSpacing: '1px' }}>Score</div>
            <h2 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: 'var(--text, #fff)' }}>
              {foundIds.length} / {ITEMS.length}
            </h2>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted, #888)', textTransform: 'uppercase', letterSpacing: '1px' }}>Timer</div>
            <h2 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: timeLeft <= 60 ? '#ff4444' : '#fff' }}>
              {minutes}:{seconds}
            </h2>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
          {!gameStarted ? (
            <button 
              onClick={() => setGameStarted(true)} 
              style={{ backgroundColor: 'var(--yellow, #f5c518)', color: '#111', border: 'none', borderRadius: '6px', padding: '12px 60px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              PLAY QUIZ
            </button>
          ) : isGameOver ? (
            <div style={{ padding: '12px 24px', backgroundColor: isWon ? '#0f5132' : '#842029', color: '#fff', borderRadius: '6px', fontWeight: 'bold', fontSize: '18px' }}>
              {isWon ? '🎉 Perfect Score!' : '⏰ Time is up! Review the answers below.'}
            </div>
          ) : (
            <input
              type="text"
              placeholder="Type an answer..."
              value={inputValue}
              onChange={handleInputChange}
              autoComplete="off"
              autoFocus
              style={{ backgroundColor: '#111', color: '#fff', border: '2px solid var(--border, #444)', borderRadius: '6px', padding: '12px 20px', fontSize: '18px', textAlign: 'center', width: '100%', maxWidth: '400px', outline: 'none' }}
            />
          )}
        </div>
      </div>

      {/* 2-COLUMN LAYOUT MATCHING THE IMAGE */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', width: '100%' }}>
        {/* Left Column (Odds) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[1, 3, 5, 7, 9].map(renderCategory)}
        </div>
        
        {/* Right Column (Evens) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[2, 4, 6, 8, 10].map(renderCategory)}
        </div>
      </div>
    </main>
  );
}