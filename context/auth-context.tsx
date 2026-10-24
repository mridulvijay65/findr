'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  department: string;
  avatar: string;
  karmaPoints: number;
  badge: string;
  role: 'student' | 'security' | 'faculty';
}

export const PRESET_USERS: AuthUser[] = [
  {
    id: 'user-aarav',
    name: 'Aarav Verma',
    email: 'aarav.v@campus.edu',
    department: 'Computer Science · Class of 2027',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=faces',
    karmaPoints: 420,
    badge: 'Quad Ambassador',
    role: 'student',
  },
  {
    id: 'user-priya',
    name: 'Priya Nair',
    email: 'priya.n@campus.edu',
    department: 'Design & Media · Class of 2026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
    karmaPoints: 310,
    badge: 'Swift Scout',
    role: 'student',
  },
  {
    id: 'user-martinez',
    name: 'Officer Martinez',
    email: 'martinez@security.campus.edu',
    department: 'Campus Security Unit Alpha',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
    karmaPoints: 1720,
    badge: 'Security Chief',
    role: 'security',
  },
];

interface AuthContextType {
  user: AuthUser;
  isAuthenticated: boolean;
  loginWithEmail: (name: string, email: string, department: string, role?: 'student' | 'security') => Promise<void>;
  switchUser: (presetUser: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(PRESET_USERS[0]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('findr_auth_user');
      if (saved) {
        setUser(JSON.parse(saved));
        setIsAuthenticated(true);
      }
    } catch {
      // Ignore localStorage error
    }
  }, []);

  const switchUser = useCallback((selectedUser: AuthUser) => {
    setUser(selectedUser);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('findr_auth_user', JSON.stringify(selectedUser));
    } catch {
      // Ignore error
    }
  }, []);

  const loginWithEmail = useCallback(async (name: string, email: string, department: string, role: 'student' | 'security' = 'student') => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, department, role }),
      });

      if (res.ok) {
        const dbUser = await res.json();
        const authUser: AuthUser = {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          department: dbUser.department,
          avatar: dbUser.avatar || PRESET_USERS[0].avatar,
          karmaPoints: dbUser.karmaPoints || 100,
          badge: dbUser.badge || 'Newcomer',
          role: role,
        };
        switchUser(authUser);
      } else {
        // Fallback local registration
        const fallbackUser: AuthUser = {
          id: `user-${Date.now()}`,
          name: name || email.split('@')[0],
          email,
          department: department || 'General Campus Studies',
          avatar: PRESET_USERS[0].avatar,
          karmaPoints: 100,
          badge: 'Verified Student',
          role: role,
        };
        switchUser(fallbackUser);
      }
    } catch {
      const fallbackUser: AuthUser = {
        id: `user-${Date.now()}`,
        name: name || email.split('@')[0],
        email,
        department: department || 'General Campus Studies',
        avatar: PRESET_USERS[0].avatar,
        karmaPoints: 100,
        badge: 'Verified Student',
        role: role,
      };
      switchUser(fallbackUser);
    }
  }, [switchUser]);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('findr_auth_user');
    } catch {
      // Ignore error
    }
    setUser(PRESET_USERS[0]);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loginWithEmail, switchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
