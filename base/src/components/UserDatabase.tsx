// User
export type User = {
  uid: number;
  name: string;
  score: number;
  isBanned: boolean;
};

// Mock database for users
const mockUsers: User[] = [
  { uid: 1, name: "Alice", score: 1200, isBanned: false },
  { uid: 2, name: "Bob", score: 950, isBanned: false },
  { uid: 3, name: "Charlie", score: 1500, isBanned: false },
  { uid: 4, name: "Diana", score: 1100, isBanned: false },
];

const getNextId = (): number => {
  return mockUsers.length > 0
    ? Math.max(...mockUsers.map((u) => u.uid)) + 1
    : 1;
};

export const getLeaderboard = (): User[] => {
  return [...mockUsers].sort((a, b) => b.score - a.score);
};

export const getTopUsers = (count: number): User[] => {
  return getLeaderboard().slice(0, count);
};

export const updateUserScore = (userId: number, newScore: number): void => {
  const user = mockUsers.find((u) => u.uid === userId);
  if (user) {
    user.score = newScore;
  }
};

export const addUser = (name: string, score: number = 0): void => {
  const newUser: User = {
    uid: getNextId(),
    name,
    score,
    isBanned: false,
  };

  mockUsers.push(newUser);
};
