import { useState } from 'react';
import type { User } from '../App';

interface LeaderboardPageProps {
  user: User | null;
}

const DATA = {
  alltime: [
    { rank: 1, name: 'CryptoKnight',  puzzles: 247, score: 12400 },
    { rank: 2, name: 'WordWizard_88', puzzles: 198, score: 9800  },
    { rank: 3, name: 'LogicLord',     puzzles: 183, score: 8700  },
    { rank: 4, name: 'SilentSolver',  puzzles: 142, score: 7400  },
    { rank: 5, name: 'Enigmatix',     puzzles: 118, score: 6800  },
    { rank: 6, name: 'NightOwl',      puzzles: 97,  score: 5200  },
    { rank: 7, name: 'PuzzlePro',     puzzles: 84,  score: 4600  },
  ],
  week: [
    { rank: 1, name: 'WordWizard_88', puzzles: 18, score: 940 },
    { rank: 2, name: 'Enigmatix',     puzzles: 14, score: 820 },
    { rank: 3, name: 'CipherBreaker', puzzles: 12, score: 710 },
    { rank: 4, name: 'LogicLord',     puzzles: 10, score: 650 },
    { rank: 5, name: 'NightOwl',      puzzles: 8,  score: 580 },
  ],
  today: [
    { rank: 1, name: 'Enigmatix',    puzzles: 3, score: 245 },
    { rank: 2, name: 'CryptoKnight', puzzles: 2, score: 180 },
    { rank: 3, name: 'NightOwl',     puzzles: 2, score: 140 },
  ],
};

type TabKey = 'alltime' | 'week' | 'today';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'alltime', label: 'All Time'   },
  { key: 'week',    label: 'This Week'  },
  { key: 'today',   label: 'Today'      },
];

const RANK_MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function LeaderboardPage({ user }: LeaderboardPageProps) {
  const [tab, setTab] = useState<TabKey>('alltime');
  const rows = DATA[tab];

  return (
    <main style={s.page} className="fade-up">
      <div style={{ marginBottom: 24 }}>
        <h1 style={s.pageTitle}>Leaderboard</h1>
        <div style={s.titleUnderline} />
      </div>

      {/* Tab chips */}
      <div style={s.tabRow}>
        {TABS.map(t => (
          <button
            key={t.key}
            style={{
              ...s.chip,
              background: tab === t.key ? 'rgba(200,168,75,0.1)' : 'var(--surface2)',
              border:     tab === t.key ? '1px solid var(--yellow)' : '1px solid var(--border)',
              color:      tab === t.key ? 'var(--yellow)' : 'var(--text-muted)',
            }}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={s.table}>
        {/* Header */}
        <div style={s.tableHeader}>
          <div style={{ ...s.colRank,  ...s.headerText }}>#</div>
          <div style={{ ...s.colName,  ...s.headerText }}>Player</div>
          <div style={{ ...s.colNum,   ...s.headerText }}>Puzzles</div>
          <div style={{ ...s.colScore, ...s.headerText }}>Score</div>
        </div>

        {rows.map((row, i) => {
          const isMe    = user?.name === row.name;
          const isTop3  = row.rank <= 3;
          const isLast  = i === rows.length - 1;

          return (
            <div
              key={row.rank}
              style={{
                ...s.tableRow,
                borderBottom: isLast ? 'none' : '1px solid var(--border)',
                background:   isMe   ? 'rgba(200,168,75,0.06)' : 'transparent',
                borderRadius: isMe   ? 6 : 0,
              }}
            >
              <div style={{ ...s.colRank, fontSize: 14, color: isTop3 ? 'var(--yellow)' : 'var(--text-muted)', fontWeight: isTop3 ? 700 : 400 }}>
                {RANK_MEDALS[row.rank] ?? row.rank}
              </div>
              <div style={s.colName}>
                <span style={{ fontSize: 14, fontWeight: 600, color: isMe ? 'var(--yellow)' : 'var(--text)' }}>
                  {row.name}
                </span>
                {isMe && <span style={s.youBadge}>YOU</span>}
              </div>
              <div style={{ ...s.colNum, fontSize: 13, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                {row.puzzles}
              </div>
              <div style={{ ...s.colScore, fontSize: 14, color: 'var(--yellow)', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                {row.score.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

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
  tabRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 24,
  },
  chip: {
    borderRadius: 20,
    padding: '6px 16px',
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    transition: 'all 0.15s',
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
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  },
  tableRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '13px 0',
  },
  colRank: {
    width: 30,
    flexShrink: 0,
  },
  colName: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  colNum: {
    width: 70,
    textAlign: 'right',
    paddingRight: 8,
  },
  colScore: {
    width: 80,
    textAlign: 'right',
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
};
