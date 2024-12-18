import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { useEffect, useState } from 'react';
import { getGalleries, deleteGallery } from '../services/galleryService';
import {Gallery} from "../models/Gallery";
import { getLoggedInUser } from '../services/authService';


const Tab2: React.FC = () => {
    const [galleries, setGalleries] = useState<Gallery[]>([]); // Typisierung des States

    const handleDeleteGallery = async (id: string) => {
        try {
            await deleteGallery(id);
        } catch (err) {
            console.error(err);
        }
    };


    
    
    useEffect(() => {
        const loadGalleries = async () => {
            const data = await getGalleries();
            if (data) {
                console.log(getLoggedInUser());
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
                                {gallery.preview_image && (
                                <img 
                                    src={gallery.preview_image} 
                                    alt={gallery.title} 
                                    style={{ maxWidth: '100%', height: 'auto' }} 
                                />
                                )}
                                <button onClick={() => handleDeleteGallery(gallery.id)}>Delete</button>
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
