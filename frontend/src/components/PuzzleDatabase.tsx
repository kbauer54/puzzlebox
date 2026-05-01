// ─── Types (matching class diagram) ──────────────────────────────────────────

export type PuzzleType = 'Wordle' | 'Trivia' | 'Connections' | 'Cipher' | 'Riddle' | 'Anagram';

export type Puzzle = {
  id: string;
  name: string;
  puzzleType: PuzzleType;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  maxScore: number;
  avgTime: string;
  completionRate: number;
  rating: number;
  isArchived: boolean;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const puzzles: Puzzle[] = [
  {
    id: 'wordle',
    name: 'Wordle',
    puzzleType: 'Wordle',
    description: 'Guess the hidden 5-letter word in 6 tries. Letters turn green, yellow, or gray to guide you.',
    difficulty: 'Easy',
    maxScore: 600,
    avgTime: '3:45',
    completionRate: 82,
    rating: 4.8,
    isArchived: false,
  },
  {
    id: 'trivia',
    name: 'Big 4 Sports Trivia',
    puzzleType: 'Trivia',
    description: 'Can you name all 124 professional teams in the NFL, NBA, MLB, and NHL in under 10 minutes?',
    difficulty: 'Hard',
    maxScore: 500,
    avgTime: '9:45',
    completionRate: 24, 
    rating: 4.9,
    isArchived: false,
  },
  {
    id: 'connections',
    name: 'Connections',
    puzzleType: 'Connections',
    description: 'Group 16 words into 4 categories. Watch out — some words could fit multiple groups.',
    difficulty: 'Medium',
    maxScore: 700,
    avgTime: '6:10',
    completionRate: 68,
    rating: 4.7,
    isArchived: false,
  },
  {
    id: 'countdown',
    name: '1 to 10: General Knowledge',
    puzzleType: 'Trivia',
    description: 'Answer 55 questions spread across 10 categories. The catch? Category 1 has 1 answer, Category 10 has 10 answers.',
    difficulty: 'Medium',
    maxScore: 800,
    avgTime: '12:30',
    completionRate: 41,
    rating: 4.8,
    isArchived: false, // If set to false, it will show on the Home page too!
  },
  {
    id: 'cipher',
    name: 'Cipher Lock',
    puzzleType: 'Cipher',
    description: 'Decode a message encrypted with a substitution cipher. How fast can you crack it?',
    difficulty: 'Hard',
    maxScore: 900,
    avgTime: '8:20',
    completionRate: 55,
    rating: 4.6,
    isArchived: false,
  },
  {
    id: 'riddle',
    name: 'Riddle Me',
    puzzleType: 'Riddle',
    description: 'Solve a series of classic riddles. Simple at first, but they get tricky fast.',
    difficulty: 'Medium',
    maxScore: 650,
    avgTime: '4:50',
    completionRate: 71,
    rating: 4.4,
    isArchived: false,
  },
  {
    id: 'anagram',
    name: 'Anagram Blast',
    puzzleType: 'Anagram',
    description: 'Unscramble as many words as you can before the clock runs out.',
    difficulty: 'Easy',
    maxScore: 500,
    avgTime: '3:15',
    completionRate: 88,
    rating: 4.3,
    isArchived: false,
  },
];

// ─── Functions (matching class diagram methods) ───────────────────────────────

export const getAllPuzzles = (): Puzzle[] => {
  return puzzles.filter(p => !p.isArchived);
};

export const getArchivedPuzzles = (): Puzzle[] => {
  return puzzles.filter(p => p.isArchived);
};

export const getPuzzleById = (id: string): Puzzle | undefined => {
  return puzzles.find(p => p.id === id);
};

export const getPuzzlesByType = (type: PuzzleType): Puzzle[] => {
  return puzzles.filter(p => p.puzzleType === type && !p.isArchived);
};

export const archivePuzzle = (id: string): void => {
  const puzzle = puzzles.find(p => p.id === id);
  if (puzzle) puzzle.isArchived = true;
};

export const unarchivePuzzle = (id: string): void => {
  const puzzle = puzzles.find(p => p.id === id);
  if (puzzle) puzzle.isArchived = false;
};

export const addPuzzle = (puzzle: Puzzle): void => {
  puzzles.push(puzzle);
};
