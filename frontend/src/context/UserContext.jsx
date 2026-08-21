import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUserStats } from '../services/api';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState({ username: '', xp: 0, coins: 0, streak: 0 });
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const data = await getUserStats();
      setUser(data);
    } catch (err) {
      console.warn('Could not fetch user stats:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on app load
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Update user stats directly (e.g. after lesson completion)
  const updateUser = useCallback((newStats) => {
    setUser((prev) => ({ ...prev, ...newStats }));
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, updateUser, refetchUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
