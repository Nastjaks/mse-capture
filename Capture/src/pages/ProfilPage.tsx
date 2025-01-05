import {IonAlert, IonContent, IonHeader, IonItem, IonMenu, IonMenuButton, IonPage, IonRefresher, IonRefresherContent, IonTitle, IonToolbar} from '@ionic/react';
import {menuController} from '@ionic/core/components';
import {useEffect, useState} from "react";
import {getLoggedInUserId, signOut} from "../services/authService";
import {getUsersGalleries} from "../services/galleryService";
import GalleryListComponent from "../components/GalleryListComponent";
import {Gallery} from "../models/Gallery";
import {useHistory} from "react-router-dom";
import {useToast} from "../contexts/ToastContext";

const ProfilPage: React.FC = () => {
    const [user, setUser] = useState<string | undefined>(""); // Benutzer-ID speichern
    const [galleries, setGalleries] = useState<Gallery[]>([]); // Galerien des Benutzers
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // Zustand für das Bestätigungsdialog

    const history = useHistory();
    const {showToast} = useToast();

    useEffect(() => {
        const fetchUserAndGalleries = async () => {
            const result_user = await getLoggedInUserId();

            if (result_user.success) {
                setUser(result_user.userId);
                const userGalleries = await getUsersGalleries(result_user.userId); // Benutzer-ID übergeben
                setGalleries(userGalleries); // Galerien setzen
            } else {
                showToast(result_user.message);
                history.push(`/signin`);
            }
        };
        fetchUserAndGalleries();
    }, []);

    const handleRefresh = async (event: CustomEvent) => {
        console.log("RELOAD PROFILE");
        event.detail.complete(); // Signalisiert, dass das Refresh abgeschlossen ist
    };

    const handleLogout = async (route: string) => {
        try {
            const result = await signOut();
            if (result.success) {
                history.push(`/signin`);
                await menuController.close(); // Menü schließen
            }
            showToast(result.message);
        } catch (err) {
            console.error(err);
            showToast(err);
        }
        await menuController.close(); // Menü schließen
        history.push(`/signin`);
    };

    return (
        <>
            {/* Menü-Komponente */}
            <IonMenu contentId="profile-content" menuId="profile-menu" side="end">
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Settings</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonItem button={true} onClick={() => setShowLogoutConfirm(true)}>
                        <p>Logout</p>
                    </IonItem>
                </IonContent>
            </IonMenu>

            <IonPage id="profile-content">
                <IonHeader>
                    <IonToolbar>
                        {/* Burger-Button für das Menü */}
                        <IonTitle>CAPTURE</IonTitle>
                        <IonMenuButton menu="profile-menu" slot="end"/>
                    </IonToolbar>
                </IonHeader>

                <IonContent fullscreen={true} className="ion-padding">
                    <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                        <IonRefresherContent
                            pullingText="Pull to refresh"
                            refreshingText="Refreshing..."
                            refreshingSpinner="circles"
                        />
                    </IonRefresher>
                    <h1>Nutzer: {user}</h1>
                    <h1>Deine Galerien</h1>
                    <GalleryListComponent galleries={galleries}/>
                </IonContent>
            </IonPage>

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

        </>
    );
};

export default ProfilPage;
