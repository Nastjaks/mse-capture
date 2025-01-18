import {IonAlert, IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonModal, IonPage, IonTitle, IonToolbar, useIonViewWillEnter} from '@ionic/react';
import {menuController} from '@ionic/core/components';
import {useRef, useState} from "react";
import {signOut, updateUser} from "../services/authService";
import {useHistory} from "react-router-dom";
import {useToast} from "../contexts/ToastContext";
import {useAuth} from "../contexts/AuthContext";

const ProfilPage: React.FC = () => {
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // Zustand für das Bestätigungsdialog
    const [newName, setNewName] = useState("");

    const {showToast} = useToast();
    const {checkUser, currentUser, isAuthenticated, updateCurrentUser} = useAuth();
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
                history.push(`/signin`);
            }
            showToast(message);
        } catch (err) {
            console.error(err);
            showToast(String(err));
        }
    };

    const handleUpdateUsername = async () => {
        const { success, message } = await updateUser(newName);
        if (success) {
            updateCurrentUser();
        }
        showToast(message);
    }

    // Galerie-Daten laden, wenn die page aufgerufen wird
    useIonViewWillEnter(() => {
        console.log(currentUser, isAuthenticated);
    });


    return (

        <IonPage id="profile-content">

            <IonHeader>
                <IonToolbar>
                    <IonTitle>Profile</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen={true}>

                <div className="profile-header ion-padding">
                    <h1>name global: {currentUser.user_metadata.display_name}</h1>
                    <h1>mail global: {currentUser.email}</h1>
                    <h1>id global: {currentUser.id}</h1>
                </div>

                <div className="ion-padding">
                    <h2>Settings</h2>
                    <div className="profile-settings-wrapper">
                        <IonItem id='open-edit-name-dialog' button>
                            <p>Edit name</p>
                        </IonItem>
                    </div>
                </div>

                <div className="ion-padding">
                    <h2>Account</h2>
                    <div className="profile-settings-wrapper">
                        <IonItem button onClick={() => setShowLogoutConfirm(true)}>
                            <p>Logout</p>
                        </IonItem>
                        <IonItem button onClick={() => showToast("COMING SOON: DELETE ACCOUNT FUNCTION")}>
                            <p>Delete Account</p>
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

        <IonModal id="example-modal" ref={modal} trigger="open-edit-name-dialog">
          <div className="ion-padding form-container">
            <h1>Set Username</h1>
            <IonItem>
                <IonInput
                    placeholder="New username..."
                    label="Username"
                    labelPlacement="floating"
                    value={newName}
                    required={true}
                    type='text'
                    onIonChange={(e) => setNewName(e.detail.value!)}
                />
            </IonItem>
            <IonButton expand="block" onClick={() => { handleUpdateUsername(); dismiss(); }} shape="round"> Save </IonButton>
          </div>
        </IonModal>

        </IonPage>

    );
};

export default ProfilPage;
