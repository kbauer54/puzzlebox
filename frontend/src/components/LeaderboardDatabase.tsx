// ─── Types (matching class diagram) ──────────────────────────────────────────

export type Entry = {
  scoreId: number;
  userId: string;
  userName: string;
  puzzleId: string;
  points: number;
  rank: number;
  date: Date;
};

export type TimeFrame = 'alltime' | 'week' | 'today';

// ─── Real leaderboard data (sourced from team dataset) ────────────────────────

const entries: Entry[] = [
  // ── Wordle top 20 ─────────────────────────────────────────────────────────
  { scoreId: 1,  userId: 'w1',  userName: 'BlazeSeeker9983',  puzzleId: 'wordle', points: 1000000, rank: 1,  date: new Date() },
  { scoreId: 2,  userId: 'w2',  userName: 'RogueMaster7051',  puzzleId: 'wordle', points: 1000000, rank: 2,  date: new Date() },
  { scoreId: 3,  userId: 'w3',  userName: 'PixelGamer1133',   puzzleId: 'wordle', points: 1000000, rank: 3,  date: new Date() },
  { scoreId: 4,  userId: 'w4',  userName: 'BlazeWizard8620',  puzzleId: 'wordle', points: 1000000, rank: 4,  date: new Date() },
  { scoreId: 5,  userId: 'w5',  userName: 'DriftNinja5292',   puzzleId: 'wordle', points: 1000000, rank: 5,  date: new Date() },
  { scoreId: 6,  userId: 'w6',  userName: 'RogueWalker2841',  puzzleId: 'wordle', points: 995831,  rank: 6,  date: new Date() },
  { scoreId: 7,  userId: 'w7',  userName: 'DriftPlayer7778',  puzzleId: 'wordle', points: 995548,  rank: 7,  date: new Date() },
  { scoreId: 8,  userId: 'w8',  userName: 'ViperSeeker4272',  puzzleId: 'wordle', points: 992443,  rank: 8,  date: new Date() },
  { scoreId: 9,  userId: 'w9',  userName: 'FluxWizard7571',   puzzleId: 'wordle', points: 989653,  rank: 9,  date: new Date() },
  { scoreId: 10, userId: 'w10', userName: 'BlazePlayer3119',  puzzleId: 'wordle', points: 985120,  rank: 10, date: new Date() },
  { scoreId: 11, userId: 'w11', userName: 'BlazeWizard352',   puzzleId: 'wordle', points: 983847,  rank: 11, date: new Date() },
  { scoreId: 12, userId: 'w12', userName: 'ViperKnight9916',  puzzleId: 'wordle', points: 974186,  rank: 12, date: new Date() },
  { scoreId: 13, userId: 'w13', userName: 'PixelHunter2721',  puzzleId: 'wordle', points: 962362,  rank: 13, date: new Date() },
  { scoreId: 14, userId: 'w14', userName: 'NovaKnight9198',   puzzleId: 'wordle', points: 959520,  rank: 14, date: new Date() },
  { scoreId: 15, userId: 'w15', userName: 'ViperWizard5575',  puzzleId: 'wordle', points: 943271,  rank: 15, date: new Date() },
  { scoreId: 16, userId: 'w16', userName: 'LunaSeeker999',    puzzleId: 'wordle', points: 942565,  rank: 16, date: new Date() },
  { scoreId: 17, userId: 'w17', userName: 'RogueRider3185',   puzzleId: 'wordle', points: 941282,  rank: 17, date: new Date() },
  { scoreId: 18, userId: 'w18', userName: 'ZeroHunter2015',   puzzleId: 'wordle', points: 938362,  rank: 18, date: new Date() },
  { scoreId: 19, userId: 'w19', userName: 'ShadowMaster6057', puzzleId: 'wordle', points: 936956,  rank: 19, date: new Date() },
  { scoreId: 20, userId: 'w20', userName: 'LunaHunter9658',   puzzleId: 'wordle', points: 934530,  rank: 20, date: new Date() },

  // ── Connections top 20 ────────────────────────────────────────────────────
  { scoreId: 21, userId: 'c1',  userName: 'StormWalker4801',  puzzleId: 'connections', points: 1000000, rank: 1,  date: new Date() },
  { scoreId: 22, userId: 'c2',  userName: 'FluxWalker5240',   puzzleId: 'connections', points: 1000000, rank: 2,  date: new Date() },
  { scoreId: 23, userId: 'c3',  userName: 'StormNinja2644',   puzzleId: 'connections', points: 1000000, rank: 3,  date: new Date() },
  { scoreId: 24, userId: 'c4',  userName: 'ViperMaster5308',  puzzleId: 'connections', points: 1000000, rank: 4,  date: new Date() },
  { scoreId: 25, userId: 'c5',  userName: 'EchoBreaker5011',  puzzleId: 'connections', points: 1000000, rank: 5,  date: new Date() },
  { scoreId: 26, userId: 'c6',  userName: 'ViperRider2850',   puzzleId: 'connections', points: 986573,  rank: 6,  date: new Date() },
  { scoreId: 27, userId: 'c7',  userName: 'TitanSlayer5674',  puzzleId: 'connections', points: 977095,  rank: 7,  date: new Date() },
  { scoreId: 28, userId: 'c8',  userName: 'EchoPlayer223',    puzzleId: 'connections', points: 963883,  rank: 8,  date: new Date() },
  { scoreId: 29, userId: 'c9',  userName: 'FrostHunter5388',  puzzleId: 'connections', points: 963527,  rank: 9,  date: new Date() },
  { scoreId: 30, userId: 'c10', userName: 'NovaSlayer9710',   puzzleId: 'connections', points: 956699,  rank: 10, date: new Date() },
  { scoreId: 31, userId: 'c11', userName: 'LunaPlayer4400',   puzzleId: 'connections', points: 949303,  rank: 11, date: new Date() },
  { scoreId: 32, userId: 'c12', userName: 'NovaWizard7961',   puzzleId: 'connections', points: 947877,  rank: 12, date: new Date() },
  { scoreId: 33, userId: 'c13', userName: 'FrostKnight1349',  puzzleId: 'connections', points: 947295,  rank: 13, date: new Date() },
  { scoreId: 34, userId: 'c14', userName: 'ZeroPlayer1331',   puzzleId: 'connections', points: 945891,  rank: 14, date: new Date() },
  { scoreId: 35, userId: 'c15', userName: 'StormGamer3027',   puzzleId: 'connections', points: 945096,  rank: 15, date: new Date() },
  { scoreId: 36, userId: 'c16', userName: 'PixelMaster8347',  puzzleId: 'connections', points: 944834,  rank: 16, date: new Date() },
  { scoreId: 37, userId: 'c17', userName: 'BlazeBreaker7879', puzzleId: 'connections', points: 937376,  rank: 17, date: new Date() },
  { scoreId: 38, userId: 'c18', userName: 'ZeroRider8950',    puzzleId: 'connections', points: 936308,  rank: 18, date: new Date() },
  { scoreId: 39, userId: 'c19', userName: 'EchoMaster8244',   puzzleId: 'connections', points: 932607,  rank: 19, date: new Date() },
  { scoreId: 40, userId: 'c20', userName: 'EchoNinja2433',    puzzleId: 'connections', points: 932446,  rank: 20, date: new Date() },

  // ── Trivia top 20 ─────────────────────────────────────────────────────────
  { scoreId: 41, userId: 't1',  userName: 'BlazeKnight3835',  puzzleId: 'trivia', points: 1000000, rank: 1,  date: new Date() },
  { scoreId: 42, userId: 't2',  userName: 'OrionGamer7497',   puzzleId: 'trivia', points: 1000000, rank: 2,  date: new Date() },
  { scoreId: 43, userId: 't3',  userName: 'FluxWalker3939',   puzzleId: 'trivia', points: 1000000, rank: 3,  date: new Date() },
  { scoreId: 44, userId: 't4',  userName: 'LunaWizard8617',   puzzleId: 'trivia', points: 994857,  rank: 4,  date: new Date() },
  { scoreId: 45, userId: 't5',  userName: 'ZeroSeeker7691',   puzzleId: 'trivia', points: 987309,  rank: 5,  date: new Date() },
  { scoreId: 46, userId: 't6',  userName: 'PixelRider5610',   puzzleId: 'trivia', points: 985770,  rank: 6,  date: new Date() },
  { scoreId: 47, userId: 't7',  userName: 'OrionMaster2329',  puzzleId: 'trivia', points: 985486,  rank: 7,  date: new Date() },
  { scoreId: 48, userId: 't8',  userName: 'StormGamer5931',   puzzleId: 'trivia', points: 979604,  rank: 8,  date: new Date() },
  { scoreId: 49, userId: 't9',  userName: 'OrionNinja3635',   puzzleId: 'trivia', points: 978035,  rank: 9,  date: new Date() },
  { scoreId: 50, userId: 't10', userName: 'ShadowNinja7251',  puzzleId: 'trivia', points: 969111,  rank: 10, date: new Date() },
  { scoreId: 51, userId: 't11', userName: 'PixelPlayer3520',  puzzleId: 'trivia', points: 968916,  rank: 11, date: new Date() },
  { scoreId: 52, userId: 't12', userName: 'NovaNinja9437',    puzzleId: 'trivia', points: 960513,  rank: 12, date: new Date() },
  { scoreId: 53, userId: 't13', userName: 'FrostSlayer2732',  puzzleId: 'trivia', points: 959545,  rank: 13, date: new Date() },
  { scoreId: 54, userId: 't14', userName: 'PixelPlayer2756',  puzzleId: 'trivia', points: 955152,  rank: 14, date: new Date() },
  { scoreId: 55, userId: 't15', userName: 'DriftRider4654',   puzzleId: 'trivia', points: 952241,  rank: 15, date: new Date() },
  { scoreId: 56, userId: 't16', userName: 'StormHunter8378',  puzzleId: 'trivia', points: 952151,  rank: 16, date: new Date() },
  { scoreId: 57, userId: 't17', userName: 'ShadowMaster4688', puzzleId: 'trivia', points: 949403,  rank: 17, date: new Date() },
  { scoreId: 58, userId: 't18', userName: 'FrostKnight8267',  puzzleId: 'trivia', points: 941109,  rank: 18, date: new Date() },
  { scoreId: 59, userId: 't19', userName: 'PixelPlayer1706',  puzzleId: 'trivia', points: 940332,  rank: 19, date: new Date() },
  { scoreId: 60, userId: 't20', userName: 'FrostWalker8675',  puzzleId: 'trivia', points: 940180,  rank: 20, date: new Date() },
];

