// createContext → creates a shared storage area.
// useContext → allows components to access that storage.
// useState → stores the current token.
import { createContext, useContext, useState } from 'react';

// defines AuthContext contents
// Authcontext is like a shared box?
interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

// create the box
const AuthContext = createContext<AuthContextType | null>(null);


// this component wraps the app when called
// takes object and children must be a valid react component
export function AuthProvider({ children }: { children: React.ReactNode }) {

  // when app starts, check browser for token
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  // login function sets new token to browser storage
  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  // logout removes token
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  // returns the app wrapped in authcontext
  // value = all children nodes can access
  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// otherwise const {token, logout} = useContext(AuthContext)
// rather than const {token, logout} = useAuth()
export function useAuth() {
  // get authcontext data
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  // return it
  return context;
}