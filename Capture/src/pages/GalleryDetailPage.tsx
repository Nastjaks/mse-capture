import {
    IonAlert, IonContent, IonFab, IonFabButton, IonIcon, IonItem, IonLabel, IonModal, IonPage, IonRefresher, IonRefresherContent, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView, useIonViewWillEnter
} from '@ionic/react';
import {useParams} from 'react-router-dom';
import React, {useState} from 'react';
import {useHistory} from "react-router";
import {add, ellipsisVerticalSharp} from "ionicons/icons";
import {menuController} from "@ionic/core/components";
import {addImagesToGallery, deleteGallery, getGalleryById, removeUserFromGallery} from '../services/galleryService';
import {Gallery} from "../models/Gallery";
import '../theme/GalleryDetail.css';
import {useToast} from "../contexts/ToastContext";
import QRCodeComponent from "../components/QRCodeComponent";
import TaskComponent from "../components/TaskComponent";
import {sideEnterAnimation, sideLeaveAnimation} from "../theme/animations";
import {getLoggedInUserId} from '../services/authService';
import ImageViewComponent from "../components/ImageViewComponent";


const GalleryDetailPage: React.FC = () => {

    const {galleryId} = useParams<{ galleryId: string }>(); // Galerie-ID aus der URL extrahieren
    const [gallery, setGallery] = useState<Gallery | null>(null); // State für die Galerie
    const [isShared, setIsShared] = useState(false); // State für die Galerie
    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false); // Zustand für das Bestätigungsdialog
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [galleryImages, setGalleryImages] = useState<string[]>([]);

    const [showSettings, setShowSettings] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showTaskManagerModal, setTaskManagerModal] = useState(false);

    const history = useHistory();
    const {showToast} = useToast();

    useIonViewWillEnter(() => {
        if (galleryId) {
            loadGalleryInfos();
            isSharedGallery();
        }
    });

    const isSharedGallery = async () => {
        if (gallery) {
            const userResponse = await getLoggedInUserId();
            setIsShared(userResponse.user?.id !== gallery.owner_id);
        }
    };

    /* -- Läd Galleri Infos -- */
    const loadGalleryInfos = async () => {
        const result_galleryData = await getGalleryById(galleryId); // Funktion zum Abrufen der Galerie
        if (result_galleryData) {
            setGallery(result_galleryData);
        }
    };

    // Refresh Content
    const handleRefresh = async (event: CustomEvent) => {
        await loadGalleryInfos();
        await isSharedGallery();
        event.detail.complete();
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

    /* Galerie-Bilder laden
    const fetchGalleryImages = async () => {
        const images = await getGalleryImages(galleryId);
        if (images) {
            setGalleryImages(images.map(img => img.image_url)); // Bild-URLs extrahieren
        }
    };*/

    // Leave Shared Gallery
    const leaveSharedGallery = async () => {
        try {
            const userResponse = await getLoggedInUserId();
            const userId = userResponse.user?.id;
            if (userId) {
                await removeUserFromGallery(galleryId, userId);
                history.push('/galleries')
                showToast('Left gallery successfully.');
            } else {
                console.error('User ID is undefined');
                showToast('Error leaving gallery.');
            }
        } catch (error) {
            console.error(error);
            showToast('Error leaving gallery.');
        }
    };

    const handleOpenSettings = () => {
        setShowSettings(true);
        setShowShareModal(false);
        setTaskManagerModal(false);
    };

    const handleCloseSettings = () => {
        setShowSettings(false);
    };


    const handleAddImagesToGallery = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = async (event: any) => {
            const files = event.target.files;

            if (files && gallery?.owner_id && gallery.id) {
                const fileArray = Array.from(files); // Dateien in ein Array konvertieren
                try {
                    await Promise.all(fileArray.map(file => addImagesToGallery(gallery.owner_id, gallery.id, file as File)));
                    //await fetchImages();
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
                            <IonItem>Gallery Settings</IonItem>

                            <IonItem button onClick={() => {
                                setShowSettings(false);
                                showToast("COMING SOON - Edit Function");
                            }}>Edit</IonItem>

                            <IonItem button onClick={() => {
                                setShowSettings(false);
                                setTaskManagerModal(true);
                            }}>Task Manager</IonItem>

                            <IonItem button onClick={() => {
                                setShowSettings(false);
                                setShowShareModal(true);
                            }}> Share </IonItem>

                            <IonItem button onClick={() => {
                                setShowSettings(false);
                                setShowDeleteConfirm(true);
                            }}>Delete</IonItem>

                            {isShared && (<IonItem onClick={() => {
                                setShowSettings(false);
                                setShowLeaveConfirm(true);
                            }}>Leave Gallery</IonItem>)}
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

                            {/* Optionen */}
                            <div className="galleryTopBar">
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

                    {gallery ? (<ImageViewComponent galleryOwnerId={gallery.owner_id} referenceId={galleryId} referenceType={"Gallery"}/>): (
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
                            {/* Gallery Images
                            <ImageComponent referenceObject={gallery as Gallery}/>*/}
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

                    {/* Logout-Bestätigungsdialog */}
                    <IonAlert
                        isOpen={showLeaveConfirm}
                        onDidDismiss={() => setShowLeaveConfirm(false)}
                        header={'Leave Gallery'}
                        message={'Do you really want to leave this gallery?'}
                        buttons={[
                            {
                                text: 'Cancel',
                                role: 'cancel',
                                handler: async () => {
                                    await menuController.close(); // Menü schließen
                                },
                            },
                            {
                                text: 'Leave',
                                handler: leaveSharedGallery,
                            },
                        ]}
                    />

                    <IonFab slot="fixed" vertical="bottom" horizontal="end" onClick={handleAddImagesToGallery}>
                        <IonFabButton>
                            <IonIcon icon={add}></IonIcon>
                        </IonFabButton>
                    </IonFab>

                </IonContent>

            </IonPage>

        </>
    );
};

export default GalleryDetailPage;
