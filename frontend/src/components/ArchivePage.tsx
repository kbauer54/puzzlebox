import { useState } from 'react';
import { getAllPuzzles, getArchivedPuzzles } from './PuzzleDatabase';
import type { PuzzleType } from './PuzzleDatabase';
import type { User } from '../types';

interface ArchivePageProps {
  onNavigate: (page: string) => void;
  user: User | null;
}

type FilterValue = 'All' | 'Archived' | PuzzleType | 'Hard';

const FILTERS: FilterValue[] = ['All', 'Word', 'Logic', 'Cipher', 'Trivia', 'Hard', 'Archived'];

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy:   'var(--green)',
  Medium: 'var(--yellow)',
  Hard:   'var(--red)',
};

export default function ArchivePage({ onNavigate, user }: ArchivePageProps) {
  const [activeFilter, setActiveFilter] = useState<FilterValue>('All');

  const activePuzzles  = getAllPuzzles();
  const archivedPuzzles = getArchivedPuzzles();

  const allPuzzles = activeFilter === 'Archived'
    ? archivedPuzzles
    : activePuzzles;

  const filtered = activeFilter === 'All' || activeFilter === 'Archived'
    ? allPuzzles
    : activeFilter === 'Hard'
      ? allPuzzles.filter(p => p.difficulty === 'Hard')
      : allPuzzles.filter(p => p.puzzleType === activeFilter);

  return (
    <main style={s.page} className="fade-up">
      <div style={{ marginBottom: 24 }}>
        <h1 style={s.pageTitle}>Puzzle Archive</h1>
        <p style={s.pageSubtitle}>
          {activePuzzles.length} active · {archivedPuzzles.length} archived
        </p>
      </div>

      {/* Filter chips */}
      <div style={s.filterRow}>
        {FILTERS.map(f => (
          <button
            key={f}
            style={{
              ...s.chip,
              background: activeFilter === f ? 'rgba(200,168,75,0.1)' : 'var(--surface2)',
              border:     activeFilter === f ? '1px solid var(--yellow)' : '1px solid var(--border)',
              color:      activeFilter === f ? 'var(--yellow)' : 'var(--text-muted)',
            }}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={s.grid}>
        {filtered.map(puzzle => {
          const isLive = puzzle.id === 'wordle';
          return (
            <div
              key={puzzle.id}
              style={{
                ...s.card,
                cursor:  isLive ? 'pointer' : 'default',
                opacity: puzzle.isArchived ? 0.6 : 1,
              }}
              onClick={() => isLive && onNavigate(puzzle.id)}
              onMouseEnter={e => {
                if (isLive) {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--yellow-dim)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLDivElement).style.transform = '';
              }}
            >
              {/* Card header */}
              <div style={s.cardHeader}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={s.typeBadge}>{puzzle.puzzleType}</span>
                  <span style={{
                    ...s.typeBadge,
                    color: DIFFICULTY_COLOR[puzzle.difficulty],
                    borderColor: puzzle.difficulty === 'Hard' ? '#3a1a1a' : 'var(--border)',
                  }}>
                    {puzzle.difficulty}
                  </span>
                </div>
                {puzzle.isArchived
                  ? <span style={s.archivedBadge}>Archived</span>
                  : isLive && <span style={s.popularBadge}>Live</span>
                }
              </div>

              {/* Card body */}
              <p style={s.cardTitle}>{puzzle.name}</p>
              <p style={s.cardDesc}>{puzzle.description}</p>

              {/* Card footer */}
              <div style={s.cardFooter}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <span style={s.stat}>★ {puzzle.rating}</span>
                  <span style={s.stat}>{puzzle.completionRate}% complete</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ ...s.stat, color: 'var(--yellow)', fontWeight: 600 }}>
                    {puzzle.maxScore.toLocaleString()} pts
                  </span>
                  {isLive && <span style={s.playLink}>Play →</span>}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: 48 }}>
            No puzzles found for this filter.
          </div>
        )}
      </div>
    </main>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '40px 24px 60px',
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 13,
    color: 'var(--text-dim)',
  },
  filterRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  chip: {
    borderRadius: 20,
    padding: '6px 14px',
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 14,
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '16px 18px',
    transition: 'border-color 0.15s, transform 0.15s',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeBadge: {
    fontSize: 10,
    fontWeight: 600,
    color: 'var(--text-muted)',
    border: '1px solid var(--border)',
    borderRadius: 4,
    padding: '2px 7px',
    background: 'var(--surface2)',
  },
  popularBadge: {
    fontSize: 10,
    fontWeight: 700,
    color: '#111',
    background: 'var(--yellow)',
    borderRadius: 4,
    padding: '2px 7px',
  },
  archivedBadge: {
    fontSize: 10,
    fontWeight: 600,
    color: 'var(--text-muted)',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 4,
    padding: '2px 7px',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: 'var(--text)',
  },
  cardDesc: {
    fontSize: 12,
    color: 'var(--text-dim)',
    lineHeight: 1.55,
    flex: 1,
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
    gap: 6,
  },
  stat: {
    fontSize: 11,
    color: 'var(--text-dim)',
  },
  playLink: {
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--yellow)',
  },
};
