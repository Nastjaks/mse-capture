import {IonButton, IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import {useEffect, useState} from 'react';
import {getGalleryById} from '../services/galleryService';
import {Gallery} from "../models/Gallery";
import {useParams} from "react-router-dom";
import {useHistory} from "react-router";


const JoinGalleryPage: React.FC = () => {
    const [gallery, setGallery] = useState<Gallery | null>(null); // State für die Galerie
    const [name, setName] = useState("");
    const history = useHistory();
    const {galleryId} = useParams<{ galleryId: string }>(); // Galerie-ID aus der URL extrahieren

    // Galerie-Daten basierend auf der ID laden
    useEffect(() => {
        const fetchGallery = async () => {
            if (galleryId) {
                const result_galleryData = await getGalleryById(galleryId); // Funktion zum Abrufen der Galerie
                if (result_galleryData) {
                    setGallery(result_galleryData);
                }
            }
        };
    
        fetchGallery();
    }, [galleryId]);

    const onButtonClick = async () => {
        if (gallery) {
            history.push(`/gallery/${gallery.id}`);
        }
    }

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
                        <IonTitle size="large"></IonTitle>
                    </IonToolbar>
                </IonHeader>

                <div className="form-container">
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

                            <IonInput
                                placeholder="Ananastasia stinkt..."
                                label="Name"
                                labelPlacement="floating"
                                value={name}
                                required={true}
                                type="text"
                                onIonChange={(e) => setName(e.detail.value!)}
                            />

                            <IonButton expand="block" onClick={onButtonClick} shape="round"> Join Gallery </IonButton>
                        </div>
                    ) : (
                        <p>Ananastasia hat keine Gallerie hierfür erstellt...</p>
                    )}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default JoinGalleryPage;