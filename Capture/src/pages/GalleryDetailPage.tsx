import {
    IonAlert, IonButton, IonContent, IonFab, IonFabButton, IonIcon, IonInput, IonItem, IonModal, IonPage, IonRefresher, IonRefresherContent, IonText, useIonViewWillEnter
} from '@ionic/react';
import {useParams} from 'react-router-dom';
import React, {useEffect, useRef, useState} from 'react';
import {useHistory} from "react-router";
import {add, camera, createSharp, ellipsisVerticalSharp, imageOutline, logOut, share, trash} from "ionicons/icons";
import {menuController} from "@ionic/core/components";
import {addImagesToGallery, deleteGallery, getGalleryById, getGalleryImages, removeUserFromGallery, updateGallery} from '../services/galleryService';
import {Gallery} from "../models/Gallery";
import '../theme/GalleryDetail.css';
import {useToast} from "../contexts/ToastContext";
import QRCodeComponent from "../components/QRCodeComponent";
import TaskComponent from "../components/TaskComponent";
import {sideEnterAnimation, sideLeaveAnimation} from "../theme/animations";
import {getLoggedInUser} from '../services/authService';
import ImageComponent from "../components/ImageComponent";
import {Image} from "../models/Image";
import {useAuth} from "../contexts/AuthContext";

