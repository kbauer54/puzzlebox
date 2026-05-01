import { useState } from 'react';
import { getTopUsers } from './LeaderboardDatabase';
import type { TimeFrame } from './LeaderboardDatabase';
import type { User } from '../types';

interface LeaderboardPageProps {
  user: User | null;
}

type GameFilter = 'wordle' | 'connections' | 'trivia';

const GAME_FILTERS: { key: GameFilter; label: string }[] = [
  { key: 'wordle',      label: 'Wordle'      },
  { key: 'connections', label: 'Connections' },
  { key: 'trivia',      label: 'Trivia'      },
];

const TIME_FILTERS: { key: TimeFrame; label: string }[] = [
  { key: 'alltime', label: 'All Time'  },
  { key: 'week',    label: 'This Week' },
  { key: 'today',   label: 'Today'     },
];

const RANK_MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function LeaderboardPage({ user }: LeaderboardPageProps) {
  const [game, setGame]         = useState<GameFilter>('wordle');
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('alltime');

  const rows = getTopUsers(game, timeFrame, 20);

  return (
    <main style={s.page} className="fade-up">
      <div style={{ marginBottom: 24 }}>
        <h1 style={s.pageTitle}>Leaderboard</h1>
        <div style={s.titleUnderline} />
      </div>

      {/* Game filter */}
      <div style={{ ...s.filterRow, marginBottom: 12 }}>
        {GAME_FILTERS.map(f => (
          <button key={f.key} style={chip(game === f.key)} onClick={() => setGame(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Time filter */}
      <div style={{ ...s.filterRow, marginBottom: 24 }}>
        {TIME_FILTERS.map(f => (
          <button key={f.key} style={chip(timeFrame === f.key)} onClick={() => setTimeFrame(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={s.table}>
        {/* Header */}
        <div style={s.tableHeader}>
          <div style={{ ...s.colRank,  ...s.headerText }}>#</div>
          <div style={{ ...s.colName,  ...s.headerText }}>Player</div>
          <div style={{ ...s.colScore, ...s.headerText }}>Score</div>
        </div>

        {rows.length === 0 ? (
          <div style={s.empty}>
            <p style={{ fontSize: 15, color: 'var(--text-dim)', marginBottom: 6 }}>
              No rankings yet available.
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Be the first to play and set the record!
            </p>
          </div>
        ) : (
          rows.map((row, i) => {
            const isMe   = user?.name === row.userName;
            const isTop3 = row.rank <= 3;
            const isLast = i === rows.length - 1;

            return (
              <div
                key={row.scoreId}
                style={{
                  ...s.tableRow,
                  borderBottom: isLast ? 'none' : '1px solid var(--border)',
                  background:   isMe   ? 'rgba(200,168,75,0.06)' : 'transparent',
                  borderRadius: isMe   ? 6 : 0,
                }}
              >
                <div style={{
                  ...s.colRank,
                  fontSize: 14,
                  color: isTop3 ? 'var(--yellow)' : 'var(--text-muted)',
                  fontWeight: isTop3 ? 700 : 400,
                }}>
                  {RANK_MEDALS[row.rank] ?? row.rank}
                </div>

                <div style={s.colName}>
                  <span style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: isMe ? 'var(--yellow)' : 'var(--text)',
                  }}>
                    {row.userName}
                  </span>
                  {isMe && <span style={s.youBadge}>YOU</span>}
                </div>

                <div style={{
                  ...s.colScore,
                  fontSize: 14,
                  color: 'var(--yellow)',
                  fontWeight: 700,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {row.points.toLocaleString()}
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}

// ─── Chip helper ──────────────────────────────────────────────────────────────
const chip = (active: boolean): React.CSSProperties => ({
  borderRadius: 20,
  padding: '6px 16px',
  fontSize: 12,
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
  transition: 'all 0.15s',
  background: active ? 'rgba(200,168,75,0.1)' : 'var(--surface2)',
  border:     active ? '1px solid var(--yellow)' : '1px solid var(--border)',
  color:      active ? 'var(--yellow)' : 'var(--text-muted)',
});

// ─── Styles ───────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 700,
    margin: '0 auto',
    padding: '40px 24px 60px',
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: 8,
  },
  titleUnderline: {
    width: 50,
    height: 2,
    background: 'var(--yellow)',
    borderRadius: 1,
  },
  filterRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  table: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '0 16px',
  },
  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid var(--border)',
  },
  headerText: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.8px',
  },
  tableRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 0',
  },
  colRank: {
    width: 36,
    flexShrink: 0,
  },
  colName: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  colScore: {
    width: 100,
    textAlign: 'right' as const,
  },
  youBadge: {
    fontSize: 9,
    fontWeight: 700,
    color: 'var(--yellow-dim)',
    background: 'rgba(200,168,75,0.1)',
    border: '1px solid var(--yellow-dim)',
    borderRadius: 4,
    padding: '1px 5px',
    letterSpacing: '0.5px',
  },
  empty: {
    textAlign: 'center',
    padding: '40px 20px',
  },
};
