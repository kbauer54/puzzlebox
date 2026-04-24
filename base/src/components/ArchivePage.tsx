interface ArchivePageProps {
  onNavigate: (page: string) => void;
}

const FILTERS = ['All', 'Word', 'Logic', 'Cipher', 'Visual', 'Trivia', 'Hard'];

const ARCHIVE_ENTRIES = [
  { name: 'Wordle',       type: 'Word',   difficulty: 'Easy',   rating: 4.8, popular: true,  page: 'wordle' },
  { name: 'Trivia Rush',  type: 'Trivia', difficulty: 'Medium', rating: 4.5, popular: false, page: '' },
  { name: 'Cipher Lock',  type: 'Cipher', difficulty: 'Hard',   rating: 4.6, popular: true,  page: '' },
  { name: 'Riddle Me',    type: 'Logic',  difficulty: 'Medium', rating: 4.4, popular: false, page: '' },
  { name: 'Connections',  type: 'Word',   difficulty: 'Medium', rating: 4.7, popular: true,  page: '' },
  { name: 'Anagram Blast',type: 'Word',   difficulty: 'Easy',   rating: 4.3, popular: false, page: '' },
  { name: 'Spot It',      type: 'Visual', difficulty: 'Easy',   rating: 4.2, popular: false, page: '' },
  { name: 'Logic Grid',   type: 'Logic',  difficulty: 'Hard',   rating: 4.9, popular: true,  page: '' },
];

import { useState } from 'react';

export default function ArchivePage({ onNavigate }: ArchivePageProps) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? ARCHIVE_ENTRIES
    : activeFilter === 'Hard'
      ? ARCHIVE_ENTRIES.filter(e => e.difficulty === 'Hard')
      : ARCHIVE_ENTRIES.filter(e => e.type === activeFilter);

  return (
    <main style={s.page} className="fade-up">
      <div style={{ marginBottom: 24 }}>
        <h1 style={s.pageTitle}>Puzzle Archive</h1>
        <p style={s.pageSubtitle}>{ARCHIVE_ENTRIES.length} puzzles across all categories</p>
      </div>

      {/* Filter chips */}
      <div style={s.filterRow}>
        {FILTERS.map(f => (
          <button
            key={f}
            style={{
              ...s.chip,
              background:   activeFilter === f ? 'rgba(200,168,75,0.1)' : 'var(--surface2)',
              border:       activeFilter === f ? '1px solid var(--yellow)' : '1px solid var(--border)',
              color:        activeFilter === f ? 'var(--yellow)' : 'var(--text-muted)',
            }}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={s.grid}>
        {filtered.map((entry, i) => (
          <div
            key={i}
            style={{ ...s.card, cursor: entry.page ? 'pointer' : 'default' }}
            onClick={() => entry.page && onNavigate(entry.page)}
            onMouseEnter={e => {
              if (entry.page) {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--yellow-dim)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLDivElement).style.transform = '';
            }}
          >
            <div style={s.cardHeader}>
              <div style={{ display: 'flex', gap: 6 }}>
                <span style={s.typeBadge}>{entry.type}</span>
                {entry.difficulty === 'Hard' && (
                  <span style={{ ...s.typeBadge, color: 'var(--red)', borderColor: '#3a1a1a' }}>Hard</span>
                )}
              </div>
              {entry.popular && <span style={s.popularBadge}>Popular</span>}
            </div>
            <p style={s.cardTitle}>{entry.name}</p>
            <div style={s.cardFooter}>
              <span style={s.rating}>★ {entry.rating}</span>
              {entry.page
                ? <span style={s.playLink}>Play →</span>
                : <span style={s.soonText}>Coming soon</span>
              }
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>
            No puzzles found for this filter.
          </p>
        )}
      </div>
    </main>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 860,
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 12,
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 9,
    padding: '14px 16px',
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
  cardTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: 'var(--text)',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  rating: {
    fontSize: 12,
    color: 'var(--text-dim)',
  },
  playLink: {
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--yellow)',
  },
  soonText: {
    fontSize: 11,
    color: 'var(--text-muted)',
  },
};
