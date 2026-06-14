import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { dbService } from '../lib/dbService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ldreas_active_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Refresh profile data from DB just in case
        dbService.getMembers().then(members => {
          const fresh = members.find(m => m.id === parsed.id);
          if (fresh) {
            setUser(fresh);
            localStorage.setItem('ldreas_active_user', JSON.stringify(fresh));
          } else {
            setUser(parsed);
          }
          setLoading(false);
        }).catch(() => {
          setUser(parsed);
          setLoading(false);
        });
      } catch (e) {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    // Check credentials against mock members
    const members = await dbService.getMembers();
    const found = members.find(m => m.email.toLowerCase() === email.toLowerCase());
    
    if (found && (password === 'password' || found.password_hash)) {
      setUser(found);
      localStorage.setItem('ldreas_active_user', JSON.stringify(found));
      return found;
    }
    throw new Error('Invalid email or password. Use "password" as the password.');
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('ldreas_active_user');
  }, []);

  const refreshUser = useCallback(async () => {
    if (!user) return;
    const members = await dbService.getMembers();
    const fresh = members.find(m => m.id === user.id);
    if (fresh) {
      setUser(fresh);
      localStorage.setItem('ldreas_active_user', JSON.stringify(fresh));
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
