import React, {useEffect, useState} from "react";
import {deleteImageFromGallery, downloadPublicFile, getGalleryImages, getImageFromUrl} from "../services/galleryService";
import {useAuth} from "../contexts/AuthContext";
import {IonFab, IonFabButton, IonIcon, IonModal, IonRefresher, IonRefresherContent, useIonViewWillEnter} from "@ionic/react";
import {add, arrowBackSharp, downloadOutline, trash} from "ionicons/icons";
import {useSwipeable} from "react-swipeable";
import {useToast} from "../contexts/ToastContext";
import {getTaksImages} from "../services/taskService";

interface ImageViewComponentProps {
    referenceType: "Gallery" | "Task";
    referenceId: string;
    galleryOwnerId: string;
}

const ImageViewComponent: React.FC<ImageViewComponentProps> = ({ referenceType, referenceId, galleryOwnerId}) => {

    const [images, setImages] = useState<string[]>([]); // State für die Bild-URLs der Galerie
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [isImageOwner, setIsImageOwner] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const {currentUser} = useAuth();
    const {showToast} = useToast();


    useEffect(() => {
        console.log(referenceType);
        fetchImages();
    }, [referenceId]);


    const fetchImages = async () => {
        if (referenceType === "Gallery") {
            const imagesRes = await getGalleryImages(referenceId);
            if (imagesRes) {
                console.log(imagesRes);
                setImages(imagesRes.map(img => img.image_url)); // Bild-URLs extrahieren
                //setImages(imagesRes); // ganzes Bildobjekt
            }
        } else if (referenceType === "Task") {
            const fetchedTaskImages = await getTaksImages(referenceId);
            if (fetchedTaskImages) {
                setImages(fetchedTaskImages.map(img => img.image_url)); // Bild-URLs extrahieren
            }
        }
    }

    const checkUserImageRights = async (ImageUrl: string) => {
        const image = await getImageFromUrl(ImageUrl);
        if (image && ((image[0].owner_id === currentUser.id) || (currentUser.id === galleryOwnerId))) {
            setIsImageOwner(true);
        } else {
            setIsImageOwner(false);
        }
    }

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Funktion zum Herunterladen von Bildern aus der Galerie
    const downloadGalleryImagesFromURL = async (url: string) => {
        console.log('URL:', url);
        const cutUrl = url.split('/public/').slice(2).join('/');
        const result = `public/${cutUrl}`;
        console.log('Download URL:', result);
        await downloadPublicFile(result);
    };

    // Funktion zum Löschen von Bildern aus der Galerie
    const handleDeleteImage = async (ImageUrl: string) => {
        const image = await getImageFromUrl(ImageUrl);
        try {
            if (isImageOwner && image) {
                await deleteImageFromGallery(image[0].id, ImageUrl);
                closeModal();
                await fetchImages();
                showToast('Image deleted.');
            } else {
                console.error('You are not allowed to delete this image');
            }
        } catch (error) {
            console.error('Error deleting the image', error);
            showToast('Error deleting the image');
        }
    }

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

    // Refresh Content
    const handleRefresh = async (event: CustomEvent) => {
        fetchImages()
        event.detail.complete(); // Signalisiert, dass das Refresh abgeschlossen ist
    };

    return (
        <>
            {/* Fontent Refresher */}
            <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                <IonRefresherContent
                    pullingText="Pull to refresh"
                    refreshingText="Refreshing..."
                    refreshingSpinner="circles"
                />
            </IonRefresher>

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
                                openModal();
                            }}
                            style={{cursor: 'pointer'}}
                        />
                    ))
                ) : (
                    <div className="ion-padding no-content">
                        <p>No pictures.</p>
                    </div>
                )}
            </div>


            {/* Gallerie IMgae Lightbox*/}
            <IonModal isOpen={isModalOpen} onDidDismiss={() => {
                closeModal();
                setIsImageOwner(false);
            }}>

                <div className="modal-content galerie-lightbox">
                    {/* Optionen */}
                    <div className="lightbox-header">
                        <IonIcon onClick={closeModal} aria-hidden="true" icon={arrowBackSharp}/>
                        <span>
                                <IonIcon aria-hidden="true" icon={downloadOutline} onClick={() => downloadGalleryImagesFromURL(images[currentImageIndex])}/>
                            {(isImageOwner && <IonIcon aria-hidden="true" icon={trash} onClick={() => handleDeleteImage(images[currentImageIndex])}/>)}
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
            </IonModal>
        </>
    );
};

export default ImageViewComponent;
