"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "./types/user";
import {
  getStoredUser,
  loginWithUsername,
  logout as authLogout,
} from "./auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string) => {
    const newUser = await loginWithUsername(username);
    setUser(newUser);
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
