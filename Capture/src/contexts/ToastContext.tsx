import React, { createContext, useState, useContext, ReactNode } from 'react';
import { IonToast } from '@ionic/react';

interface ToastContextType {
    showToast: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');

    const duration = 4000; // Default duration: 2 seconds

    const showToast = (message: string) => {
        setMessage(message);
        setShow(true);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <IonToast
                position="top"
                isOpen={show}
                message={message}
                duration={duration}
                onDidDismiss={() => setShow(false)}
            />
        </ToastContext.Provider>
    );
};
