import React, {useEffect, useState} from "react";
import {addImagesToGallery, deleteImageFromGallery, downloadPublicFile, getGalleryImages, getImageFromUrl} from "../services/galleryService";
import {IonButton, IonFab, IonFabButton, IonIcon, IonModal} from "@ionic/react";
import {add, arrowBackSharp, downloadOutline, image, trash} from "ionicons/icons";
import {useSwipeable} from "react-swipeable";
import {useToast} from "../contexts/ToastContext";
import {Gallery} from "../models/Gallery";
import {Task} from "../models/Task";
import { useAuth } from "../contexts/AuthContext";


interface ImageComponentProps {
    referenceObject: Gallery;
}

const ImageComponent: React.FC<ImageComponentProps> = ({referenceObject}) => {

    const [images, setImages] = useState<string[]>([]); // State für die Bild-URLs der Galerie
    const {showToast} = useToast();

    // Galerie-Bilder laden
    const fetchImages = async () => {
        const images = await getGalleryImages(referenceObject.id);
        if (images) {
            setImages(images.map(img => img.image_url)); // Bild-URLs extrahieren
        }
    };

    //TODO IMAGE KRAM AUSLAGERN IN EINE IMAGE KOMPONENTE - GET; ADD; LIGHTBOX; Weil brauchen wir auch für die tasks
    const handleAddImages = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = async (event: any) => {
            const files = event.target.files;

            if (files && referenceObject.owner_id && referenceObject.id) {
                const fileArray = Array.from(files); // Dateien in ein Array konvertieren
                try {
                    // Lade alle Bilder hoch
                    await Promise.all(fileArray.map(file => addImagesToGallery(referenceObject.owner_id, referenceObject.id, file as File)));
                    await fetchImages();
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
        <>
            <p>Image Component</p>

            {/* Floating Button fpr adding Images
            <IonFab slot="fixed" vertical="bottom" horizontal="end" onClick={handleAddImages}>
                <IonFabButton>
                    <IonIcon icon={add}></IonIcon>
                </IonFabButton>
            </IonFab>*/}

        </>
    );

};

export default ImageComponent;
