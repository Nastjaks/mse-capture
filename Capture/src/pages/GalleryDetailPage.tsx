import {IonAlert, IonButton, IonCol, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonMenu, IonMenuButton, IonModal, IonPage, IonPopover, IonRefresher, IonRefresherContent, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView, IonText, IonTitle, IonToolbar} from '@ionic/react';
import {useParams} from 'react-router-dom'; // Zum Abrufen der Galerie-ID aus der URL
import {useEffect, useState} from 'react';
import {useHistory} from "react-router";
import {add, arrowBackSharp, camera, checkmark, downloadOutline, trash} from "ionicons/icons";
import {menuController} from "@ionic/core/components";
import {addImagesToGallery, deleteGallery, downloadPublicFile, getGalleryById, getGalleryImages} from '../services/galleryService';
import {createTask, deleteTask, getTasks} from "../services/taskService";
import {Gallery} from "../models/Gallery";
import {Task} from "../models/Task";
import '../theme/GalleryDetail.css';
import {useToast} from "../contexts/ToastContext";
import {useSwipeable} from "react-swipeable";
import CustomModal from '../components/CustomModals';
import QRCodeComponent from "../components/QRCodeComponent";


const GalleryDetailPage: React.FC = () => {
    const {galleryId} = useParams<{ galleryId: string }>(); // Galerie-ID aus der URL extrahieren
    const [gallery, setGallery] = useState<Gallery | null>(null); // State für die Galerie
    const [galleryImages, setGalleryImages] = useState<string[]>([]); // State für die Bild-URLs der Galerie

    //const [qrCodeData, setQrCodeData] = useState<string | null>(null); // QR-Code-Daten
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Zustand für das Bestätigungsdialog

    //Task Kram
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskTitle, setTaskTitle] = useState("");
    const [showDeleteTaskConfirm, setShowDeleteTaskConfirm] = useState(false); // Zustand für das Bestätigungsdialog
    const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

    // Modal Kram
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [modalContent, setModalContent] = useState<"image" | null>(null);
    const isModalOpen = modalContent !== null;

    const history = useHistory(); // History für die Navigation nach dem Löschen
    const {showToast} = useToast();

    // Event-Listener für die Navigation mit den Pfeiltasten
    useEffect(() => {
        if (isModalOpen) {
            const handleKeyDown = (event: KeyboardEvent) => {
                if (event.key === "ArrowRight") {
                    showNextImage();
                } else if (event.key === "ArrowLeft") {
                    showPreviousImage();
                }
            };

            window.addEventListener("keydown", handleKeyDown);
            return () => {
                window.removeEventListener("keydown", handleKeyDown);
            };
        }
    }, [isModalOpen]);

    
    // Galerie-Daten basierend auf der ID laden
    useEffect(() => {
        const fetchGalleryContent = async () => {
            if (galleryId) {
                await loadGalleryInfos();
                await loadGalleryImages();
                await loadTasks();
            }
        };

        fetchGalleryContent();
    }, [galleryId]);

    // Galerie-Tasks laden
    const loadTasks = async () => {
        try {
            const tasks = await getTasks(galleryId);
            console.log('Aufgaben:', tasks);
            if (tasks) {
                setTasks(tasks); // State mit Aufgaben füllen
            }
        } catch (err) {
            console.error('Fehler beim Laden der Aufgaben:', err);
        }
    };

    // Refresh Content
    const handleRefresh = async (event: CustomEvent) => {
        await loadGalleryInfos();
        await loadGalleryImages();
        event.detail.complete(); // Signalisiert, dass das Refresh abgeschlossen ist
    };

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
            if (!gallery || !gallery.owner_id) {
                console.error('Gallery or owner ID missing');
                showToast('Unexpected error.');
                return;
            }
            const result = await deleteGallery(galleryId, gallery?.owner_id, gallery?.preview_image); // Galerie löschen
            console.log(galleryId)
            if (result.success) {
                showToast(result.message);
                await menuController.close(); // Menü schließen
                history.push('/profil');
            } else {
                showToast(result.message);
            }
        } catch (err) {
            console.error('Fehler beim Löschen der Galerie:', err);
        }
    };

    const handleDeleteImage = (ImageID: String) => {
        showToast("NO DELETE FUNCTION: " + ImageID);
    }

    const openModal = (type: "image" ) => setModalContent(type);
    const closeModal = () => setModalContent(null);

    const showNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex < galleryImages.length - 1 ? prevIndex + 1 : 0
        );
    };

    const showPreviousImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : galleryImages.length - 1
        );
    };

    // Swipe-Funktionen
    const handlers = useSwipeable({
        onSwipedLeft: showNextImage,
        onSwipedRight: showPreviousImage,
        trackMouse: true, // Auch Mausbewegungen tracken
    });

    // Funktion zum Herunterladen von Bildern aus der Galerie
    const downloadGalleryImagesFromURL = async (url: string) => {
        console.log('URL:', url);
        const cutUrl = url.split('/public/').slice(2).join('/');
        const result = `public/${cutUrl}`;
        console.log('Download URL:', result);
        downloadPublicFile(result);
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
                        fileArray.map(file => addImagesToGallery(gallery.owner_id, gallery.id, file as File))
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

    const handleAddTask = async () => {
        if (!taskTitle) {
            showToast('Task required');
            return;
        }
        try {
            const task = await createTask(taskTitle, galleryId);
            if (task) {
                await loadTasks();
                setTaskTitle("")
            }
        } catch (err) {
            console.error('Fehler beim Erstellen der Aufgabe:', err);
        }
    }

    const handleDeleteTask = async (taskId: string) => {
        try {
            const result = await deleteTask(taskId); // Task-Service-Funktion aufrufen
            if (result) {
                showToast("Task gelöscht"); // Erfolgsnachricht anzeigen
                await loadTasks(); // Liste aktualisieren
            }
        } catch (err) {
            console.error('Fehler beim Löschen der Aufgabe:', err);
            showToast('Fehler beim Löschen der Aufgabe.');
        }
    };

    return (
        <>
            {/* Menü-Komponente */}
            <IonMenu contentId="gallerie-content" menuId="gallerie-menu" side="end">
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Settings</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="">
                    <IonItem button={true}> Task Manager </IonItem>
                    <IonItem button id="open-share">Share</IonItem>
                    <IonItem button onClick={() => setShowDeleteConfirm(true)}> Delete </IonItem>
                </IonContent>
            </IonMenu>

            <IonPage id="gallerie-content">
                <IonContent fullscreen>
                    {/* Navigation für Desktop */}
                    <IonHeader>
                        <IonToolbar>
                            {/* Burger-Button für das Menü */}
                            <IonTitle>Galerie Detail</IonTitle>
                            <IonMenuButton menu="gallerie-menu" slot="end"/>
                        </IonToolbar>
                    </IonHeader>

                    <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                        <IonRefresherContent
                            pullingText="Pull to refresh"
                            refreshingText="Refreshing..."
                            refreshingSpinner="circles"
                        />
                    </IonRefresher>
                    <IonFab slot="fixed" vertical="bottom" horizontal="end" onClick={handleAddImages}>
                        <IonFabButton>
                            <IonIcon icon={add}></IonIcon>
                        </IonFabButton>
                    </IonFab>

                    {gallery ? (
                        <div className="galerie-header">
                            <p>Owner: {gallery.owner_id}</p>
                            <h1>{gallery.title}</h1>
                            <p>{gallery.description}</p>
                            {gallery.preview_image && (
                                <img className="galerie-previeImg" src={gallery.preview_image}/>
                            )}
                        </div>
                    ) : (
                        <p>Gallery not found</p>
                    )}
                    {gallery ? (
                        <div className="galerie-img-wrapper">
                            {galleryImages.length > 0 ? (
                                galleryImages.map((imageUrl, index) => (
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
                                <p>No pictures in this gallery.</p>
                            )}
                        </div>
                    ) : (
                        <p>Gallery not found</p>
                    )}
                    {gallery ? (
                        <div className="ion-padding">

                            <div>
                                <p>Create Task</p>
                                <div className="form-container">
                                    <IonItem>
                                        <IonInput
                                            placeholder="Task..."
                                            labelPlacement="floating"
                                            value={taskTitle}
                                            type="text"
                                            onIonChange={(e) => setTaskTitle(e.detail.value!)}
                                        >
                                            <div slot="label">Task<IonText>*</IonText></div>
                                        </IonInput>
                                    </IonItem>
                                    <IonButton expand="block" onClick={handleAddTask} shape="round">
                                        Add Task
                                    </IonButton>
                                </div>
                            </div>
                            {tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <div key={task.id} className="task-item">
                                        <div className="task-def">
                                            <IonIcon aria-hidden="true" icon={camera}/>
                                            <p>{task.task}</p>
                                        </div>
                                        <div>
                                            <IonIcon className="task-item-check" aria-hidden="true" icon={checkmark}/>
                                            <IonIcon
                                                className="item-trash"
                                                onClick={() => {
                                                    setShowDeleteTaskConfirm(true);
                                                    setCurrentTaskId(task.id);
                                                }}
                                                aria-hidden="true"
                                                icon={trash}
                                            />

                                        </div>

                                    </div>
                                ))
                            ) : (
                                <p>No tasks for this gallery.</p>
                            )}
                        </div>
                    ) : (
                        <p>Galerie nicht gefunden</p>
                    )}
                </IonContent>
            </IonPage>

            <CustomModal isOpen={isModalOpen} onClose={closeModal}>
                {modalContent === "image" && (
                    <div className="modal-content galerie-lightbox">

                        {/* Optionen */}
                        <div className="lightbox-header">
                            <IonIcon onClick={closeModal} aria-hidden="true" icon={arrowBackSharp}/>
                            <span>
                                <IonItem><IonIcon aria-hidden="true" icon={downloadOutline} onClick={() => downloadGalleryImagesFromURL(galleryImages[currentImageIndex])}/> Download</IonItem>
                                <IonItem><IonIcon aria-hidden="true" icon={trash} onClick={() => handleDeleteImage("23")}/>Delete</IonItem>
                            </span>
                        </div>

                        {/* Bildanzeige */}
                        <div className="image-container" {...handlers}>
                            <img
                                src={galleryImages[currentImageIndex]}
                                alt={`Bild ${currentImageIndex}`}
                                style={{width: "100%", maxHeight: "80vh", objectFit: "cover"}}
                            />
                        </div>

                        {/* Infos */}
                        <div className="lightbox-footer">
                            <p>von XYZ</p>
                        </div>

                        {/* Navigation
                        <div className="navigation-arrows">
                            <IonButton onClick={showPreviousImage}>←</IonButton>
                            <IonButton onClick={showNextImage}>→</IonButton>
                        </div> */}

                    </div>
                )}
            </CustomModal>

            {/* Delete-Bestätigungsdialog */}
            <IonAlert
                isOpen={showDeleteConfirm}
                onDidDismiss={() => setShowDeleteConfirm(false)}
                header={'Delete Gallery'}
                message={'Do you really want to delete this gallery?'}
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: async () => {
                            await menuController.close(); // Menü schließen
                        },
                    },
                    {
                        text: 'Delete',
                        handler: handleDeleteGallery,
                    },
                ]}
            />


            {/* Delete-Bestätigungsdialog Tastk */}
            <IonAlert
                isOpen={showDeleteTaskConfirm}
                onDidDismiss={() => setShowDeleteTaskConfirm(false)}
                header={'Delete Task'}
                message={'Do you really want to delete this task?'}
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => setShowDeleteTaskConfirm(false),
                    },
                    {
                        text: 'Delete',
                        handler: () => {
                            if (currentTaskId) {
                                handleDeleteTask(currentTaskId); // Aktuelle Task-ID übergeben
                                setShowDeleteTaskConfirm(false);
                            }
                        },
                    },
                ]}
            />


            {/* Share Gallery */}
            <IonModal
                trigger="open-share"
                initialBreakpoint={0.6}
                breakpoints={[0.6, 0.75]}
                backdropDismiss={true}
                handleBehavior="cycle"
                onWillPresent={async () => await menuController.close()}
            >
                <IonContent className="ion-padding">
                    <div className="ion-margin-top">
                        <QRCodeComponent galleryId={galleryId} />
                    </div>
                </IonContent>
            </IonModal>

        </>
    );
};

export default GalleryDetailPage;
