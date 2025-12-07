import { User, UserRole } from '../types';

const STORAGE_KEY = 'myimmo_users';
const CURRENT_USER_KEY = 'myimmo_current_user';

const defaultUsers: User[] = [
  { id: 'admin-1', email: 'admin@myimmo.cm', fullName: 'Admin Test', role: 'admin', createdAt: new Date() },
  { id: 'agent-1', email: 'agent@myimmo.cm', fullName: 'Agent Test', role: 'agent', createdAt: new Date() },
  { id: 'visitor-1', email: 'visitor@myimmo.cm', fullName: 'Visitor Test', role: 'visitor', createdAt: new Date() },
];

interface StoredUser extends User {
  password?: string; // plain text for dev only
}

function readStorage(): StoredUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredUser[];
    // restore dates
    return parsed.map(u => ({ ...u, createdAt: new Date(u.createdAt) }));
  } catch (e) {
    return [];
  }
}

function writeStorage(users: StoredUser[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function seedTestUsers() {
  const existing = readStorage();
  if (existing.length === 0) {
    const seeded: StoredUser[] = defaultUsers.map((u, i) => ({
      ...u,
      id: u.id,
      password:
        u.role === 'admin'
          ? 'admin123456'
          : u.role === 'agent'
          ? 'agent123456'
          : 'visitor123456',
    }));
    writeStorage(seeded);
  }
}

export function findUserByEmail(email: string): StoredUser | undefined {
  const users = readStorage();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function registerUser(data: { fullName: string; email: string; password: string; role: UserRole; createdAt?: Date }) {
  const users = readStorage();
  const exists = users.some(u => u.email.toLowerCase() === data.email.toLowerCase());
  if (exists) {
    throw new Error('Email already registered');
  }

  const newUser: StoredUser = {
    id: 'u-' + Date.now().toString(),
    email: data.email,
    fullName: data.fullName,
    role: data.role,
    createdAt: data.createdAt || new Date(),
    password: data.password,
  };
  users.push(newUser);
  writeStorage(users);
  return newUser;
}

export function verifyCredentials(email: string, password: string) {
  const user = findUserByEmail(email);
  if (!user) return null;
  if (!user.password) return null;
  if (user.password !== password) return null;
  // return basic user data without password
  const { password: _p, ...rest } = user;
  return rest as User;
}

export function setCurrentUser(user: User) {
  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    // emit change event for same-tab listeners
    window.dispatchEvent(new CustomEvent('authChange', { detail: { user } }));
  } catch (e) {
    // ignore
  }
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as User;
    return { ...parsed, createdAt: new Date(parsed.createdAt) };
  } catch (e) {
    return null;
  }
}

export function clearCurrentUser() {
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.dispatchEvent(new CustomEvent('authChange', { detail: { user: null } }));
  } catch (e) {
    // ignore
  }
}

export default {
  seedTestUsers,
  findUserByEmail,
  registerUser,
  verifyCredentials,
  setCurrentUser,
  getCurrentUser,
  clearCurrentUser,
};