const GalleryDetailPage: React.FC = () => {

    const {galleryId} = useParams<{ galleryId: string }>(); // Galerie-ID aus der URL extrahieren
    const [gallery, setGallery] = useState<Gallery | null>(null); // State für die Galerie
    const [galleryImages, setGalleryImages] = useState<Image[]>([]);
    const [isParticipant, setIsParticipant] = useState(false); // State für die Galerie

    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newPreviewImage, setNewPreviewImage] = useState<File | null>(null);
    const [newPreviewImageUrl, setNewPreviewImageUrl] = useState<string | null>(null);

    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false); // Zustand für das Bestätigungsdialog
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showTaskManagerModal, setTaskManagerModal] = useState(false);
    const [selectedSegment, setSelectedSegment] = useState("gallery-images-segment");

    const taskComponentRef = useRef<any>(null);
    
    const modal = useRef<HTMLIonModalElement>(null);

    const {showToast} = useToast();
    const {currentUser} = useAuth();
    const history = useHistory();

    // Gallery laden in useIonViewWillEnter
    useIonViewWillEnter(() => {
    (async () => {
        if (!galleryId) return;
        await loadGalleryInfos();    // => setzt gallery
        await fetchGalleryImages();  // => setzt galleryImages
        if (taskComponentRef.current) {
        await taskComponentRef.current.fetchTasks();
        }
    })();
    });

    // useEffect überwacht gallery und currentUser
    useEffect(() => {
    if (gallery && currentUser) {
        isParticipantInGallery();
    }
    }, [gallery, currentUser]);

    /* -- Content Refresh -- */
    const handleRefresh = async (event: CustomEvent) => {
        await loadGalleryInfos();
        await isParticipantInGallery();
        await fetchGalleryImages();

        // fetchTasks in der Kindkomponente auslösen
        if (taskComponentRef.current) {
            await taskComponentRef.current.fetchTasks(); // Ruft die fetchTasks Funktion in der Kindkomponente auf
        }

        event.detail.complete();
    };

    /* -- Prüft Rolle -- */
    const isParticipantInGallery = async () => {
        if (gallery) {
            setIsParticipant(currentUser.id !== gallery.owner_id);
        }
    };

    /* -- Holt die Gallery Infos -- */
    const loadGalleryInfos = async () => {
        const result_galleryData = await getGalleryById(galleryId); // Funktion zum Abrufen der Galerie
        if (result_galleryData) {
            setGallery(result_galleryData.gallery_data);
        }
    };

    /* -- Holt die Bilder der Galerie -- */
    const fetchGalleryImages = async () => {
        const images = await getGalleryImages(galleryId);
        if (images) {
            setGalleryImages(images);
        }
    };

    /* -- Galerie Löschen -- */
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

    /* -- Verlassen der Galerie -- */
    const leaveSharedGallery = async () => {
        try {
            const userResponse = await getLoggedInUser();
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

    /* -- Läd die Bilde hoch zur Galerie -- */
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
                    await fetchGalleryImages();
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

    /* -- Edit Gallery -- */
    const handleEditGallery = async () => {
        if (gallery) {
            const {message} = await updateGallery(gallery, newTitle, newDescription, newPreviewImage);
            showToast(message);
            await loadGalleryInfos();
        } else {
            showToast('Gallery not found.');
        }
    }

    /* -- Bildvorschau -- */
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];

            // Validierung der Dateigröße (max. 2 MB)
            if (file.size > 2 * 1024 * 1024) {
                showToast("The file must not be larger than 2 MB.");
                return;
            }

            setNewPreviewImage(file);

            // Bildvorschau generieren
            const reader = new FileReader();
            reader.onload = () => {
                setNewPreviewImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
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

    const handleSegmentChange = (value: string) => {
        setTaskManagerModal(false);
        setSelectedSegment(value);
    };

    const resetFields = () => {
        setNewTitle("");
        setNewDescription("");
        setNewPreviewImage(null);
    }

    function dismiss() {
        modal.current?.dismiss();
    }

    function present() {
        modal.current?.present();
    }

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
                            {!isParticipant && (<IonItem button onClick={() => {
                                setShowSettings(false);
                                present();
                            }}> <IonIcon aria-hidden="true" icon={createSharp}/>Edit gallery</IonItem>)}

                            {!isParticipant && (<IonItem button onClick={() => {
                                setShowSettings(false);
                                setSelectedSegment("gallery-tasks-segment")
                                setTaskManagerModal(true);
                            }}> <IonIcon aria-hidden="true" icon={camera}/>Manage tasks</IonItem>)}

                            {!isParticipant && (<IonItem button onClick={() => {
                                setShowSettings(false);
                                setShowShareModal(true);
                            }}>  <IonIcon aria-hidden="true" icon={share}/>Share</IonItem>)}

                            {!isParticipant && (<IonItem button onClick={() => {
                                setShowSettings(false);
                                setShowDeleteConfirm(true);
                            }}>  <IonIcon aria-hidden="true" icon={trash}/>Delete</IonItem>)}

                            {isParticipant && (<IonItem button onClick={() => {
                                setShowSettings(false);
                                setShowLeaveConfirm(true);
                            }}>  <IonIcon aria-hidden="true" icon={logOut}/>Leave Gallery</IonItem>)}
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
                            <p>Owner: {gallery.profiles.display_name}</p>
                            <h1>{gallery.title}</h1>
                            <p>{gallery.description}</p>
                            {gallery.preview_image && (
                                <img className="galerie-previeImg" src={gallery.preview_image}/>
                            )}
                        </div>
                    ) : (
                        <p>Gallery not found</p>
                    )}

                    <div className="ion-padding">
                        <div className="custom-segment-container ">
                            <div className="custom-segment-background" style={{transform: `translateX(${selectedSegment === 'gallery-tasks-segment' ? '100%' : '0'})`}}></div>
                            <div
                                className={`custom-segment-button ${selectedSegment === "gallery-images-segment" ? "active" : ""}`}
                                onClick={() => handleSegmentChange("gallery-images-segment")}>
                                <IonText>Images</IonText>
                            </div>
                            <div
                                className={`custom-segment-button ${selectedSegment === "gallery-tasks-segment" ? "active" : ""}`}
                                onClick={() => handleSegmentChange("gallery-tasks-segment")}>
                                <IonText>Tasks</IonText>
                            </div>
                        </div>
                    </div>

                    {selectedSegment === "gallery-images-segment" && (
                        <div>
                            <ImageComponent images={galleryImages} galleryOwnerId={gallery?.owner_id!} onImageDelete={fetchGalleryImages}/>
                        </div>
                    )}

                    {selectedSegment === "gallery-tasks-segment" && (
                        <div>
                            <TaskComponent ref={taskComponentRef} galleryId={galleryId} isTaskManagerOpen={showTaskManagerModal}/>
                        </div>
                    )}

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


                    <IonFab
                        slot="fixed"
                        vertical="bottom"
                        horizontal="end"
                        onClick={handleAddImagesToGallery}
                        className={selectedSegment === "gallery-images-segment" ? "" : "hide-btn"}
                    >
                        <IonFabButton>
                            <IonIcon icon={add}></IonIcon>
                        </IonFabButton>
                    </IonFab>

                </IonContent>

                    <IonModal
                        className="modal-dialog"
                        ref={modal}
                        onDidDismiss={resetFields}>
                        <div className="ion-padding form-container">
                            <p>Set new title</p>
                            <IonItem>
                                <IonInput
                                    placeholder="Title"
                                    label="Title"
                                    labelPlacement="floating"
                                    value={newTitle}
                                    required={true}
                                    type='text'
                                    onIonChange={(e) => setNewTitle(e.detail.value!)}
                                />
                            </IonItem>
                            <p>Set new description</p>
                            <IonItem>
                                <IonInput
                                    placeholder="Description..."
                                    label="Description"
                                    labelPlacement="floating"
                                    value={newDescription}
                                    required={true}
                                    type='text'
                                    onIonChange={(e) => setNewDescription(e.detail.value!)}
                                />
                            </IonItem>

                            <span className="imgPickerLabel">
                                <p className="label tumb-label">Thumbnail</p>
        
                                {/* Bild entfernen */}
                                {newPreviewImage && (
                                    <IonIcon
                                        className="removeImage"
                                        aria-hidden="true"
                                        icon={trash}
                                        onClick={() => {
                                            setNewPreviewImage(null);
                                            setNewPreviewImageUrl(null);
                                        }}
                                    />
                                )}
        
                            </span>
        
                            <input
                                type="file"
                                accept="image/*"
                                id="imagePreview_id"
                                hidden
                                onChange={handleFileChange}
                            />
        
                            <label
                                id="imagePreview_label"
                                htmlFor="imagePreview_id"
                                className={newPreviewImage ? "hasImg" : ""}
                                style={{
                                    backgroundImage: newPreviewImage ? `url(${newPreviewImageUrl})` : undefined,
                                }}
                            >
                                    <span className="imagePicker">
                                        <span>Choose Image</span>
                                        <IonIcon aria-hidden="true" icon={imageOutline}/>
                                    </span>
                            </label>
                            <IonButton expand="block"
                                        onClick={() => {
                                            handleEditGallery();
                                            resetFields();
                                            dismiss();
                                        }} shape="round"> Save </IonButton>
                        </div>
                    </IonModal>
            </IonPage>

        </>
    );
};

export default GalleryDetailPage;
