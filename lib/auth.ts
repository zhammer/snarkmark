import { User } from "./types/user";

const AUTH_KEY = "snarkmark_user";

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearStoredUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
}

export async function loginWithUsername(username: string): Promise<User> {
  const response = await fetch(`/.netlify/functions/user?username=${encodeURIComponent(username)}`);

  if (!response.ok) {
    throw new Error("Failed to login");
  }

  const { data } = await response.json();
  const user: User = data;
  setStoredUser(user);
  return user;
}

export function logout(): void {
  clearStoredUser();
}
