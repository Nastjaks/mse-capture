import React, {useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {IonContent, IonFab, IonFabButton, IonIcon, IonPage, IonRefresher, IonRefresherContent, IonText, useIonViewWillEnter} from '@ionic/react';
import {getTaksImages, getTaskById, uploadImageToTask} from '../services/taskService';
import {Task} from '../models/Task'
import {Gallery} from "../models/Gallery";
import {add, arrowBackSharp} from "ionicons/icons";
import {getGalleryById} from "../services/galleryService";
import {Image} from "../models/Image";
import ImageComponent from "../components/ImageComponent";

const TaskPage: React.FC = () => {
    const {galleryId, taskId} = useParams<{ galleryId: string; taskId: string }>();
    const [task, setTask] = useState<Task | null>(null);
    const [gallery, setGallery] = useState<Gallery | null>(null);

    const [taskImages, setTaskImages] = useState<Image[]>([]); //NEU
    const history = useHistory();

    useIonViewWillEnter(() => {
        fetchGallery();
        fetchTask();
        fetchTaskImages();
    });


   /* -- Refresh Content -- */
    const handleRefresh = async (event: CustomEvent) => {
        await fetchGallery();
        await fetchTask();
        await fetchTaskImages();
        event.detail.complete();
    };

    /* -- Holt die Task -- */
    const fetchTask = async () => {
        if (taskId) {
            const fetchedTask = await getTaskById(taskId);
            setTask(fetchedTask);
        }
    };

    /* -- Holt die Bilder der Task -- */
    const fetchTaskImages = async () => {
        const images = await getTaksImages(taskId);
        if (images) {
            setTaskImages(images); // Bild-URLs extrahieren
        }
    };

    /* -- Holt die Gallery Infos -- */
    const fetchGallery = async () => {
        if (galleryId) {
            const fetchedGallery = await getGalleryById(galleryId);
            setGallery(fetchedGallery);
        }
    };


    /* -- Läd die Bilde hoch und verknüpft sie mit der Task -- */
    const handleUploadImagesToTask = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;

        input.onchange = async (event: any) => {
            const files = event.target.files;

            if (files && gallery?.owner_id && galleryId) {
                const fileArray = Array.from(files);
                try {
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

                <IonFab slot="fixed" vertical="bottom" horizontal="end" onClick={handleUploadImagesToTask}>
                    <IonFabButton>
                        <IonIcon icon={add}></IonIcon>
                    </IonFabButton>
                </IonFab>

                {gallery ? (
                    <div className="galerie-header">

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
                    <div className="ion-padding no-content">
                        <p>Error</p>
                    </div>
                )}


                {task ? (
                    <div>
                        <div className="ion-padding">
                            <IonText color="primary">Task</IonText>
                            <h2>{task.task}</h2>
                        </div>

                        <ImageComponent images={taskImages} galleryOwnerId={gallery?.owner_id!} onImageDelete={fetchTaskImages}/>

                    </div>
                ) : (
                    <div className="ion-padding no-content">
                        <p>Error</p>
                    </div>
                )}

            </IonContent>
        </IonPage>
    );
};

export default TaskPage;
