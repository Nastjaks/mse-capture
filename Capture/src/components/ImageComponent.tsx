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
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [modalContent, setModalContent] = useState<"image" | null>(null);
    const [isImageOwner, setIsImageOwner] = useState<boolean>(false);
    const isModalOpen = modalContent !== null;

    const {showToast} = useToast();
    const {currentUser} = useAuth();

    useEffect(() => {
        if (referenceObject) {
            fetchImages();
        }
    }, [referenceObject]);

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

    // Funktion zum Löschen von Bildern aus der Galerie
    const handleDeleteImage = async (ImageUrl: string) => {
        const image = await getImageFromUrl(ImageUrl);    
        try {
            if(isImageOwner && image) {
                await deleteImageFromGallery(image[0].id, ImageUrl);
                closeModal();
                await fetchImages();
                showToast('Image deleted.');
            } else{
                console.error('You are not allowed to delete this image');
            }
        } catch (error) {
            console.error('Error deleting the image', error);
            showToast('Error deleting the image');
        } 
    }

    const checkUserImageRights = async (ImageUrl: string) => {
        const image = await getImageFromUrl(ImageUrl);    
        if(image && ((image[0].owner_id === currentUser.id) || (currentUser.id === referenceObject.owner_id))) {
            setIsImageOwner(true);
        }
        else {
            setIsImageOwner(false);
        }
    }

    // Funktion zum Herunterladen von Bildern aus der Galerie
    const downloadGalleryImagesFromURL = async (url: string) => {
        console.log('URL:', url);
        const cutUrl = url.split('/public/').slice(2).join('/');
        const result = `public/${cutUrl}`;
        console.log('Download URL:', result);
        await downloadPublicFile(result);
    };

    const openModal = (type: "image") => setModalContent(type);
    const closeModal = () => setModalContent(null);


    const showNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex < images.length - 1 ? prevIndex + 1 : 0
        );
    };

    const showPreviousImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : images.length - 1
        );
    };

    const handlers = useSwipeable({
        onSwipedLeft: showNextImage,
        onSwipedRight: showPreviousImage,
        trackMouse: true,
    });

    return (
        <>
            {/* Floating Button fpr adding Images */}
            <IonFab slot="fixed" vertical="bottom" horizontal="end" onClick={handleAddImages}>
                <IonFabButton>
                    <IonIcon icon={add}></IonIcon>
                </IonFabButton>
            </IonFab>

            <p>Image Component</p>

            <div className="galerie-img-wrapper">
                {images.length > 0 ? (
                    images.map((imageUrl, index) => (
                        <img
                            key={index}
                            src={imageUrl}
                            alt={`Bild ${index}`}
                            onClick={() => {
                                setCurrentImageIndex(index);
                                checkUserImageRights(imageUrl);
                                openModal("image")
                            }}
                            style={{cursor: 'pointer'}}
                        />
                    ))
                ) : (<p>No pictures in this gallery.</p>)}
            </div>

            <IonButton onClick={handleAddImages}>Add Images</IonButton>
            {/* Gallerie IMgae Lightbox*/}
            <IonModal isOpen={isModalOpen} onDidDismiss={() => { closeModal(); setIsImageOwner(false); }}>
                {modalContent === "image" && (
                    <div className="modal-content galerie-lightbox">

                        {/* Optionen */}
                        <div className="lightbox-header">
                            <IonIcon onClick={closeModal} aria-hidden="true" icon={arrowBackSharp}/>
                            <span>
                                <IonIcon aria-hidden="true" icon={downloadOutline} onClick={() => downloadGalleryImagesFromURL(images[currentImageIndex])}/>
                                {(isImageOwner &&<IonIcon aria-hidden="true" icon={trash} onClick={() => handleDeleteImage(images[currentImageIndex])}/>)}
                            </span>
                        </div>

                        {/* Bildanzeige */}
                        <div className="image-container" {...handlers}>
                            <img
                                src={images[currentImageIndex]}
                                alt={`Bild ${currentImageIndex}`}
                                style={{width: "100%", maxHeight: "80vh", objectFit: "cover"}}
                            />
                        </div>

                        {/* Infos */}
                        <div className="lightbox-footer">
                            <p>By XYZ</p>
                            <p>Task XYZ</p>
                        </div>

                        {/* Navigation
                        <div className="navigation-arrows">
                            <IonButton onClick={showPreviousImage}>←</IonButton>
                            <IonButton onClick={showNextImage}>→</IonButton>
                        </div> */}

                    </div>
                )}
            </IonModal>
        </>
    );

};

export default ImageComponent;