let nextScoreId = entries.length + 1;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const recalculateRanks = (puzzleEntries: Entry[]): void => {
  puzzleEntries
    .sort((a, b) => b.points - a.points)
    .forEach((e, i) => { e.rank = i + 1; });
};

const isToday = (date: Date): boolean => {
  const d = new Date();
  return date.getFullYear() === d.getFullYear() &&
         date.getMonth()    === d.getMonth()    &&
         date.getDate()     === d.getDate();
};

const isThisWeek = (date: Date): boolean => {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return date >= weekAgo;
};

// ─── Functions (matching class diagram) ───────────────────────────────────────

export const getTopUsers = (
  puzzleId: string,
  timeFrame: TimeFrame = 'alltime',
  count = 10
): Entry[] => {
  let filtered = entries.filter(e => e.puzzleId === puzzleId);

  if (timeFrame === 'today') filtered = filtered.filter(e => isToday(e.date));
  if (timeFrame === 'week')  filtered = filtered.filter(e => isThisWeek(e.date));

  return [...filtered]
    .sort((a, b) => b.points - a.points)
    .slice(0, count)
    .map((e, i) => ({ ...e, rank: i + 1 }));
};

export const getLeaderboard = (puzzleId: string): Entry[] => {
  return getTopUsers(puzzleId, 'alltime');
};

