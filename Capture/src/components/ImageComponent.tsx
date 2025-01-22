import React, {useState} from "react";
import {Image} from "../models/Image";
import {IonIcon, IonModal} from "@ionic/react";
import {arrowBackSharp, downloadOutline, trash} from "ionicons/icons";
import {useSwipeable} from "react-swipeable";
import {deleteImageFromGallery, downloadPublicFile, getImageFromUrl} from "../services/galleryService";
import {useAuth} from "../contexts/AuthContext";
import {useToast} from "../contexts/ToastContext";

interface ImageComponentProps {
    images: Image[];
    galleryOwnerId: string;
    onImageDelete: () => void;
}
/* Ausgabe der Bilder mit Lightbox*/
const ImageComponent: React.FC<ImageComponentProps> = ({images, galleryOwnerId, onImageDelete}) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const {currentUser} = useAuth();
    const {showToast} = useToast();

    // ----- Download eines Bildes
    const downloadGalleryImagesFromURL = async (url: string) => {
        console.log('URL:', url);
        const cutUrl = url.split('/public/').slice(2).join('/');
        const result = `public/${cutUrl}`;
        console.log('Download URL:', result);
        await downloadPublicFile(result);
    };

    // ----- Bild Löschen
    const handleDeleteImage = async (imageToDelete: Image) => {
        const image = await getImageFromUrl(imageToDelete.image_url);
        try {
            if ((currentUser.id == galleryOwnerId) || (imageToDelete.owner_id == galleryOwnerId) && image) {
                await deleteImageFromGallery(imageToDelete.id, imageToDelete.image_url);
                closeModal();

                onImageDelete();

                showToast('Image deleted.');
            } else {
                console.error('You are not allowed to delete this image');
            }
        } catch (error) {
            console.error('Error deleting the image', error);
            showToast('Error deleting the image');
        }
    };

    const showNextImage = () => {
        if (images.length > 0) {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }
    };

    const showPreviousImage = () => {
        if (images.length > 0) {
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
        }
    };

    const handlers = useSwipeable({
        onSwipedLeft: showNextImage,
        onSwipedRight: showPreviousImage,
        trackMouse: true,
    });

    return (
        <>
            {/* Image Ausgabe */}
            <div>
                {images.length > 0 ? (
                    <div className="galerie-img-wrapper">

                        {images.map((image, index) => (
                            <img
                                key={index}
                                src={image.image_url}
                                alt={`Bild ${index}`}
                                onClick={() => {
                                    setCurrentImageIndex(index);
                                    openModal();
                                }}
                                style={{cursor: 'pointer'}}
                            />
                        ))}
                    </div>

                ) : (
                    <div className="ion-padding no-content">
                        <p>No pictures.</p>
                    </div>
                )}
            </div>

            {/* Image Lightbox */}
            <IonModal isOpen={isModalOpen} onDidDismiss={() => closeModal()}>
                <div className="modal-content galerie-lightbox">

                    {/* Optionen */}
                    <div className="lightbox-header">
                        <IonIcon onClick={closeModal} aria-hidden="true" icon={arrowBackSharp}/>
                        <span>
                            <IonIcon
                                aria-hidden="true"
                                icon={downloadOutline}
                                onClick={() => {
                                    const currentImage = images[currentImageIndex];
                                    if (currentImage) {
                                        downloadGalleryImagesFromURL(currentImage.image_url);
                                    }
                                }}
                            />

                            {(images[currentImageIndex]?.owner_id === currentUser.id || currentUser.id === galleryOwnerId) && (
                                <IonIcon
                                    aria-hidden="true"
                                    icon={trash}
                                    onClick={() => {
                                        const currentImage = images[currentImageIndex];
                                        if (currentImage) {
                                            handleDeleteImage(currentImage);
                                        }
                                    }}
                                />
                            )}
                        </span>
                    </div>

                    {/* Bildanzeige */}
                    {images[currentImageIndex] && (
                        <div className="image-container-wrapper">
                            <div className="image-container" {...handlers}>
                                <img
                                    src={images[currentImageIndex].image_url}
                                    alt={`Bild ${currentImageIndex}`}
                                    style={{width: "100%", maxHeight: "80vh", objectFit: "cover"}}
                                />
                            </div>

                            {/* Infos */}
                            <div className="lightbox-footer">
                                <p>By XYZ</p>
                                {images[currentImageIndex]?.tasks && (
                                    <p>Task: {images[currentImageIndex].tasks.task}</p>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </IonModal>
        </>
    );
};

export default ImageComponent;
