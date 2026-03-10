import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // check if user is already logged in from a previous session
    const token = localStorage.getItem('growflo_token');
    const username = localStorage.getItem('growflo_username');
    const userId = localStorage.getItem('growflo_userId');
    if (token && username) {
      return { token, username, userId };
    }
    return null;
  });

  const login = (userData) => {
    localStorage.setItem('growflo_token', userData.token);
    localStorage.setItem('growflo_username', userData.username);
    localStorage.setItem('growflo_userId', userData.userId);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('growflo_token');
    localStorage.removeItem('growflo_username');
    localStorage.removeItem('growflo_userId');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// custom hook so I don't have to import useContext every time
export function useAuth() {
  return useContext(AuthContext);
}
