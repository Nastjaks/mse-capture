import {IonContent, IonHeader, IonPage, IonRefresher, IonRefresherContent, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter, useIonViewWillLeave} from '@ionic/react';
import {useState} from 'react';
import {getGalleries} from '../services/galleryService';
import {Gallery} from "../models/Gallery";
import {getLoggedInUserId} from '../services/authService';
import GalleryListComponent from "../components/GalleryListComponent";

const GalleriesPage: React.FC = () => {
    const [galleries, setGalleries] = useState<Gallery[]>([]); // Typisierung des States

    const loadGalleries = async () => {
        const data = await getGalleries();
        if (data) {
            console.log(getLoggedInUserId());
            setGalleries(data); // Galerie-Daten setzen
        }
    };

    useIonViewWillEnter(() => {
        loadGalleries();
    });

    const handleRefresh = async (event: CustomEvent) => {
        await loadGalleries(); // Galerie-Daten neu laden
        event.detail.complete(); // Signalisiert, dass das Refresh abgeschlossen ist
    };

    return (
        <IonPage>

            <IonHeader>
                <IonToolbar>
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

                <div>
                    <h1 className="pageTitle">All galleries</h1>
                    <GalleryListComponent galleries={galleries}/>
                </div>

            </IonContent>
        </IonPage>
    );
};

export default GalleriesPage;
