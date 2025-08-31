import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    username: string;
    isAuthenticated: boolean;
    login: (username: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [username, setUsername] = useState<string>(() => {
        return sessionStorage.getItem('user') ?? '';
    });

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return sessionStorage.getItem('authenticated') === 'true';
    });

    const login = (username: string) => {
        sessionStorage.setItem('authenticated', 'true'); // persist
        sessionStorage.setItem('user', username); // persist
        setIsAuthenticated(true); // update React state
        setUsername(username); // update React state
    };

    const logout = () => {
        sessionStorage.removeItem('authenticated');
        sessionStorage.removeItem('user');
        setIsAuthenticated(false);
        setUsername('');
    };

    useEffect(() => {
        // Optionally keep state in sync with sessionStorage changes
        const handleStorageChange = () => {
            setIsAuthenticated(sessionStorage.getItem('authenticated') === 'true');
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <AuthContext.Provider value={{ username, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
