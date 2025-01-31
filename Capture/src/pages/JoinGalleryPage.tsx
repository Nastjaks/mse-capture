import {IonButton, IonContent, IonHeader, IonInput, IonItem, IonModal, IonPage, IonText, IonTitle, IonToolbar, useIonViewWillEnter} from '@ionic/react';
import React, {useRef, useState} from 'react';
import {AddUserToGallery, getGalleryById} from '../services/galleryService';
import {Gallery} from "../models/Gallery";
import {Link, useParams} from "react-router-dom";
import {useHistory} from "react-router";
import {signIn, signUp} from '../services/authService';
import {getLoggedInUser} from "../services/authService";
import {useToast} from '../contexts/ToastContext';
import {useAuth} from '../contexts/AuthContext';
import {getRandomUserName} from '../utilitys/randomUsername';
import {menuController} from "@ionic/core/components";

// Page to join a gallery
const JoinGalleryPage: React.FC = () => {
    const [gallery, setGallery] = useState<Gallery | null>(null);
    const [anonName, setAnonName] = useState("");
    const history = useHistory();
    const {galleryId} = useParams<{ galleryId: string }>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {showToast} = useToast();
    const {checkUser} = useAuth();

    const modal = useRef<HTMLIonModalElement>(null);

    useIonViewWillEnter(() => {
        fetchGallery();
    });

    const fetchGallery = async () => {
        if (galleryId) {
            const result_galleryData = await getGalleryById(galleryId);
            if (result_galleryData) {
                setGallery(result_galleryData.gallery_data);
            }
            const userResponse = await getLoggedInUser();
            if (userResponse.success && userResponse.user) {
                await AddUserToGallery(galleryId, userResponse.user?.id);
                history.replace(`/gallery/${galleryId}`);
                showToast("Joined gallery!");
            }
        }
    };

    const handleAnonLogin = async () => {
        const user = await signUp("", "", anonName || getRandomUserName());
        if (user.success && gallery && user.user) {
            const checkUserResponse = await checkUser();
            if (checkUserResponse ) {
                AddUserToGallery(gallery.id, user.user?.id);
                history.replace(`/gallery/${gallery.id}`);
            } else {
                showToast("Failed to join gallery");
            }
        }
    };

    const handleLoginWithInviteCode = async () => {
        try {
            const result = await signIn(email, password);
            if (result.success && gallery && result.user) {
                const checkUserResponse = await checkUser();
                if (checkUserResponse) {
                    AddUserToGallery(gallery.id, result.user?.id,);
                    history.replace(`/gallery/${gallery.id}`);
                    showToast("Joined gallery!");
                    dismiss();
                } else {
                    showToast("Failed to join gallery");
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    function dismiss() {
        modal.current?.dismiss();
    }

    return (
        <IonPage>
            <IonContent fullscreen={true} className="ion-padding">

                <IonHeader>
                    <IonToolbar>
                        <IonTitle>CAPTURE</IonTitle>
                    </IonToolbar>
                </IonHeader>

                {gallery ? (
                    <div>
                        {gallery.preview_image ? (
                            <img className="join-galerie-previeImg" src={gallery.preview_image}/>
                        ) : (
                            <div className="join-galerie-previeImg placeholder-img"></div>
                        )}

                        <div className="gallery-header-wrapper">
                            <p className="gallery-owner">By {gallery.profiles.display_name}</p>
                            <h1 className="gallery-title">{gallery.title}</h1>

                            {gallery.description && (
                                <p className="gallery-descr">{gallery.description}</p>
                            )}
                        </div>

                        <div className="form-container">
                            <IonItem lines="none">
                                <IonInput
                                    placeholder="Name..."
                                    label="Name"
                                    labelPlacement="floating"
                                    value={anonName}
                                    required={true}
                                    type="text"
                                    onIonInput={(e) => setAnonName(e.detail.value!)}
                                />
                            </IonItem>

                            <IonButton expand="block" onClick={handleAnonLogin} shape="round"> Join Gallery </IonButton>
                            <IonText className="sign-txt">Have an account? <Link to='#' id="open-modal">Log in</Link></IonText>
                        </div>

                        {/* Modal for login */}
                        <IonModal
                            ref={modal}
                            trigger="open-modal"
                            breakpoints={[0, 0.6]}
                            initialBreakpoint={0.6}
                            className="action-modal"
                            backdropDismiss={true}
                            keepContentsMounted={false}
                            show-backdrop={true}
                            handleBehavior="cycle"
                            onWillPresent={async () => await menuController.close()}
                        >

                            <IonContent className="ion-padding">
                                <div className="ion-margin-top">
                                    <div className="form-container">
                                        <div className="action-modal-title">
                                            <p>Join with account</p>
                                        </div>
                                        <IonItem lines="none">
                                            <IonInput
                                                placeholder="Email..."
                                                labelPlacement="floating"
                                                value={email}
                                                required={true}
                                                type="email"
                                                onIonInput={(e) => setEmail(e.detail.value!)}
                                            >
                                                <div slot="label">Email<IonText>*</IonText></div>
                                            </IonInput>
                                        </IonItem>

                                        <IonItem lines="none">
                                            <IonInput
                                                placeholder="Password..."
                                                labelPlacement="floating"
                                                value={password}
                                                required={true}
                                                type="password"
                                                onIonInput={(e) => setPassword(e.detail.value!)}
                                            >
                                                <div slot="label">Password<IonText>*</IonText></div>
                                            </IonInput>
                                        </IonItem>
                                        <IonButton expand="block" onClick={handleLoginWithInviteCode} shape="round"> Sign In </IonButton>
                                    </div>
                                </div>
                            </IonContent>

                        </IonModal>

                    </div>

                ) : (
                    <p>No Gallery found</p>
                )}

            </IonContent>
        </IonPage>
    );
};

export default JoinGalleryPage;