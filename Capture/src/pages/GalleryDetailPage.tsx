import {IonButton, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import {useParams} from 'react-router-dom'; // Zum Abrufen der Galerie-ID aus der URL
import {useEffect, useState} from 'react';
import {addImagesToGallery, deleteGallery, getGalleryById, getGalleryImages} from '../services/galleryService';
import {Gallery} from "../models/Gallery";
import {useHistory} from "react-router";
import {add, trash} from "ionicons/icons";
import '../theme/GalleryDetail.css';
import {useToast} from "../contexts/ToastContext";

const GalleryDetailPage: React.FC = () => {
    const {galleryId} = useParams<{ galleryId: string }>(); // Galerie-ID aus der URL extrahieren
    const [gallery, setGallery] = useState<Gallery | null>(null); // State für die Galerie
    const [galleryImages, setGalleryImages] = useState<string[]>([]); // State für die Bild-URLs der Galerie

    const history = useHistory(); // History für die Navigation nach dem Löschen
    const {showToast} = useToast();

    // Galerie-Daten basierend auf der ID laden
    useEffect(() => {
        loadGalleryInfos();
        loadGalleryImages();

    }, [galleryId]); // Abhängig von galleryId, damit es bei Änderung neu geladen wird

    // Galerie-Daten laden
    const loadGalleryInfos = async () => {
        const result_galleryData = await getGalleryById(galleryId); // Funktion zum Abrufen der Galerie
        if (result_galleryData) {
            setGallery(result_galleryData);
        }
    };

    // Galerie-Bilder laden
    const loadGalleryImages = async () => {
        const images = await getGalleryImages(galleryId);
        if (images) {
            setGalleryImages(images.map(img => img.image_url)); // Bild-URLs extrahieren
        }
    };

    // Funktion zum Löschen der Galerie
    const handleDeleteGallery = async () => {
        try {
            const result = await deleteGallery(galleryId); // Galerie löschen
            if(result.success){
                showToast(result.message);
                history.push('/galleries');
            } else {
                showToast(result.message);
            }
        } catch (err) {
            console.error('Fehler beim Löschen der Galerie:', err);
        }
    };

    const handleAddImages = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;

        input.onchange = async (event: any) => {
            const files = event.target.files;

            if (files && gallery?.owner_id && galleryId) {
                const fileArray = Array.from(files); // Dateien in ein Array konvertieren
                try {
                    // Lade alle Bilder hoch
                    const imageUrls = await Promise.all(
                        fileArray.map(file => addImagesToGallery(gallery.owner_id, gallery.id, file))
                    );

                    loadGalleryImages();

                } catch (error) {
                    console.error('Error uploading the images', error);
                    showToast('Error uploading the images');
                }
            } else {
                console.error('Missing gallery or owner ID');
                showToast('Unexpected error.');
            }
        };
        input.click();
    };



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

                <IonFab slot="fixed" vertical="bottom" horizontal="end" onClick={handleAddImages}>
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

                            <div className="galerie-img-wrapper">
                                {galleryImages.length > 0 ? (
                                    galleryImages.map((imageUrl, index) => (
                                        <img key={index} src={imageUrl} alt={`Bild ${index}`}/>
                                    ))
                                ) : (
                                    <p>No pictures in this gallery.</p>
                                )}
                            </div>

                            <IonButton size="small" onClick={handleDeleteGallery}>
                                <IonIcon slot="start" icon={trash}></IonIcon>
                                Galerie Löschen
                            </IonButton>

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
