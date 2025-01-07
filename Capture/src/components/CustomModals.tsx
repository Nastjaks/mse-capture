import React from "react";
import { IonContent, IonModal } from "@ionic/react";

interface CustomModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onClose, children }) => {
    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
            <IonContent>{children}</IonContent>
        </IonModal>
    );
};

export default CustomModal;