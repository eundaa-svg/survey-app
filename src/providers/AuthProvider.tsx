'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  nickname: string;
  department: string;
  grade: number;
  points: number;
  createdAt: string;
  university?: string;
  phone?: string;
}

interface UsersData {
  [key: string]: {
    id: string;
    nickname: string;
    pin: string;
    department: string;
    grade: number;
    points: number;
    university?: string;
    phone?: string;
    createdAt: string;
  };
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
  login: (nickname: string, pin: string) => boolean;
  register: (nickname: string, pin: string, department: string, grade: number, university: string, phone?: string) => boolean;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;

    // localStorage에서 currentUser 읽기
    try {
      const currentUserJson = localStorage.getItem('currentUser');
      if (currentUserJson) {
        const currentUser = JSON.parse(currentUserJson);
        setUserState(currentUser);
        setIsLoggedIn(true);
      } else {
        setUserState(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Failed to load auth state:', error);
      setUserState(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
      setInitialized(true);
    }
  }, [initialized]);

  const login = (nickname: string, pin: string): boolean => {
    try {
      const usersJson = localStorage.getItem('users');
      if (!usersJson) {
        return false;
      }

      const users = JSON.parse(usersJson) as UsersData;
      const userId = Object.keys(users).find(
        (id) => users[id].nickname === nickname && users[id].pin === pin
      );

      if (!userId) {
        return false;
      }

      const userData = users[userId];
      const user: User = {
        id: userId,
        nickname: userData.nickname,
        department: userData.department,
        grade: userData.grade,
        points: userData.points,
        createdAt: userData.createdAt,
      };

      localStorage.setItem('currentUser', JSON.stringify(user));
      setUserState(user);
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = (nickname: string, pin: string, department: string, grade: number, university: string, phone?: string): boolean => {
    try {
      let users: UsersData = {};
      const usersJson = localStorage.getItem('users');
      if (usersJson) {
        users = JSON.parse(usersJson);
      }

      // 닉네임 중복 확인
      if (Object.values(users).some((u) => u.nickname === nickname)) {
        return false;
      }

      const userId = `user_${Date.now()}`;
      users[userId] = {
        id: userId,
        nickname,
        pin,
        department,
        grade,
        points: 1000,
        university,
        phone,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('users', JSON.stringify(users));

      const user: User = {
        id: userId,
        nickname,
        department,
        grade,
        points: 1000,
        university,
        phone,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('currentUser', JSON.stringify(user));
      setUserState(user);
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUserState(null);
    setIsLoggedIn(false);
  };

  const setUser = (newUser: User | null) => {
    if (newUser) {
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setUserState(newUser);
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem('currentUser');
      setUserState(null);
      setIsLoggedIn(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, isLoading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
