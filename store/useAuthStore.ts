'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface AuthStore {
  user: User | null;
  admins: User[];
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  createGuestSession: () => void;
  addAdmin: (email: string, password: string) => boolean;
  removeAdmin: (id: string) => boolean;
  isAdmin: () => boolean;
}

const DEFAULT_ADMIN = {
  id: 'admin-1',
  email: 'amakita124@gmail.com',
  role: 'admin' as const
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      admins: [DEFAULT_ADMIN],
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        console.log('Attempting login for:', email);
        
        // Simple admin check (in real app, this would be backend validation)
        const { admins } = get();
        const isAdminUser = admins.some(admin => admin.email === email);
        
        if (isAdminUser && password === '@rsel2024') {
          const adminUser = admins.find(admin => admin.email === email)!;
          set({
            user: adminUser,
            isAuthenticated: true
          });
          console.log('Admin login successful');
          return true;
        }
        
        // For regular users, just validate email format and any password
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email) && password.length >= 4) {
          const guestUser: User = {
            id: uuidv4(),
            email,
            role: 'user',
            sessionId: uuidv4()
          };
          
          set({
            user: guestUser,
            isAuthenticated: true
          });
          console.log('User login successful');
          return true;
        }
        
        console.log('Login failed');
        return false;
      },
      
      logout: () => {
        console.log('Logging out user');
        set({
          user: null,
          isAuthenticated: false
        });
      },
      
      createGuestSession: () => {
        console.log('Creating guest session');
        const guestUser: User = {
          id: uuidv4(),
          email: 'guest@temporary.com',
          role: 'user',
          sessionId: uuidv4()
        };
        
        set({
          user: guestUser,
          isAuthenticated: true
        });
      },
      
      addAdmin: (email: string, password: string) => {
        console.log('Adding new admin:', email);
        const { admins } = get();
        
        // Check if admin already exists
        if (admins.some(admin => admin.email === email)) {
          return false;
        }
        
        const newAdmin: User = {
          id: uuidv4(),
          email,
          role: 'admin'
        };
        
        set({
          admins: [...admins, newAdmin]
        });
        
        return true;
      },
      
      removeAdmin: (id: string) => {
        console.log('Removing admin:', id);
        const { admins } = get();
        
        // Don't allow removing the default admin
        if (id === 'admin-1') {
          return false;
        }
        
        set({
          admins: admins.filter(admin => admin.id !== id)
        });
        
        return true;
      },
      
      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
      }
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        admins: state.admins,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);