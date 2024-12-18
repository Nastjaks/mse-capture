import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { useEffect, useState } from 'react';
import { getGalleries } from '../services/galleryService';
import {Gallery} from "../models/Gallery";


const Tab2: React.FC = () => {
    const [galleries, setGalleries] = useState<Gallery[]>([]); // Typisierung des States

    useEffect(() => {
        const loadGalleries = async () => {
            const data = await getGalleries();
            if (data) {
                setGalleries(data); // Galerie-Daten setzen
            }
        };

        loadGalleries(); // Galerie-Daten laden
    }, []); // Der leere Abhängigkeits-Array sorgt dafür, dass es nur einmal geladen wird

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Tab 2</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Tab 2</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <ExploreContainer name="Tab 2 page" />

                <div>
                    {galleries.length > 0 ? (
                        galleries.map((gallery) => (
                            <div key={gallery.id}>
                                <h3>{gallery.title}</h3>
                                <p>{gallery.description}</p>
                            </div>
                        ))
                    ) : (
                        <p>Keine Galerie-Daten gefunden.</p>
                    )}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Tab2;
