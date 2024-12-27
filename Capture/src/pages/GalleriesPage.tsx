import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import {useEffect, useState} from 'react';
import {getGalleries} from '../services/galleryService';
import {Gallery} from "../models/Gallery";
import {getLoggedInUserId} from '../services/authService';
import GalleryListComponent from "../components/GalleryListComponent";


const GalleriesPage: React.FC = () => {
    const [galleries, setGalleries] = useState<Gallery[]>([]); // Typisierung des States


    useEffect(() => {
        const loadGalleries = async () => {
            const data = await getGalleries();
            if (data) {
                console.log(getLoggedInUserId());
                setGalleries(data); // Galerie-Daten setzen
            }
        };

        loadGalleries(); // Galerie-Daten laden
    }, []); // Der leere Abhängigkeits-Array sorgt dafür, dass es nur einmal geladen wird

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>CAPTURE</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">CAPTURE</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <div>
                    <h1>Alle Galerien</h1>
                    <GalleryListComponent galleries={galleries}/>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default GalleriesPage;
