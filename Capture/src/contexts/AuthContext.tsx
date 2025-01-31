import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getLoggedInUser } from "../services/authService";

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

// AuthProvider component to wrap the entire application and provide user authentication state
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        checkUser();
    }, []);

    // Check if a user is logged in
    const checkUser = async (): Promise<boolean> => {
        setLoading(true);
        try {
            const userResponse = await getLoggedInUser();
            if (userResponse && userResponse.success) {
                login(userResponse);
                return true;
            } else {
                logout();
                return false;
            }
        } catch (error) {
            console.error("Error getting User:", error);
            logout();
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Update the current user
    const updateCurrentUser = async () => {
        try {
            const userResponse = await getLoggedInUser();
            if (userResponse && userResponse.success) {
                setCurrentUser(userResponse.user);
            } else {
                setCurrentUser(null);
            }
        } catch (error) {
            console.error("Error getting User:", error);
            setCurrentUser(null);
        }
    }

    const login = (userResponse: any) => {
        setIsAuthenticated(true);
        setCurrentUser(userResponse.user);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
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
