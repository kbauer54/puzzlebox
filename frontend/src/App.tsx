import { useState } from 'react';
import './App.css';
import Nav from './components/Nav';
import HomePage from './components/HomePage';
import ArchivePage from './components/ArchivePage';
import LeaderboardPage from './components/LeaderboardPage';
import WordleGame from './components/WordleGame';

// ─── Types (shared across the app) ───────────────────────────────────────────
export type User = {
  uid: number;
  name: string;
  coins: number;
  isBanned: boolean;
};

type Page = 'home' | 'archive' | 'leaderboard' | 'wordle';

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]   = useState<Page>('home');
  const [user, setUser]   = useState<User | null>(null);

  const navigate = (target: string) => {
    // Only navigate to known pages
    const known: Page[] = ['home', 'archive', 'leaderboard', 'wordle'];
    if (known.includes(target as Page)) setPage(target as Page);
  };

  const handleLogin  = (u: User) => setUser(u);
  const handleLogout = () => setUser(null);

  const handleScoreUpdate = (score: number) => {
    if (!user) return;
    setUser(prev => prev ? { ...prev, coins: prev.coins + Math.floor(score / 10) } : null);
    // TODO: wire to POST /api/users/score once Spring Boot backend is ready
  };

  return (
    <>
      <Nav
        currentPage={page}
        onNavigate={navigate}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {page === 'home'        && <HomePage        onNavigate={navigate} user={user} />}
      {page === 'archive'     && <ArchivePage     onNavigate={navigate} />}
      {page === 'leaderboard' && <LeaderboardPage user={user} />}
      {page === 'wordle'      && (
        <WordleGame
          user={user}
          onScoreUpdate={handleScoreUpdate}
          onNavigate={navigate}
        />
      )}
    </>
  );
}
