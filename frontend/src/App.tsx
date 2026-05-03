import { useState } from 'react';
import './App.css';
import Nav from './components/Nav';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ArchivePage from './components/ArchivePage';
import LeaderboardPage from './components/LeaderboardPage';
import WordleGame from './components/WordleGame';
import TriviaGame from './components/TriviaGame';
import CountdownTrivia from './components/CountdownTrivia';
import ManagerPanel from "./components/ManagerPanel";
import { updateLeaderboard } from './components/LeaderboardDatabase';

import type { User } from './types';

type Page = 'home' | 'archive' | 'leaderboard' | 'managerpanel' | 'wordle' | 'trivia' | 'countdown';
type Modal = 'signin' | 'register' | null;

export default function App() {
  const [page, setPage]             = useState<Page>('home');
  const [user, setUser]             = useState<User | null>(null);
  const [modal, setModal]           = useState<Modal>(null);

  // Score earned during the current game session — saved on register
  const [pendingScore, setPendingScore] = useState<{ score: number; puzzleId: string } | null>(null);

  const navigate = (target: string) => {
    if (target === 'register') { setModal('register'); return; }
    if (target === 'signin')   { setModal('signin');   return; }
    const known: Page[] = ['home', 'archive', 'leaderboard', 'managerpanel', 'wordle', 'trivia', 'countdown'];
    if (known.includes(target as Page)) setPage(target as Page);
  };

  const handleLogin = (u: User) => {
    setUser(u);
    setModal(null);

    // If they just registered after finishing a game, save that score now
    if (pendingScore) {
      updateLeaderboard(u.uid, u.name, pendingScore.puzzleId, pendingScore.score);
      setPendingScore(null);
    }
  };

  const handleLogout = () => setUser(null);

  // Called when a registered user finishes a game
  const handleScoreUpdate = (score: number) => {
    if (!user) return;
    const coinsEarned = Math.floor(score / 10);
    setUser(prev => prev ? { ...prev, coins: prev.coins + coinsEarned } : null);
    updateLeaderboard(user.uid, user.name, 'wordle', score);
    // TODO: POST to /api/users/score when backend is ready
  };

  // Called when a guest wants to register after finishing a game
  const handleRegisterWithScore = (score: number, puzzleId: string) => {
    setPendingScore({ score, puzzleId });
    setModal('register');
  };

  return (
    <>
      <Nav
        currentPage={page}
        onNavigate={navigate}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        activeModal={modal}
        setModal={setModal}
      />

      {page === 'home'        && <HomePage        onNavigate={navigate} user={user} />}
      {page === 'archive'     && <ArchivePage     onNavigate={navigate} user={user} />}
      {page === 'leaderboard' && <LeaderboardPage user={user} />}
      {page === "managerpanel" && <ManagerPanel user={user} />}
      {page === 'wordle'      && (
        <WordleGame
          user={user}
          onScoreUpdate={handleScoreUpdate}
          onNavigate={navigate}
          onRegisterWithScore={handleRegisterWithScore}
        />
      )}
      {page === 'trivia'      && (
        <TriviaGame
          user={user}
          onScoreUpdate={handleScoreUpdate}
          onNavigate={navigate}
          onRegisterWithScore={handleRegisterWithScore}
        />
      )}

      {page === 'countdown' && (
        <CountdownTrivia
          user={user}
          onScoreUpdate={handleScoreUpdate}
          onNavigate={navigate}
          onRegisterWithScore={handleRegisterWithScore}
        />
      )}

      {modal === 'signin' && (
        <LoginPage 
          onLogin={handleLogin} 
          onClose={() => setModal(null)} 
          onSwitchToRegister={() => setModal('register')} 
        />
      )}
      
      {modal === 'register' && (
        <RegisterPage 
          onLogin={handleLogin} 
          onClose={() => setModal(null)} 
          onSwitchToLogin={() => setModal('signin')} 
        />
      )}
    </>
  );
}