export const updateLeaderboard = (
  userId: string,
  userName: string,
  puzzleId: string,
  points: number,
): Entry => {
  const existing = entries.find(e => e.userId === userId && e.puzzleId === puzzleId);

  if (existing) {
    if (points > existing.points) {
      existing.points = points;
      existing.date   = new Date();
    }
    recalculateRanks(entries.filter(e => e.puzzleId === puzzleId));
    return existing;
  }

  const newEntry: Entry = {
    scoreId: nextScoreId++,
    userId,
    userName,
    puzzleId,
    points,
    rank: 999,
    date: new Date(),
  };

  entries.push(newEntry);
  recalculateRanks(entries.filter(e => e.puzzleId === puzzleId));
  return newEntry;
};

export const getUserRank = (userId: string, puzzleId: string): number | null => {
  const entry = entries.find(e => e.userId === userId && e.puzzleId === puzzleId);
  return entry ? entry.rank : null;
};

export const assessRank = (userId: string, puzzleId: string): Entry | null => {
  return entries.find(e => e.userId === userId && e.puzzleId === puzzleId) ?? null;
};

export const removeRank = (scoreId: number): void => {
  const idx = entries.findIndex(e => e.scoreId === scoreId);
  if (idx !== -1) entries.splice(idx, 1);
};
