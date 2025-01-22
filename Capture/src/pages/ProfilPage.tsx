import {IonAlert, IonButton, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonPage, IonText, IonTitle, IonToolbar, useIonViewWillEnter} from '@ionic/react';
import {menuController} from '@ionic/core/components';
import React, {useRef, useState} from "react";
import {signOut, updateUser} from "../services/authService";
import {Link, useHistory} from "react-router-dom";
import {useToast} from "../contexts/ToastContext";
import {useAuth} from "../contexts/AuthContext";
import {addOutline, alert, alertCircle, camera, checkmark, createSharp, logOut, trash} from "ionicons/icons";
import {create} from "qrcode";

const ProfilPage: React.FC = () => {
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // Zustand für das Bestätigungsdialog
    const [newName, setNewName] = useState("");

    const {showToast} = useToast();
    const {checkUser, currentUser, updateCurrentUser} = useAuth();
    const history = useHistory();

    const modal = useRef<HTMLIonModalElement>(null);

    function dismiss() {
        modal.current?.dismiss();
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
        const {success, message} = await updateUser(newName);
        if (success) {
            updateCurrentUser();
        }
        showToast(message);
    }


    const restFields = () => {
        setNewName("");
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

                <div className="ion-padding">
                    <p>Settings</p>
                    <div className="profile-settings-wrapper">
                        <IonItem id='open-edit-name-dialog' button>
                            <IonIcon aria-hidden="true" icon={createSharp}/><p>Edit name</p>
                        </IonItem>
                    </div>
                </div>

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
                ref={modal}
                trigger="open-edit-name-dialog"
                onDidDismiss={restFields}>
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
                            onIonChange={(e) => setNewName(e.detail.value!)}
                        />
                    </IonItem>
                    <IonButton expand="block"
                               onClick={() => {
                                   handleUpdateUsername();
                                   restFields();
                                   dismiss();
                               }} shape="round"> Save </IonButton>
                </div>
            </IonModal>

        </IonPage>

    );
};

export default ProfilPage;
