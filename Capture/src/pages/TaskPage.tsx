import React, {useEffect, useState} from 'react';
import {Link, useHistory, useParams} from 'react-router-dom';
import {IonContent, IonFab, IonFabButton, IonIcon, IonModal, IonPage, IonRefresher, IonRefresherContent, IonText} from '@ionic/react';
import {getTaksImages, getTaskById, uploadImageToTask} from '../services/taskService';
import {Task} from '../models/Task'
import {add, arrowBackSharp, camera, checkmark, downloadOutline, ellipsisVerticalSharp, trash} from "ionicons/icons";
import {downloadPublicFile, getGalleryById} from "../services/galleryService";
import {Gallery} from "../models/Gallery";
import {useSwipeable} from "react-swipeable";
import {useToast} from "../contexts/ToastContext";

const TaskPage: React.FC = () => {
    const {galleryId, taskId} = useParams<{ galleryId: string; taskId: string }>();
    const [task, setTask] = useState<Task | null>(null);
    const [gallery, setGallery] = useState<Gallery | null>(null);
    const [taskImages, setTaskImages] = useState<string[]>([]); // State für die Bild-URLs der Galerie

    const {showToast} = useToast();

    const history = useHistory(); // Für die Navigation zur Galerie

    useEffect(() => {
        fetchGallery();
        fetchTask();
        fetchTaskImages();
    }, [taskId, galleryId]);

    // Refresh Content
    const handleRefresh = async (event: CustomEvent) => {
        await fetchGallery();
        await fetchTask();
        await fetchTaskImages();
        event.detail.complete(); // Signalisiert, dass das Refresh abgeschlossen ist
    };

    const fetchGallery = async () => {
        if (galleryId) {
            const fetchedGallery = await getGalleryById(galleryId);
            setGallery(fetchedGallery);
        }
    };

    const fetchTask = async () => {
        if (taskId) {
            const fetchedTask = await getTaskById(taskId);
            setTask(fetchedTask);
        }
    };

    const fetchTaskImages = async () => {
        if (taskId) {
            const fetchedTaskImages = await getTaksImages(taskId);
            if (fetchedTaskImages) {
                setTaskImages(fetchedTaskImages.map(img => img.image_url)); // Bild-URLs extrahieren
            }
        }
    };

    const handleUploadImages = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = false;

        input.onchange = async (event: any) => {
            const files = event.target.files;

            if (files && gallery?.owner_id && galleryId) {
                const fileArray = Array.from(files); // Dateien in ein Array konvertieren
                try {
                    // Bild hochladen TODO - ist kein Array
                    await Promise.all(fileArray.map(file => uploadImageToTask(gallery.owner_id, gallery.id, file as File, taskId)));
                    await fetchTaskImages();
                } catch (error) {
                    console.error('Error uploading the images', error);
                }
            } else {
                console.error('Missing gallery or owner ID');
            }
        };
        input.click();
    };

    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [modalContent, setModalContent] = useState<"image" | null>(null);

    const openModal = (type: "image") => setModalContent(type);
    const closeModal = () => setModalContent(null);
    const isModalOpen = modalContent !== null;

    const showNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex < taskImages.length - 1 ? prevIndex + 1 : 0
        );
    };

    const showPreviousImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : taskImages.length - 1
        );
    };

    const handlers = useSwipeable({
        onSwipedLeft: showNextImage,
        onSwipedRight: showPreviousImage,
        trackMouse: true,
    });

    // Funktion zum Herunterladen von Bildern aus der Galerie
    const downloadGalleryImagesFromURL = async (url: string) => {
        console.log('URL:', url);
        const cutUrl = url.split('/public/').slice(2).join('/');
        const result = `public/${cutUrl}`;
        console.log('Download URL:', result);
        await downloadPublicFile(result);
    };

    const handleDeleteImage = (ImageID: String) => {
        showToast("NO DELETE FUNCTION: " + ImageID);
    }

    return (
        <IonPage>
            <IonContent fullscreen>

                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent
                        pullingText="Pull to refresh"
                        refreshingText="Refreshing..."
                        refreshingSpinner="circles"
                    />
                </IonRefresher>

                <IonFab slot="fixed" vertical="bottom" horizontal="end" onClick={handleUploadImages}>
                    <IonFabButton>
                        <IonIcon icon={add}></IonIcon>
                    </IonFabButton>
                </IonFab>


                {/* Gallery Images
                <ImageComponent referenceObject={task as Task} referenceType={"task"}/>*/}

                {gallery ?(
                    <div className="galerie-header">

                        {/* Optionen */}
                        <div className="taskTopBar">
                            <IonIcon onClick={() => history.push(`/gallery/${galleryId}`)} aria-hidden="true" icon={arrowBackSharp}/>
                        </div>

                        <p>Owner: {gallery?.owner_id}</p>
                        <h1>{gallery?.title}</h1>
                        <p>{gallery?.description}</p>
                        {gallery?.preview_image && (
                            <img className="galerie-previeImg" src={gallery.preview_image}/>
                        )}
                    </div>
                ) : (
                    <p>Gallery task...</p>
                )}


                {task ? (
                    <div>

                        <div className="ion-padding">
                            <IonText  color="primary">Task</IonText>
                            <h2>{task.task}</h2>
                        </div>

                        <div className="galerie-img-wrapper">
                            {taskImages.length > 0 ? (
                                taskImages.map((imageUrl, index) => (
                                    <img
                                        key={index}
                                        src={imageUrl}
                                        alt={`Bild ${index}`}
                                        onClick={() => {
                                            setCurrentImageIndex(index);
                                            openModal("image")
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
                    </div>
                ) : (
                    <p>Loading task...</p>
                )}


                {/* Gallerie IMgae Lightbox*/}
                <IonModal isOpen={isModalOpen} onDidDismiss={closeModal}>
                    {modalContent === "image" && (
                        <div className="modal-content galerie-lightbox">

                            {/* Optionen */}
                            <div className="lightbox-header">
                                <IonIcon onClick={closeModal} aria-hidden="true" icon={arrowBackSharp}/>
                                <span>
                                    <IonIcon aria-hidden="true" icon={downloadOutline} onClick={() => downloadGalleryImagesFromURL(taskImages[currentImageIndex])}/>
                                    <IonIcon aria-hidden="true" icon={trash} onClick={() => handleDeleteImage("23")}/>
                                </span>
                            </div>

                            {/* Bildanzeige */}
                            <div className="image-container" {...handlers}>
                                <img
                                    src={taskImages[currentImageIndex]}
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
            </IonContent>
        </IonPage>
    );
};

export default TaskPage;
