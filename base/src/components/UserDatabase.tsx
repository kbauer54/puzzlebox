// User and more?
export type User = {
  uid: number;
  name: string;
  isBanned: boolean;
};

export type Puzzle = {
  pid: number;
  name: string;
  isArchived: boolean;
};

export type Entry = {
  eid: number;
  uid: number;
  pid: number;
  score: number;
}

// Database for users
const mockUsers: User[] = [
  { uid: 1, name: "a", isBanned: false },
  { uid: 2, name: "b", isBanned: false },
  { uid: 3, name: "c", isBanned: false },
  { uid: 4, name: "d", isBanned: false },
];

// Database for puzzles
const mockPuzzles:  Puzzle[] = [
  { pid: 1, name: "Wordle", isArchived: false },
  { pid: 2, name: "Trivia", isArchived: true },
};

// Database for user scores for different games
const mockLeaderboard: Entry[] = [
  { eid: 1, uid: 1, pid: 1, 2 },
];

   
const getNextId = (): number => {
  return mockUsers.length > 0
    ? Math.max(...mockUsers.map((u) => u.uid)) + 1
    : 1;
};

export const getLeaderboard = (): Entry[] => {
  return [...mockLeaderboard].sort((a, b) => b.score - a.score);
};

export const getTopUsers = (count: number): Entry[] => {
  return getLeaderboard().slice(0, count);
};

export const updateUserScore = (userId: number, newScore: number): void => {
  const user = mockLeaderboard.find((u) => u.uid === userId);
  if (user) {
    user.score = newScore;
  }
};

export const addUser = (name: string): void => {
  const newUser: User = {
    uid: getNextId(),
    name,
    isBanned: false,
  };

  mockUsers.push(newUser);
};
