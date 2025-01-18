// AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getLoggedInUserId } from "../services/authService";

interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    currentUser: any;
    loading: boolean;
    checkUser: () => Promise<boolean>;
    updateCurrentUser: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async (): Promise<boolean> => {
        setLoading(true);
        try {
            const userResponse = await getLoggedInUserId();
            if (userResponse && userResponse.success) {
                login(userResponse);
                return true;
            } else {
                logout();
                return false;
            }
        } catch (error) {
            console.error("Fehler beim Abrufen des Benutzers:", error);
            logout();
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateCurrentUser = async () => {
        try {
            const userResponse = await getLoggedInUserId();
            if (userResponse && userResponse.success) {
                setCurrentUser(userResponse.user);
            } else {
                setCurrentUser(null);
            }
        } catch (error) {
            console.error("Fehler beim Abrufen des Benutzers:", error);
            setCurrentUser(null);
        }
    }

    const login = (userResponse: any) => {
        setIsAuthenticated(true);
        setCurrentUser(userResponse.user);
        console.log("AUTHCONTEXT: User logged in");
    };

    const logout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
        console.log("AUTHCONTEXT: User logged out");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, currentUser, loading, checkUser, updateCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
