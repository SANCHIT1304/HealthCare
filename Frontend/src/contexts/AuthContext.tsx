import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { User, AuthContextType } from '../types';
// import { mockUsers } from '../data/mockData';
// import toast from 'react-hot-toast';

// const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// interface AuthProviderProps {
//   children: ReactNode;
// }
interface AuthContextProps {
  user: any;
  token: string;
  isAuthenticated: boolean;
  login: (user: any, token: string) => void;
  logout: () => void;
}

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string>('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check for stored user on app load
//     const storedUser = localStorage.getItem('user');
//     const storedToken = localStorage.getItem('token');
//     // const storedUser = localStorage.getItem('user');
//     if (storedUser && storedToken) {
//       setUser(JSON.parse(storedUser));
//       setToken(storedToken);
//     }
//     // if (storedUser) {
//     //   setUser(JSON.parse(storedUser));
//     // }
//     setLoading(false);
//   }, []);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string>('');
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    // setLoading(false);
  }, []);

    const login = (user: any, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  };


  // const storetokenInLS = (token: string) => {
  //   setToken(token);
  //   localStorage.setItem('token', token);
  // };

  // const login = async (email: string, password: string) => {
  //   setLoading(true);
  //   try {
  //     // Simulate API call
  //     await new Promise(resolve => setTimeout(resolve, 1000));
      
  //     const foundUser = mockUsers.find(u => u.email === email);
  //     if (!foundUser) {
  //       throw new Error('User not found');
  //     }

  //     // In a real app, you'd verify the password here
  //     setUser(foundUser);
  //     localStorage.setItem('user', JSON.stringify(foundUser));
  //     toast.success('Login successful!');
  //   } catch (error) {
  //     toast.error('Login failed. Please check your credentials.');
  //     throw error;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const register = async (userData: Partial<User> & { password: string }) => {
  //   setLoading(true);
  //   try {
  //     // Simulate API call
  //     await new Promise(resolve => setTimeout(resolve, 1000));
      
  //     const newUser: User = {
  //       id: Math.random().toString(36).substr(2, 9),
  //       email: userData.email!,
  //       firstName: userData.firstName!,
  //       lastName: userData.lastName!,
  //       role: userData.role!,
  //       phone: userData.phone,
  //       dateOfBirth: userData.dateOfBirth,
  //       createdAt: new Date().toISOString()
  //     };

  //     setUser(newUser);
  //     localStorage.setItem('user', JSON.stringify(newUser));
  //     toast.success('Registration successful!');
  //   } catch (error) {
  //     toast.error('Registration failed. Please try again.');
  //     throw error;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const logout = () => {
  //   setUser(null);
  //   localStorage.removeItem('user');
  //   // toast.success('Logged out successfully');
  // };

    const logout = () => {
    setUser(null);
    setToken('');
    localStorage.clear();
  };

  // const value: AuthContextType = {
  //   user,
  //   login,
  //   register,
  //   logout,
  //   loading
  // };

//   return (
//     <AuthContext.Provider value={{storetokenInLS}}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};