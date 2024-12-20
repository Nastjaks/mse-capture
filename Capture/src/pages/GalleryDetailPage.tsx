import {IonButton, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import {useParams} from 'react-router-dom'; // Zum Abrufen der Galerie-ID aus der URL
import {useEffect, useState} from 'react';
import {deleteGallery, getGalleryById} from '../services/galleryService';
import {Gallery} from "../models/Gallery";
import {useHistory} from "react-router";
import {add, trash} from "ionicons/icons"; // Funktion, um die Galerie-Daten anhand der ID abzurufen
import './GalleryDetail.css';

interface GalleryDetailProps {
    galleryId: string;
}

const GalleryDetailPage: React.FC = () => {
    const {galleryId} = useParams<{ galleryId: string }>(); // Galerie-ID aus der URL extrahieren
    const [gallery, setGallery] = useState<Gallery | null>(null); // State für die Galerie
    const history = useHistory(); // History für die Navigation nach dem Löschen

    // Galerie-Daten basierend auf der ID laden
    useEffect(() => {
        const loadGallery = async () => {
            const galleryData = await getGalleryById(galleryId); // Funktion zum Abrufen der Galerie
            if (galleryData) {
                setGallery(galleryData);
            }
        };

        loadGallery(); // Galerie-Daten laden
    }, [galleryId]); // Abhängig von galleryId, damit es bei Änderung neu geladen wird

    // Funktion zum Löschen der Galerie
    const handleDeleteGallery = async () => {
        try {
            await deleteGallery(galleryId); // Galerie löschen
            // Nach dem Löschen zur Galerieübersicht weiterleiten
            history.push('/galleries');
        } catch (err) {
            console.error('Fehler beim Löschen der Galerie:', err);
        }
    };

    const handleAddImage = async () => {
        console.log("try to add a Image")
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Galerie Detail</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Galerie Detail</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonFab slot="fixed" vertical="bottom" horizontal="end" onClick={handleAddImage}>
                    <IonFabButton>
                        <IonIcon icon={add}></IonIcon>
                    </IonFabButton>
                </IonFab>

                <div className="gallery-container">
                    {gallery ? (
                        <div>
                            <div className="galerie-header">
                                <h1>{gallery.title}</h1>
                                <h2>Galerie: {gallery.id}</h2>
                                <h2>Owner: {gallery.owner_id}</h2>
                                {gallery.preview_image && (
                                    <img className="galerie-previeImg" src={gallery.preview_image}/>
                                )}
                            </div>


                            <p>{gallery.description}</p>


                            <h1>Teinehmer</h1>
                            <div> Keine Funktion</div>


                            <div>
                                <div>Gallerie</div>
                                <div>Aufgaben</div>
                            </div>

                            <div className="galerie-img-wrapper">
                                <img src="https://placehold.co/600x400"/>
                                <img src="https://placehold.co/600x400"/>
                                <img src="https://placehold.co/600x400"/>
                                <img src="https://placehold.co/600x400"/>
                                <img src="https://placehold.co/600x400"/>
                                <img src="https://placehold.co/600x400"/>
                                <img src="https://placehold.co/600x400"/>
                            </div>
                            <div onClick={handleDeleteGallery}><IonIcon color="danger" icon={trash}></IonIcon> Galerie Löschen</div>

                        </div>
                    ) : (
                        <p>Galerie nicht gefunden</p>
                    )}
                </div>


            </IonContent>
        </IonPage>
    );
};

export default GalleryDetailPage;
