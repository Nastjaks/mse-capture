import {IonContent, IonHeader, IonPage, IonRefresher, IonRefresherContent, IonTitle, IonToolbar, useIonViewWillEnter} from '@ionic/react';
import {useState} from 'react';
import {getGalleries} from '../services/galleryService';
import {Gallery} from "../models/Gallery";
import GalleryListComponent from "../components/GalleryListComponent";

const AllGalleriesPage: React.FC = () => {
    const [galleries, setGalleries] = useState<Gallery[]>([]); // Typisierung des States

    const fetchGalleries = async () => {
        const data = await getGalleries();
        if (data) {
            setGalleries(data); // Galerie-Daten setzen
        }
    };

    useIonViewWillEnter(() => {
        fetchGalleries();
    });

    const handleRefresh = async (event: CustomEvent) => {
        await fetchGalleries(); // Galerie-Daten neu laden
        event.detail.complete(); // Signalisiert, dass das Refresh abgeschlossen ist
    };

    return (
        <IonPage>

            <IonHeader>
                <IonToolbar>
                    <IonTitle>ALL Galleries</IonTitle>
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
                    <h1>ALL</h1>
                    <GalleryListComponent galleries={galleries}/>
                </div>

            </IonContent>
        </IonPage>
    );
};

export default AllGalleriesPage;
