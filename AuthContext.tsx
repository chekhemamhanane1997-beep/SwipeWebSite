import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, type User } from '../services/api';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface DecodedToken {
  id: string;
  role: 'Admin' | 'Éditeur';
  tenantId: string;
  exp: number;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier le token au chargement
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    
    if (storedToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(storedToken);
        
        // Vérifier si le token n'est pas expiré
        if (decoded.exp * 1000 > Date.now()) {
          setToken(storedToken);
          setUser({
            _id: decoded.id,
            email: '', // L'email n'est pas dans le token, mais on peut le récupérer si nécessaire
            role: decoded.role,
            tenantId: decoded.tenantId
          });
        } else {
          // Token expiré
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Token invalide:', error);
        localStorage.removeItem('token');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      const newToken = response.token;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      const decoded = jwtDecode<DecodedToken>(newToken);
      setUser({
        _id: decoded.id,
        email: email,
        role: decoded.role,
        tenantId: decoded.tenantId
      });
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token && !!user,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};
