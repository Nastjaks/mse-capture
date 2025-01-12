import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage, IonRefresher, IonRefresherContent, IonTitle, IonToolbar} from '@ionic/react';
import {getTaksImages, getTaskById, uploadImageToTask} from '../services/taskService';
import {Task} from '../models/Task'
import {add, arrowBackSharp} from "ionicons/icons";
import {getGalleryById} from "../services/galleryService";
import {Gallery} from "../models/Gallery";

const TaskPage: React.FC = () => {
    const {galleryId, taskId} = useParams<{ galleryId: string; taskId: string }>();
    const [task, setTask] = useState<Task | null>(null);
    const [gallery, setGallery] = useState<Gallery | null>(null);
    const [taskImages, setTaskImages] = useState<string[]>([]); // State für die Bild-URLs der Galerie
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
                    // Bild hochladen
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


                <IonIcon onClick={() => history.push(`/gallery/${galleryId}`)} aria-hidden="true" icon={arrowBackSharp}/>

                {task ? (
                    <div>
                        <h1>Gallery: {gallery?.title}</h1>
                        <p>Gallery ID: {galleryId}</p>
                        <div>
                            <h1>Task: {task.task}</h1>
                            <p>Task ID: {taskId}</p>
                        </div>

                        <div className="galerie-img-wrapper">
                            {taskImages.length > 0 ? (
                                taskImages.map((imageUrl, index) => (
                                    <img
                                        key={index}
                                        src={imageUrl}
                                        alt={`Bild ${index}`}
                                    />
                                ))
                            ) : (
                                <p>No pictures in this gallery.</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <p>Loading task...</p>
                )}
            </IonContent>
        </IonPage>
    );
};

export default TaskPage;
