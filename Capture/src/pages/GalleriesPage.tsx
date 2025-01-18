import {IonContent, IonHeader, IonPage, IonRefresher, IonRefresherContent, IonTitle, IonToolbar, useIonViewWillEnter} from '@ionic/react';
import {useState} from 'react';
import {getSharedGalleries, getUsersGalleries} from '../services/galleryService';
import {Gallery} from "../models/Gallery";
import GalleryListComponent from "../components/GalleryListComponent";
import {useAuth} from "../contexts/AuthContext";

const GalleriesPage: React.FC = () => {

    const [usersGalleries, setUsersGalleries] = useState<Gallery[]>([]);
    const [sharedGalleries, setSharedGalleries] = useState<Gallery[]>([]);
    const {currentUser, isAuthenticated} = useAuth();

    // Galerie-Daten abrufen und setzen
    const fetchGalleries = async () => {
         const userGalleries = await getUsersGalleries(currentUser.id);
        setUsersGalleries(userGalleries);
        const userSharedGalleries = await getSharedGalleries(currentUser.id);
        setSharedGalleries(userSharedGalleries)
    };

    // Galerie-Daten laden, wenn die page aufgerufen wird
    useIonViewWillEnter(() => {
        fetchGalleries();
    });

    // Galerie-Daten neu laden, wenn die page refreshed wird
    const handleRefresh = async (event: CustomEvent) => {
        await fetchGalleries();
        event.detail.complete();
    };

    return (
        <IonPage>

            <IonHeader>
                <IonToolbar>
                    <IonTitle>Galleries</IonTitle>
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

                <div>
                    <h1>YOURS</h1>
                    <GalleryListComponent galleries={usersGalleries}/>
                </div>

                <div>
                    <h1>SHARED</h1>
                    <GalleryListComponent galleries={sharedGalleries}/>
                </div>


            </IonContent>
        </IonPage>
    );
};

export default GalleriesPage;
