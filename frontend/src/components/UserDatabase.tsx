// ─── Types (matching class diagram) ──────────────────────────────────────────

export type UserRole = 'guest' | 'registered' | 'admin';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  isRegistered: boolean;
  coins: number;
  isBanned: boolean;
  role: UserRole;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const users: User[] = [
  {
    id: '1',
    name: 'CryptoKnight',
    email: 'crypto@example.com',
    password: 'hashed_password',
    isRegistered: true,
    coins: 450,
    isBanned: false,
    role: 'registered',
  },
  {
    id: '2',
    name: 'WordWizard_88',
    email: 'word@example.com',
    password: 'hashed_password',
    isRegistered: true,
    coins: 320,
    isBanned: false,
    role: 'registered',
  },
  {
    id: 'admin1',
    name: 'Admin',
    email: 'admin@puzzlebox.com',
    password: 'hashed_admin_password',
    isRegistered: true,
    coins: 0,
    isBanned: false,
    role: 'admin',
  },
];

// ─── Functions (matching class diagram methods) ───────────────────────────────

const getNextId = (): string => {
  const maxId = users.reduce((max, u) => Math.max(max, parseInt(u.id) || 0), 0);
  return String(maxId + 1);
};

export const register = (name: string, email: string, password: string): User | null => {
  // Check if email already exists
  if (users.find(u => u.email === email)) return null;

  const newUser: User = {
    id: getNextId(),
    name,
    email,
    password, // TODO: hash before storing once backend is wired up
    isRegistered: true,
    coins: 200,
    isBanned: false,
    role: 'registered',
  };

  users.push(newUser);
  return newUser;
};

export const login = (email: string, password: string): User | null => {
  const user = users.find(u => u.email === email && u.password === password);
  return user ?? null;
};

export const findUserById = (id: string): User | undefined => {
  return users.find(u => u.id === id);
};

export const findUserByEmail = (email: string): User | undefined => {
  return users.find(u => u.email === email);
};

export const updateCoins = (id: string, amount: number): void => {
  const user = users.find(u => u.id === id);
  if (user) user.coins = Math.max(0, user.coins + amount);
};

export const banUser = (id: string): void => {
  const user = users.find(u => u.id === id);
  if (user) user.isBanned = true;
};

export const unbanUser = (id: string): void => {
  const user = users.find(u => u.id === id);
  if (user) user.isBanned = false;
};

export const verifyStatus = (id: string): boolean => {
  const user = users.find(u => u.id === id);
  return user ? user.isRegistered && !user.isBanned : false;
};

export const getAllUsers = (): User[] => [...users];
