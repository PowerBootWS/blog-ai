import { User } from '../types';

// Mock user database
const users: Record<string, User> = {
  'user@example.com': {
    id: '1',
    email: 'user@example.com',
    name: 'Demo User'
  }
};

// Mock passwords (in a real app, these would be hashed)
const passwords: Record<string, string> = {
  'user@example.com': 'password123'
};

export const login = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      const user = users[email];
      if (user && passwords[email] === password) {
        resolve(user);
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 800);
  });
};

export const register = (name: string, email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      if (users[email]) {
        reject(new Error('Email already in use'));
      } else {
        const newUser: User = {
          id: Date.now().toString(),
          email,
          name
        };
        users[email] = newUser;
        passwords[email] = password;
        resolve(newUser);
      }
    }, 800);
  });
};
