// src/components/TriviaGame.tsx
import { useState, useEffect } from 'react';
import type { User } from '../types';

// 1. The Data Structure
type Team = { id: string; league: string; city: string; name: string };
// Answer Key
const TEAMS: Team[] = [
  // --- NFL (32 Teams) ---
  { id: 'nfl-ari', league: 'NFL', city: 'Arizona', name: 'CARDINALS' },
  { id: 'nfl-atl', league: 'NFL', city: 'Atlanta', name: 'FALCONS' },
  { id: 'nfl-car', league: 'NFL', city: 'Carolina', name: 'PANTHERS' },
  { id: 'nfl-chi', league: 'NFL', city: 'Chicago', name: 'BEARS' },
  { id: 'nfl-dal', league: 'NFL', city: 'Dallas', name: 'COWBOYS' },
  { id: 'nfl-det', league: 'NFL', city: 'Detroit', name: 'LIONS' },
  { id: 'nfl-gb',  league: 'NFL', city: 'Green Bay', name: 'PACKERS' },
  { id: 'nfl-lar', league: 'NFL', city: 'Los Angeles', name: 'RAMS' },
  { id: 'nfl-min', league: 'NFL', city: 'Minnesota', name: 'VIKINGS' },
  { id: 'nfl-no',  league: 'NFL', city: 'New Orleans', name: 'SAINTS' },
  { id: 'nfl-nyg', league: 'NFL', city: 'New York', name: 'GIANTS' },
  { id: 'nfl-phi', league: 'NFL', city: 'Philadelphia', name: 'EAGLES' },
  { id: 'nfl-sf',  league: 'NFL', city: 'San Francisco', name: '49ERS' },
  { id: 'nfl-sea', league: 'NFL', city: 'Seattle', name: 'SEAHAWKS' },
  { id: 'nfl-tb',  league: 'NFL', city: 'Tampa Bay', name: 'BUCCANEERS' },
  { id: 'nfl-was', league: 'NFL', city: 'Washington', name: 'COMMANDERS' },
  { id: 'nfl-bal', league: 'NFL', city: 'Baltimore', name: 'RAVENS' },
  { id: 'nfl-buf', league: 'NFL', city: 'Buffalo', name: 'BILLS' },
  { id: 'nfl-cin', league: 'NFL', city: 'Cincinnati', name: 'BENGALS' },
  { id: 'nfl-cle', league: 'NFL', city: 'Cleveland', name: 'BROWNS' },
  { id: 'nfl-den', league: 'NFL', city: 'Denver', name: 'BRONCOS' },
  { id: 'nfl-hou', league: 'NFL', city: 'Houston', name: 'TEXANS' },
  { id: 'nfl-ind', league: 'NFL', city: 'Indianapolis', name: 'COLTS' },
  { id: 'nfl-jax', league: 'NFL', city: 'Jacksonville', name: 'JAGUARS' },
  { id: 'nfl-kc',  league: 'NFL', city: 'Kansas City', name: 'CHIEFS' },
  { id: 'nfl-lv',  league: 'NFL', city: 'Las Vegas', name: 'RAIDERS' },
  { id: 'nfl-lac', league: 'NFL', city: 'Los Angeles', name: 'CHARGERS' },
  { id: 'nfl-mia', league: 'NFL', city: 'Miami', name: 'DOLPHINS' },
  { id: 'nfl-ne',  league: 'NFL', city: 'New England', name: 'PATRIOTS' },
  { id: 'nfl-nyj', league: 'NFL', city: 'New York', name: 'JETS' },
  { id: 'nfl-pit', league: 'NFL', city: 'Pittsburgh', name: 'STEELERS' },
  { id: 'nfl-ten', league: 'NFL', city: 'Tennessee', name: 'TITANS' },

  // --- NBA (30 Teams) ---
  { id: 'nba-atl', league: 'NBA', city: 'Atlanta', name: 'HAWKS' },
  { id: 'nba-bos', league: 'NBA', city: 'Boston', name: 'CELTICS' },
  { id: 'nba-brk', league: 'NBA', city: 'Brooklyn', name: 'NETS' },
  { id: 'nba-cha', league: 'NBA', city: 'Charlotte', name: 'HORNETS' },
  { id: 'nba-chi', league: 'NBA', city: 'Chicago', name: 'BULLS' },
  { id: 'nba-cle', league: 'NBA', city: 'Cleveland', name: 'CAVALIERS' },
  { id: 'nba-dal', league: 'NBA', city: 'Dallas', name: 'MAVERICKS' },
  { id: 'nba-den', league: 'NBA', city: 'Denver', name: 'NUGGETS' },
  { id: 'nba-det', league: 'NBA', city: 'Detroit', name: 'PISTONS' },
  { id: 'nba-gs',  league: 'NBA', city: 'Golden State', name: 'WARRIORS' },
  { id: 'nba-hou', league: 'NBA', city: 'Houston', name: 'ROCKETS' },
  { id: 'nba-ind', league: 'NBA', city: 'Indiana', name: 'PACERS' },
  { id: 'nba-lac', league: 'NBA', city: 'Los Angeles', name: 'CLIPPERS' },
  { id: 'nba-lal', league: 'NBA', city: 'Los Angeles', name: 'LAKERS' },
  { id: 'nba-mem', league: 'NBA', city: 'Memphis', name: 'GRIZZLIES' },
  { id: 'nba-mia', league: 'NBA', city: 'Miami', name: 'HEAT' },
  { id: 'nba-mil', league: 'NBA', city: 'Milwaukee', name: 'BUCKS' },
  { id: 'nba-mnc', league: 'NBA', city: 'Minnesota', name: 'TIMBERWOLVES' },
  { id: 'nba-nop', league: 'NBA', city: 'New Orleans', name: 'PELICANS' },
  { id: 'nba-ny',  league: 'NBA', city: 'New York', name: 'KNICKS' },
  { id: 'nba-okc', league: 'NBA', city: 'Oklahoma City', name: 'THUNDER' },
  { id: 'nba-orl', league: 'NBA', city: 'Orlando', name: 'MAGIC' },
  { id: 'nba-phi', league: 'NBA', city: 'Philadelphia', name: '76ERS' },
  { id: 'nba-phx', league: 'NBA', city: 'Phoenix', name: 'SUNS' },
  { id: 'nba-por', league: 'NBA', city: 'Portland', name: 'TRAIL BLAZERS' },
  { id: 'nba-sac', league: 'NBA', city: 'Sacramento', name: 'KINGS' },
  { id: 'nba-sas', league: 'NBA', city: 'San Antonio', name: 'SPURS' },
  { id: 'nba-tor', league: 'NBA', city: 'Toronto', name: 'RAPTORS' },
  { id: 'nba-uta', league: 'NBA', city: 'Utah', name: 'JAZZ' },
  { id: 'nba-wsh', league: 'NBA', city: 'Washington', name: 'WIZARDS' },

  // --- MLB (30 Teams) ---
  { id: 'mlb-ari', league: 'MLB', city: 'Arizona', name: 'DIAMONDBACKS' },
  { id: 'mlb-atl', league: 'MLB', city: 'Atlanta', name: 'BRAVES' },
  { id: 'mlb-bal', league: 'MLB', city: 'Baltimore', name: 'ORIOLES' },
  { id: 'mlb-bos', league: 'MLB', city: 'Boston', name: 'RED SOX' },
  { id: 'mlb-chc', league: 'MLB', city: 'Chicago', name: 'CUBS' },
  { id: 'mlb-chi', league: 'MLB', city: 'Chicago', name: 'WHITE SOX' },
  { id: 'mlb-cin', league: 'MLB', city: 'Cincinnati', name: 'REDS' },
  { id: 'mlb-cle', league: 'MLB', city: 'Cleveland', name: 'GUARDIANS' },
  { id: 'mlb-col', league: 'MLB', city: 'Colorado', name: 'ROCKIES' },
  { id: 'mlb-det', league: 'MLB', city: 'Detroit', name: 'TIGERS' },
  { id: 'mlb-hou', league: 'MLB', city: 'Houston', name: 'ASTROS' },
  { id: 'mlb-kc',  league: 'MLB', city: 'Kansas City', name: 'ROYALS' },
  { id: 'mlb-ana', league: 'MLB', city: 'Los Angeles', name: 'ANGELS' },
  { id: 'mlb-lad', league: 'MLB', city: 'Los Angeles', name: 'DODGERS' },
  { id: 'mlb-mia', league: 'MLB', city: 'Miami', name: 'MARLINS' },
  { id: 'mlb-mil', league: 'MLB', city: 'Milwaukee', name: 'BREWERS' },
  { id: 'mlb-min', league: 'MLB', city: 'Minnesota', name: 'TWINS' },
  { id: 'mlb-nym', league: 'MLB', city: 'New York', name: 'METS' },
  { id: 'mlb-nyy', league: 'MLB', city: 'New York', name: 'YANKEES' },
  { id: 'mlb-oak', league: 'MLB', city: 'Oakland', name: 'ATHLETICS' }, 
  { id: 'mlb-phi', league: 'MLB', city: 'Philadelphia', name: 'PHILLIES' },
  { id: 'mlb-pit', league: 'MLB', city: 'Pittsburgh', name: 'PIRATES' },
  { id: 'mlb-sd',  league: 'MLB', city: 'San Diego', name: 'PADRES' },
  { id: 'mlb-sfg', league: 'MLB', city: 'San Francisco', name: 'GIANTS' },
  { id: 'mlb-sea', league: 'MLB', city: 'Seattle', name: 'MARINERS' },
  { id: 'mlb-stl', league: 'MLB', city: 'St. Louis', name: 'CARDINALS' },
  { id: 'mlb-tb',  league: 'MLB', city: 'Tampa Bay', name: 'RAYS' },
  { id: 'mlb-tex', league: 'MLB', city: 'Texas', name: 'RANGERS' },
  { id: 'mlb-tor', league: 'MLB', city: 'Toronto', name: 'BLUE JAYS' },
  { id: 'mlb-wsh', league: 'MLB', city: 'Washington', name: 'NATIONALS' },

  // --- NHL (32 Teams) ---
  { id: 'nhl-ana', league: 'NHL', city: 'Anaheim', name: 'DUCKS' },
  { id: 'nhl-bos', league: 'NHL', city: 'Boston', name: 'BRUINS' },
  { id: 'nhl-buf', league: 'NHL', city: 'Buffalo', name: 'SABRES' },
  { id: 'nhl-cgy', league: 'NHL', city: 'Calgary', name: 'FLAMES' },
  { id: 'nhl-car', league: 'NHL', city: 'Carolina', name: 'HURRICANES' },
  { id: 'nhl-chi', league: 'NHL', city: 'Chicago', name: 'BLACKHAWKS' },
  { id: 'nhl-col', league: 'NHL', city: 'Colorado', name: 'AVALANCHE' },
  { id: 'nhl-cbj', league: 'NHL', city: 'Columbus', name: 'BLUE JACKETS' },
  { id: 'nhl-dal', league: 'NHL', city: 'Dallas', name: 'STARS' },
  { id: 'nhl-det', league: 'NHL', city: 'Detroit', name: 'RED WINGS' },
  { id: 'nhl-edm', league: 'NHL', city: 'Edmonton', name: 'OILERS' },
  { id: 'nhl-fla', league: 'NHL', city: 'Florida', name: 'PANTHERS' },
  { id: 'nhl-lak', league: 'NHL', city: 'Los Angeles', name: 'KINGS' },
  { id: 'nhl-min', league: 'NHL', city: 'Minnesota', name: 'WILD' },
  { id: 'nhl-mtl', league: 'NHL', city: 'Montreal', name: 'CANADIENS' },
  { id: 'nhl-nsh', league: 'NHL', city: 'Nashville', name: 'PREDATORS' },
  { id: 'nhl-njd', league: 'NHL', city: 'New Jersey', name: 'DEVILS' },
  { id: 'nhl-nyi', league: 'NHL', city: 'New York', name: 'ISLANDERS' },
  { id: 'nhl-nyr', league: 'NHL', city: 'New York', name: 'RANGERS' },
  { id: 'nhl-ott', league: 'NHL', city: 'Ottawa', name: 'SENATORS' },
  { id: 'nhl-phi', league: 'NHL', city: 'Philadelphia', name: 'FLYERS' },
  { id: 'nhl-pit', league: 'NHL', city: 'Pittsburgh', name: 'PENGUINS' },
  { id: 'nhl-sj',  league: 'NHL', city: 'San Jose', name: 'SHARKS' },
  { id: 'nhl-sea', league: 'NHL', city: 'Seattle', name: 'KRAKEN' },
  { id: 'nhl-stl', league: 'NHL', city: 'St. Louis', name: 'BLUES' },
  { id: 'nhl-tb',  league: 'NHL', city: 'Tampa Bay', name: 'LIGHTNING' },
  { id: 'nhl-tor', league: 'NHL', city: 'Toronto', name: 'MAPLE LEAFS' },
  { id: 'nhl-uta', league: 'NHL', city: 'Utah', name: 'HOCKEY CLUB' },
  { id: 'nhl-van', league: 'NHL', city: 'Vancouver', name: 'CANUCKS' },
  { id: 'nhl-lv',  league: 'NHL', city: 'Vegas', name: 'GOLDEN KNIGHTS' },
  { id: 'nhl-wsh', league: 'NHL', city: 'Washington', name: 'CAPITALS' },
  { id: 'nhl-win', league: 'NHL', city: 'Winnipeg', name: 'JETS' }
];

