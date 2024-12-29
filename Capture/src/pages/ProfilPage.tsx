import {IonContent, IonHeader, IonItem, IonLabel, IonList, IonMenu, IonMenuButton, IonPage, IonRefresher, IonRefresherContent, IonTitle, IonToolbar} from '@ionic/react';
import {menuController} from '@ionic/core/components';
import {useEffect, useState} from "react";
import {getLoggedInUserId} from "../services/authService";
import {getUsersGalleries} from "../services/galleryService";
import GalleryListComponent from "../components/GalleryListComponent";
import {Gallery} from "../models/Gallery";
import {useHistory} from "react-router-dom";
import {useToast} from "../contexts/ToastContext";

const ProfilPage: React.FC = () => {
    const [user, setUser] = useState<string | undefined>(""); // Benutzer-ID speichern
    const [galleries, setGalleries] = useState<Gallery[]>([]); // Galerien des Benutzers

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

    const handleMenuCloseOnNavigate = async (route: string) => {
        await menuController.close(); // Menü schließen
        history.push(route); // Navigation durchführen
    };

    return (
        <>
            {/* Menü-Komponente */}
            <IonMenu contentId="main-content" side="end">
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Settings</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <p onClick={() => handleMenuCloseOnNavigate("/logout")}>Logout</p>
                </IonContent>
            </IonMenu>

            <IonPage id="main-content">
            <IonHeader>
                    <IonToolbar>
                        {/* Burger-Button für das Menü */}
                        <IonMenuButton slot="end"/>
                        <IonTitle>CAPTURE</IonTitle>
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
        </>
    );
};

export default ProfilPage;
