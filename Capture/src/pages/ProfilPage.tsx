import {IonAlert, IonButton, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonPage, IonText, IonTitle, IonToolbar, useIonViewWillEnter} from '@ionic/react';
import {menuController} from '@ionic/core/components';
import React, {useRef, useState} from "react";
import {signOut, updateUserData} from "../services/authService";
import {useHistory} from "react-router-dom";
import {useToast} from "../contexts/ToastContext";
import {useAuth} from "../contexts/AuthContext";
import {alertCircle, createSharp, logOut, trash} from "ionicons/icons";

const ProfilPage: React.FC = () => {
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // Zustand für das Bestätigungsdialog
    const [newName, setNewName] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const {showToast} = useToast();
    const {checkUser, currentUser, updateCurrentUser} = useAuth();

    const usernameModal = useRef<HTMLIonModalElement>(null);
    const passwordModal = useRef<HTMLIonModalElement>(null);

    function dismiss(currentModal: HTMLIonModalElement) {
        currentModal.dismiss();
    }

    const handleLogout = async () => {
        try {
            const {success, message} = await signOut();
            if (success) {
                await checkUser(); // Benutzerinformationen abrufen/aktualisieren
                await menuController.close();
                window.location.href = `/signin`;
                //history.push(`/signin`);
            }
            showToast(message);
        } catch (err) {
            console.error(err);
            showToast(String(err));
        }
    };

    const handleUpdateUsername = async () => {
        const {success, message} = await updateUserData({ name: newName }, currentUser.id);
        if (success) {
            updateCurrentUser();
            dismiss(usernameModal.current!);
        }
        showToast(message);
    }

    const handleUpdatePassword = async () => {
        if(newPassword === confirmPassword && newPassword !== ""){ 
            const {success, message} = await updateUserData({ password: newPassword }, currentUser.id);
            if (success) {
                updateCurrentUser();
                dismiss(passwordModal.current!);
            }
            showToast(message);
        } else {
            showToast("Passwords do not match");
        }
    }


    const resetFields = () => {
        setNewName("");
        setNewPassword("");
        setConfirmPassword("");
    }


    return (

        <IonPage id="profile-content">

            <IonHeader>
                <IonToolbar>
                    <IonTitle>Profile</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen={true}>

                <div className="profile-header ion-padding">
                    <h3>{currentUser.user_metadata.display_name}</h3>
                    <p>{currentUser.email}</p>
                    <p>{currentUser.id}</p>
                </div>

                {currentUser.is_anonymous ? (
                    <div className="ion-padding">
                        <p>You are anonymous</p>
                        <div className="profile-settings-wrapper">
                            <IonItem button onClick={() => showToast("COMING SOON: COMPLETE REGISTRATION FUNCTION")}>
                                <IonIcon aria-hidden="true" icon={alertCircle}/> <p>Complete registration</p>
                            </IonItem>
                        </div>
                    </div>

                ) : null}

                {!currentUser.is_anonymous ? (<div className="ion-padding">
                    <p>Settings</p>
                    <div className="profile-settings-wrapper">
                        <IonItem id='open-edit-name-dialog' button>
                            <IonIcon aria-hidden="true" icon={createSharp}/><p>Edit name</p>
                        </IonItem>
                        <IonItem id='open-edit-password-dialog' button>
                            <IonIcon aria-hidden="true" icon={createSharp}/><p>Edit password</p>
                        </IonItem>
                    </div>
                </div>) : null}

                <div className="ion-padding">
                    <p>Account</p>
                    <div className="profile-settings-wrapper">
                        <IonItem button onClick={() => setShowLogoutConfirm(true)}>
                            <IonIcon aria-hidden="true" icon={logOut}/> <p>Logout</p>
                        </IonItem>
                        <IonItem button onClick={() => showToast("COMING SOON: DELETE ACCOUNT FUNCTION")}>
                            <IonIcon aria-hidden="true" icon={trash}/><p>Delete Account</p>
                        </IonItem>
                    </div>
                </div>
            </IonContent>

            {/* Logout-Bestätigungsdialog */}
            <IonAlert
                isOpen={showLogoutConfirm}
                onDidDismiss={() => setShowLogoutConfirm(false)}
                header={'Logout'}
                message={'Do you really want to log out?'}
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: async () => {
                            await menuController.close(); // Menü schließen
                        },
                    },
                    {
                        text: 'Log out',
                        handler: handleLogout,
                    },
                ]}
            />

            <IonModal
                className="modal-dialog"
                ref={usernameModal}
                trigger="open-edit-name-dialog"
                onDidDismiss={resetFields}>
                <div className="ion-padding form-container">
                    <p>Set new Username</p>
                    <IonItem>
                        <IonInput
                            placeholder="Username"
                            label="New username"
                            labelPlacement="floating"
                            value={newName}
                            required={true}
                            type='text'
                            onIonInput={(e) => setNewName(e.detail.value!)}
                        />
                    </IonItem>
                    <IonButton expand="block"
                               onClick={() => {
                                   handleUpdateUsername();
                                   resetFields();
                               }} shape="round"> Save </IonButton>
                </div>
            </IonModal>

            <IonModal
                className="modal-dialog"
                ref={passwordModal}
                trigger="open-edit-password-dialog"
                onDidDismiss={resetFields}>
                <div className="ion-padding form-container">
                    <p>Set new Password</p>
                    <IonItem>
                        <IonInput
                            placeholder="Password..."
                            label="Password"
                            labelPlacement="floating"
                            value={newPassword}
                            required={true}
                            type='password'
                            onIonInput={(e) => setNewPassword(e.detail.value!)}
                        />
                    </IonItem>
                    <p>Confirm new Password</p>
                    <IonItem>
                        <IonInput
                            placeholder="Password..."
                            label="Password"
                            labelPlacement="floating"
                            value={confirmPassword}
                            required={true}
                            type='password'
                            onIonInput={(e) => setConfirmPassword(e.detail.value!)}
                        />
                    </IonItem>
                    <IonButton expand="block"
                               onClick={() => {
                                   handleUpdatePassword();
                                   resetFields();
                               }} shape="round"> Save </IonButton>
                </div>
            </IonModal>
        </IonPage>

    );
};

export default ProfilPage;
