import {IonAlert, IonContent, IonHeader, IonItem, IonMenu, IonMenuButton, IonPage, IonRefresher, IonRefresherContent, IonTitle, IonToolbar, useIonViewWillEnter} from '@ionic/react';
import {menuController} from '@ionic/core/components';
import {useState} from "react";
import {getLoggedInUserId, signOut} from "../services/authService";
import {getSharedGalleries, getUsersGalleries} from "../services/galleryService";
import GalleryListComponent from "../components/GalleryListComponent";
import {Gallery} from "../models/Gallery";
import {useHistory} from "react-router-dom";
import {useToast} from "../contexts/ToastContext";
import {useAuth} from "../contexts/AuthContext";


const ProfilPage: React.FC = () => {

    const [userName, setUserName] = useState<string | undefined>(""); // Benutzername speichern
    const [galleries, setGalleries] = useState<Gallery[]>([]); // Galerien des Benutzers
    const [sharedGalleries, setSharedGalleries] = useState<Gallery[]>([]); // Gesharte Galerien des Benutzers
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // Zustand für das Bestätigungsdialog

    const {showToast} = useToast();
    const history = useHistory();
    const {isAuthenticated,checkUser} = useAuth();

    // Benutzerdaten und Galerien laden
    useIonViewWillEnter(() => {
        console.log("PROFIL:                    " + isAuthenticated);
        fetchUserAndGalleries();
    });

    const fetchUserAndGalleries = async () => {
        try {
            const userResponse = await getLoggedInUserId();
            if (userResponse.success) {
                setUserName(userResponse.user?.user_metadata.display_name);

                const userGalleries = await getUsersGalleries(userResponse.user?.id as string);
                const userSharedGalleries = await getSharedGalleries(userResponse.user?.id as string);
                setGalleries(userGalleries);
                setSharedGalleries(userSharedGalleries);
            }
        } catch (error) {
            console.error(error);
            showToast('Error fetching galleries.');
        }
    };

    const handleRefresh = async (event: CustomEvent) => {
        await fetchUserAndGalleries();
        event.detail.complete(); // Signalisiert, dass das Refresh abgeschlossen ist
    };

    const handleLogout = async () => {
        try {
            const result = await signOut();
            if (result.success) {
                await checkUser(); // Benutzerinformationen abrufen
                await menuController.close(); // Menü schließen
                history.push(`/signin`);
            }
            showToast(result.message);
        } catch (err) {
            console.error(err);
            showToast(String(err));
        }
    };

    return (
        <>
            {/* Menü-Komponente*/}
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

            {/* Content */}
            <IonPage id="profile-content">
                <IonHeader>
                    <IonToolbar>
                        {/* Burger-Button für das Menü */}
                        <IonTitle>Profile</IonTitle>
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
                    <h1>Nutzer: {userName}</h1>
                    <h1>Deine Galerien</h1>
                    <GalleryListComponent galleries={galleries}/>
                    <h1>Deine Geteilten Galerien</h1>
                    <GalleryListComponent galleries={sharedGalleries}/>
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
