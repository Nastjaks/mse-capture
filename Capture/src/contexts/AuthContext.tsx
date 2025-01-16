// AuthContext.tsx
import React, {createContext, useState, useContext, useEffect, ReactNode} from 'react';
import { getLoggedInUserId } from "../services/authService";

interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    currentUser: any;
    loading: boolean; // Neuer Zustand für das Laden
    checkUser: () => Promise<boolean>;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true); // Initial auf `true`

    useEffect(() => {
        checkUser();
    }, []);

    // Benutzer & Status aus dem Service abrufen und setzen
    const checkUser = async (): Promise<boolean> => {
        setLoading(true); // Ladezustand aktivieren
        try {
            const userResponse = await getLoggedInUserId();
            if (userResponse && userResponse.success) {
                setCurrentUser(userResponse.user);
                setIsAuthenticated(true);
                return true;
            } else {
                setIsAuthenticated(false);
                setCurrentUser(null);
                return false;
            }
        } catch (error) {
            console.error("Fehler beim Abrufen des Benutzers:", error);
            setIsAuthenticated(false);
            setCurrentUser(null);
            return false;
        } finally {
            setLoading(false); // Ladezustand deaktivieren
        }
    };


    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, currentUser, loading, checkUser }}>
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