type Props = {
  user: User | null;
  onScoreUpdate: (score: number) => void;
  onNavigate: (target: string) => void;
  onRegisterWithScore: (score: number, puzzleId: string) => void;
};

export default function TriviaGame({ user, onScoreUpdate, onRegisterWithScore }: Props) {
  // --- STATE ---
  const [foundTeamIds, setFoundTeamIds] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  const isWon = foundTeamIds.length === TEAMS.length;
  const isLost = timeLeft === 0 && !isWon;
  const isGameOver = isWon || isLost;

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (!gameStarted || isGameOver) return;
    const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [gameStarted, isGameOver]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, '0');

  // --- GAME LOGIC ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value;
    const guess = rawInput.trim().toUpperCase();
    setInputValue(rawInput);

    const matchingTeams = TEAMS.filter((team) => team.name === guess);
    const newMatches = matchingTeams.filter((team) => !foundTeamIds.includes(team.id));

    if (newMatches.length > 0) {
      const newMatchIds = newMatches.map((team) => team.id);
      const updatedFoundIds = [...foundTeamIds, ...newMatchIds];
      
      setFoundTeamIds(updatedFoundIds);
      setInputValue(''); 

      if (updatedFoundIds.length === TEAMS.length) {
        if (user) onScoreUpdate(500);
        else onRegisterWithScore(500, 'big-4-sports-trivia');
      }
    }
  };

 // --- COLUMN RENDERER (USING NATIVE CSS FLEXBOX) ---
  const renderLeagueColumn = (leagueName: string) => {
    const leagueTeams = TEAMS.filter((t) => t.league === leagueName);
    
    return (
      <div key={leagueName} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h4 style={{ textAlign: 'center', backgroundColor: '#111', color: '#fff', padding: '8px', borderRadius: '4px', margin: '0 0 8px 0', border: '1px solid #333' }}>
          {leagueName}
        </h4>
        
        {leagueTeams.map((team) => {
          const isFound = foundTeamIds.includes(team.id);
          const isMissed = isGameOver && !isFound; 
          
          let bgColor = '#1a1a1a'; 
          let borderColor = '#333';
          let textColor = '#666';

          if (isFound) {
            bgColor = '#0f5132'; 
            borderColor = '#198754';
            textColor = '#d1e7dd';
          } else if (isMissed) {
            bgColor = '#842029'; 
            borderColor = '#dc3545';
            textColor = '#f8d7da';
          }

          return (
            <div 
              key={team.id} 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                borderRadius: '4px',
                height: '24px', 
                fontSize: '11px', 
                border: `1px solid ${borderColor}`,
                backgroundColor: bgColor,
                color: textColor,
                transition: 'all 0.2s ease',
                overflow: 'hidden',
                whiteSpace: 'nowrap'
              }}
            >
              {isFound || isMissed ? `${team.city} ${team.name}` : ''}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      
      {/* HEADER SECTION */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px 0', color: 'var(--text, #fff)' }}>Big 4 Sports Teams</h2>
        <p style={{ color: 'var(--text-dim, #aaa)', fontSize: '15px', margin: '0 0 16px 0' }}>
          Can you name all {TEAMS.length} teams in the NFL, NBA, MLB, and NHL?
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', alignItems: 'center' }}>
          <h4 style={{ color: 'var(--yellow, #f5c518)', margin: 0 }}>Score: {foundTeamIds.length} / {TEAMS.length}</h4>
          <h4 style={{ color: timeLeft <= 60 ? '#ff4444' : '#fff', margin: 0 }}>
            ⏱️ {minutes}:{seconds}
          </h4>
        </div>
      </div>

      {/* INPUT SECTION */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
        {!gameStarted ? (
          <button 
            onClick={() => setGameStarted(true)} 
            style={{ backgroundColor: 'var(--yellow, #f5c518)', color: '#111', border: 'none', borderRadius: '6px', padding: '12px 40px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Play Quiz
          </button>
        ) : isGameOver ? (
          <div style={{ padding: '12px 24px', backgroundColor: isWon ? '#0f5132' : '#842029', color: '#fff', borderRadius: '6px', fontWeight: 'bold', fontSize: '18px' }}>
            {isWon ? '🎉 Perfect Score!' : '⏰ Time is up! Missed teams are in red.'}
          </div>
        ) : (
          <input
            type="text"
            placeholder="Type a team name..."
            value={inputValue}
            onChange={handleInputChange}
            autoComplete="off"
            autoFocus
            style={{ backgroundColor: '#111', color: '#fff', border: '2px solid var(--yellow, #f5c518)', borderRadius: '6px', padding: '12px 20px', fontSize: '18px', textAlign: 'center', width: '100%', maxWidth: '400px', outline: 'none' }}
          />
        )}
      </div>

      {/* GAME BOARD - FORCED 4-COLUMN CSS GRID */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '16px',
        width: '100%'
      }}>
        {renderLeagueColumn('NFL')}
        {renderLeagueColumn('NBA')}
        {renderLeagueColumn('MLB')}
        {renderLeagueColumn('NHL')}
      </div>
      
    </main>
  );
}