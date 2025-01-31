import {    IonAlert, IonButton, IonContent, IonFab, IonFabButton, IonIcon, IonInput, IonItem, IonModal, IonPage, IonRefresher, IonRefresherContent, IonText, useIonViewWillEnter} from '@ionic/react';
import {useParams} from 'react-router-dom';
import React, {useEffect, useRef, useState} from 'react';
import {useHistory} from "react-router";
import {add, camera, createSharp, ellipsisVerticalSharp, imageOutline, logOut, share, trash} from "ionicons/icons";
import {menuController} from "@ionic/core/components";
import {addImagesToGallery, deleteGallery, getGalleryById, getGalleryImages, removeUserFromGallery, updateGalleryInfos, updateGalleryPreviewImg} from '../services/galleryService';
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
import {addTimestampToFilename} from "../utilitys/timeStamp";

// Page for displaying the selected gallery
const GalleryDetailPage: React.FC = () => {
    const {galleryId} = useParams<{ galleryId: string }>();
    const [gallery, setGallery] = useState<Gallery | null>(null);
    const [galleryImages, setGalleryImages] = useState<Image[]>([]);
    const [isParticipant, setIsParticipant] = useState(false);

    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newPreviewImage, setNewPreviewImage] = useState<File | null>(null);
    const [newPreviewImageUrl, setNewPreviewImageUrl] = useState<string | null>(null);

    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showTaskManagerModal, setTaskManagerModal] = useState(false);
    const [selectedSegment, setSelectedSegment] = useState("gallery-images-segment");

    const taskComponentRef = useRef<any>(null);
    const editInfosModal = useRef<HTMLIonModalElement>(null);
    const editPreviewModal = useRef<HTMLIonModalElement>(null);

    const {showToast} = useToast();
    const {currentUser} = useAuth();
    const history = useHistory();

    // Fetch gallery data and images when entering the page
    useIonViewWillEnter(() => {
        (async () => {
            if (!galleryId) return;
            await loadGalleryInfos();
            await fetchGalleryImages();
            if (taskComponentRef.current) {
                await taskComponentRef.current.fetchTasks();
            }
        })();
    });

    // Check if the current user is a participant in the gallery
    useEffect(() => {
        if (gallery && currentUser) {
            isParticipantInGallery();
        }
    }, [gallery, currentUser]);

    const handleRefresh = async (event: CustomEvent) => {
        await loadGalleryInfos();
        await isParticipantInGallery();
        await fetchGalleryImages();

        if (taskComponentRef.current) {
            await taskComponentRef.current.fetchTasks();
        }
        event.detail.complete();
    };

    // Check if the current user is a participant in the gallery
    const isParticipantInGallery = async () => {
        if (gallery) {
            setIsParticipant(currentUser.id !== gallery.owner_id);
        }
    };

    const loadGalleryInfos = async () => {
        const result_galleryData = await getGalleryById(galleryId);
        if (result_galleryData) {
            setGallery(result_galleryData.gallery_data);
        }
    };

    const fetchGalleryImages = async () => {
        const images = await getGalleryImages(galleryId);
        if (images) {
            setGalleryImages(images);
        }
    };

    const handleDeleteGallery = async () => {
        try {
            if (!gallery || !gallery.owner_id) {
                console.error('Gallery or owner ID missing');
                showToast('Unexpected error.');
                return;
            }
            const result = await deleteGallery(galleryId, gallery.owner_id, gallery.preview_image);
            console.log(galleryId)
            if (result.success) {
                showToast(result.message);
                await menuController.close();
                history.push('/galleries');
            } else {
                showToast(result.message);
            }
        } catch (err) {
            console.error('Error deleting gallery:', err);
        }
    };

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

    const handleAddImagesToGallery = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;

        input.onchange = async (event: any) => {
            const files = event.target.files;

            if (files && gallery?.owner_id && gallery.id) {
                const fileArray = Array.from(files as FileList);
                try {
                    await Promise.all(fileArray.map(file => {
                        const renamedFile = new File([file], addTimestampToFilename(file), { type: file.type });
                        return addImagesToGallery(gallery.owner_id, gallery.id, renamedFile);
                    }));
                    await fetchGalleryImages();
                    showToast('Images uploaded successfully');
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


    const handleEditGallery = async () => {
        if (gallery) {
            const titleToUse = newTitle || gallery.title; // Fallback auf bestehenden Titel

            const { message } = await updateGalleryInfos(gallery, titleToUse, newDescription);
            showToast(message);
            editInfosModal.current?.dismiss();
            resetFields();
            await loadGalleryInfos();
        } else {
            showToast('Gallery not found.');
        }
    };


    const handleChangePreviewImage = async () => {
        if (gallery && newPreviewImage) {

            const renamedFile = new File([newPreviewImage], addTimestampToFilename(newPreviewImage), { type: newPreviewImage.type });

            try {
                const {message} = await updateGalleryPreviewImg(gallery, renamedFile);
                showToast(message);
                await loadGalleryInfos();
                editPreviewModal.current?.dismiss();
            } catch (error) {
                console.error('Error updating preview image', error);
            }
        } else {
            showToast('Please set an image.');
        }
    };

    // Set the preview image when a new file is selected and prepare the image for upload
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];


            if (file.size > 2 * 1024 * 1024) {
                showToast("The file must not be larger than 2 MB.");
                return;
            }

            setNewPreviewImage(file);

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
        setNewPreviewImage(null);
        setNewTitle("");
        setNewDescription("");
        setNewPreviewImageUrl(null);
    }

    return (
        <IonPage id="gallerie-content">
            <IonContent fullscreen={true}>

                {/* Gallery Settings */}
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
                            setSelectedSegment("gallery-tasks-segment")
                            setTaskManagerModal(true);
                        }}> <IonIcon aria-hidden="true" icon={camera}/>Manage tasks</IonItem>)}

                        {!isParticipant && (<IonItem button onClick={() => {
                            setShowSettings(false);
                            editInfosModal.current?.present();
                        }}> <IonIcon aria-hidden="true" icon={createSharp}/>Edit gallery info</IonItem>)}

                        {!isParticipant && (<IonItem button onClick={() => {
                            setShowSettings(false);
                            editPreviewModal.current?.present();
                        }}> <IonIcon aria-hidden="true" icon={createSharp}/>Change thumbnail</IonItem>)}


                        {!isParticipant && (<IonItem button onClick={() => {
                            setShowSettings(false);
                            setShowShareModal(true);
                        }}> <IonIcon aria-hidden="true" icon={share}/>Share</IonItem>)}

                        {!isParticipant && (<IonItem button onClick={() => {
                            setShowSettings(false);
                            setShowDeleteConfirm(true);
                        }}> <IonIcon aria-hidden="true" icon={trash}/>Delete</IonItem>)}

                        {isParticipant && (<IonItem button onClick={() => {
                            setShowSettings(false);
                            setShowLeaveConfirm(true);
                        }}> <IonIcon aria-hidden="true" icon={logOut}/>Leave Gallery</IonItem>)}
                    </IonContent>
                </IonModal>

                {/* Frontend Refresher */}
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

                        <div className="galleryTopBar">
                            <IonIcon onClick={handleOpenSettings} aria-hidden="true" icon={ellipsisVerticalSharp}/>
                        </div>

                        <div className="gallery-header-wrapper">
                            <p className="gallery-owner">By {gallery.profiles.display_name}</p>
                            <h1 className="gallery-title">{gallery.title}</h1>

                            {gallery.description && (
                                <p className="gallery-descr">{gallery.description}</p>
                            )}
                        </div>

                        {gallery.preview_image ? (
                            <img src={gallery.preview_image} alt={gallery.title} className="gallery-image"/>
                        ) : (
                            <div className="gallery-image placeholder-img"/>
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
                    <ImageComponent images={galleryImages} galleryOwnerId={gallery?.owner_id!} onImageDelete={fetchGalleryImages}/>
                )}

                {selectedSegment === "gallery-tasks-segment" && (
                    <TaskComponent ref={taskComponentRef} galleryId={galleryId} isTaskManagerOpen={showTaskManagerModal}/>
                )}

                {/* Share Gallery */}
                <QRCodeComponent galleryId={galleryId} istShareOpen={showShareModal}/>

                {/* Delete-Gallery-Confirmation */}
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

                {/* Logout-Confirmation */}
                <IonAlert
                    isOpen={showLeaveConfirm}
                    onDidDismiss={() => setShowLeaveConfirm(false)}
                    header={'Leave Gallery'}
                    message={`Do you really want to delete this gallery?
                            ${gallery?.title}`}
                    buttons={[
                        {
                            text: 'Cancel',
                            role: 'cancel',
                            handler: async () => {
                                await menuController.close();},
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

                {/*Edit Infos*/}
                <IonModal
                    className="action-modal"
                    ref={editInfosModal}
                    breakpoints={[0, 0.55]}
                    initialBreakpoint={0.55}
                    handleBehavior="cycle"
                    onDidDismiss={resetFields}>
                    <div className="ion-padding form-container">

                        <div className="action-modal-title">
                            <p>Change the Info</p>
                        </div>

                        <IonItem>
                            <IonInput
                                placeholder="Title"
                                label="Title*"
                                labelPlacement="floating"
                                value={newTitle}
                                required={true}
                                type='text'
                                onIonChange={(e) => setNewTitle(e.detail.value!)}
                            />
                        </IonItem>

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

                        <IonButton expand="block"
                                   onClick={() => {
                                       handleEditGallery();
                                   }} shape="round"> Save </IonButton>
                    </div>
                </IonModal>


                {/*Edit Preview image*/}
                <IonModal
                    className="action-modal"
                    ref={editPreviewModal}
                    breakpoints={[0, 0.8]}
                    initialBreakpoint={0.8}
                    handleBehavior="cycle"
                    onDidDismiss={resetFields}>
                    <div className="ion-padding form-container">
                        <div className="action-modal-title">
                            <p>Change the Thumbnail</p>
                        </div>

                        <span className="imgPickerLabel">

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

                        <input type="file" accept="image/*" id="imagePreview_id-p" hidden onChange={handleFileChange}/>

                        <label
                            id="imagePreview_label"
                            htmlFor="imagePreview_id-p"
                            className={newPreviewImageUrl ? "hasImg" : ""}
                            style={{
                                backgroundImage: newPreviewImageUrl ? `url(${newPreviewImageUrl})` : undefined,
                            }}
                        >
                            <span className="imagePicker">
                                <span>Choose Image</span>
                                <IonIcon aria-hidden="true" icon={imageOutline}/>
                            </span>
                        </label>

                        <IonButton expand="block" onClick={() => {
                            handleChangePreviewImage();
                        }} shape="round"> Save </IonButton>
                    </div>
                </IonModal>

            </IonContent>
        </IonPage>
    );
};

export default GalleryDetailPage;
