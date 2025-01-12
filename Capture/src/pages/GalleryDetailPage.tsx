import {
    IonAlert, IonContent, IonIcon, IonItem, IonLabel, IonModal, IonPage, IonRefresher, IonRefresherContent, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView, useIonViewWillEnter
} from '@ionic/react';
import {useParams} from 'react-router-dom';
import React, {useState} from 'react';
import {useHistory} from "react-router";
import {ellipsisVerticalSharp} from "ionicons/icons";
import {menuController} from "@ionic/core/components";
import {deleteGallery, getGalleryById} from '../services/galleryService';
import {Gallery} from "../models/Gallery";
import '../theme/GalleryDetail.css';
import {useToast} from "../contexts/ToastContext";
import QRCodeComponent from "../components/QRCodeComponent";
import TaskComponent from "../components/TaskComponent";
import {sideEnterAnimation, sideLeaveAnimation} from "../theme/animations";
import ImageComponent from "../components/ImageComponent";


const GalleryDetailPage: React.FC = () => {
    const {galleryId} = useParams<{ galleryId: string }>(); // Galerie-ID aus der URL extrahieren
    const [gallery, setGallery] = useState<Gallery | null>(null); // State für die Galerie

    // Modal Kram
    const [modalContent, setModalContent] = useState<"image" | null>(null);
    const isModalOpen = modalContent !== null;
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Zustand für das Bestätigungsdialog

    const history = useHistory(); // History für die Navigation nach dem Löschen
    const {showToast} = useToast();

    //Resetet die Felder wenn die View verlassen wird
    useIonViewWillEnter(() => {
        if (galleryId) {
            loadGalleryInfos();
        }
    });

    // Galerie-Daten laden
    const loadGalleryInfos = async () => {
        const result_galleryData = await getGalleryById(galleryId); // Funktion zum Abrufen der Galerie
        if (result_galleryData) {
            setGallery(result_galleryData);
        }
    };

    // Refresh Content
    const handleRefresh = async (event: CustomEvent) => {
        await loadGalleryInfos();
        event.detail.complete(); // Signalisiert, dass das Refresh abgeschlossen ist
    };

    // Funktion zum Löschen der Galerie
    const handleDeleteGallery = async () => {
        try {
            if (!gallery || !gallery.owner_id) {
                console.error('Gallery or owner ID missing');
                showToast('Unexpected error.');
                return;
            }
            const result = await deleteGallery(galleryId, gallery.owner_id, gallery.preview_image); // Galerie löschen
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

    const [showSettings, setShowSettings] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showTaskManagerModal, setTaskManagerModal] = useState(false);

    const handleOpenSettings = () => {
        setShowSettings(true);
        setShowShareModal(false);
        setTaskManagerModal(false);
    };

    const handleCloseSettings = () => {
        setShowSettings(false);
    };

    return (
        <>
            <IonPage id="gallerie-content">
                <IonContent fullscreen>

                    {/* Custom Navigation*/}
                    <IonModal
                        isOpen={showSettings}
                        onDidDismiss={handleCloseSettings}
                        enterAnimation={sideEnterAnimation}
                        leaveAnimation={sideLeaveAnimation}
                        className='gallery-menu-modal'
                    >
                        <IonContent>
                            <p>Gallery Settings</p>

                            <IonItem onClick={() => {
                                setShowSettings(false);
                                setTaskManagerModal(true);
                            }}>Task Manager</IonItem>

                            <IonItem onClick={() => {
                                setShowSettings(false);
                                setShowShareModal(true);
                            }}> Share </IonItem>


                            <IonItem onClick={() => {
                                setShowSettings(false);
                                setShowDeleteConfirm(true);
                            }}>Delete</IonItem>

                        </IonContent>
                    </IonModal>

                    {/* Fontent Refresher */}
                    <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                        <IonRefresherContent
                            pullingText="Pull to refresh"
                            refreshingText="Refreshing..."
                            refreshingSpinner="circles"
                        />
                    </IonRefresher>

                    {/* Gallerie Header */}
                    {gallery ? (
                        <div className="galerie-header">
                            <div>
                                <IonIcon onClick={handleOpenSettings} aria-hidden="true" icon={ellipsisVerticalSharp}/>
                            </div>
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

                    <IonSegment value="gallery-images-segment">
                        <IonSegmentButton value="gallery-images-segment" contentId={`gallery-images-segment-${galleryId}`}>
                            <IonLabel>Images</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="gallery-tasks-segment" contentId={`gallery-task-segment-${galleryId}`}>
                            <IonLabel>Tasks</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>

                    <IonSegmentView>
                        <IonSegmentContent id={`gallery-images-segment-${galleryId}`}>
                            {/* Gallery Images*/}
                            <ImageComponent referenceObject={gallery as Gallery} referenceType={"gallery"}/>
                        </IonSegmentContent>
                        <IonSegmentContent id={`gallery-task-segment-${galleryId}`}>
                            {/* Gallerie Tasks*/}
                            {gallery && <TaskComponent galleryId={galleryId} isTaskManagerOpen={showTaskManagerModal}/>}
                        </IonSegmentContent>
                    </IonSegmentView>

                    {/* Share Gallery */}
                    <QRCodeComponent galleryId={galleryId} istShareOpen={showShareModal}/>

                    {/* Delete-Galerie-Bestätigungsdialog */}
                    <IonAlert
                        isOpen={showDeleteConfirm}
                        onDidDismiss={() => setShowDeleteConfirm(false)}
                        header={'Delete Gallery'}
                        message={`Do you really want to delete this gallery?
                        ${gallery?.title}`}

                        buttons={[
                            {
                                text: 'Cancel',
                                role: 'cancel',
                                handler: async () => {
                                    await menuController.close();
                                },
                            },
                            {
                                text: 'Delete',
                                handler: handleDeleteGallery,
                            },
                        ]}
                    />

                </IonContent>
            </IonPage>

        </>
    );
};

export default GalleryDetailPage;
