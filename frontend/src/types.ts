// src/types.ts

export type User = {
  uid: string;
  name: string;
  coins: number;
  isBanned: boolean;
  role: 'guest' | 'registered' | 'admin';
};