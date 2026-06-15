import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { dbService } from '../lib/dbService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lderas_active_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Refresh profile data from DB just in case
        dbService.getMembers().then(members => {
          const fresh = members.find(m => m.id === parsed.id);
          if (fresh) {
            setUser(fresh);
            localStorage.setItem('lderas_active_user', JSON.stringify(fresh));
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
      if (found.deactivated) {
        throw new Error('This account has been deactivated. Please contact the Lab Director. / Ce compte a été désactivé. Veuillez contacter le Directeur.');
      }
      setUser(found);
      localStorage.setItem('lderas_active_user', JSON.stringify(found));
      return found;
    }
    throw new Error('Invalid email or password. Use "password" as the password.');
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('lderas_active_user');
  }, []);

  const refreshUser = useCallback(async () => {
    if (!user) return;
    const members = await dbService.getMembers();
    const fresh = members.find(m => m.id === user.id);
    if (fresh) {
      setUser(fresh);
      localStorage.setItem('lderas_active_user', JSON.stringify(fresh));
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
