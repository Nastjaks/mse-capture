import {IonButton, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonModal, IonPage, IonText, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewWillEnter} from '@ionic/react';
import React, {useRef, useState} from 'react';
import {AddUserToGallery, getGalleryById} from '../services/galleryService';
import {Gallery} from "../models/Gallery";
import {Link, useParams} from "react-router-dom";
import {useHistory} from "react-router";
import {signIn, signUp} from '../services/authService';
import {getLoggedInUser} from "../services/authService";
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { getRandomUserName } from '../utilitys/randomUsername';
import {menuController} from "@ionic/core/components";


const JoinGalleryPage: React.FC = () => {
    const [gallery, setGallery] = useState<Gallery | null>(null); // State für die Galerie
    const [anonName, setAnonName] = useState("");
    const history = useHistory();
    const {galleryId} = useParams<{ galleryId: string }>(); // Galerie-ID aus der URL extrahieren
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {showToast} = useToast();
    const {checkUser} = useAuth();

    const modal = useRef<HTMLIonModalElement>(null);

    useIonViewWillEnter(() => {
        fetchGallery();
    });

    // Galerie-Daten basierend auf der ID laden
    /*useEffect(() => {
        const fetchGallery = async () => {
            if (galleryId) {
                const result_galleryData = await getGalleryById(galleryId); // Funktion zum Abrufen der Galerie
                if (result_galleryData) {
                    setGallery(result_galleryData);
                }
                const userResponse = await getLoggedInUserId();
                if (userResponse.success && userResponse.user) {
                    console.log("U123123124ser:", userResponse.user);
                    AddUserToGallery(galleryId, userResponse.user?.id);
                    history.push(`/gallery/${galleryId}`);
                }
            }
        };

        fetchGallery();
    }, [galleryId]);*/

    const fetchGallery = async () => {
        if (galleryId) {
            const result_galleryData = await getGalleryById(galleryId); // Funktion zum Abrufen der Galerie
            if (result_galleryData) {
                setGallery(result_galleryData.gallery_data);
            }
            const userResponse = await getLoggedInUser();
            if (userResponse.success && userResponse.user) {
                AddUserToGallery(galleryId, userResponse.user?.id);
                history.push(`/gallery/${galleryId}`);
                showToast("Joined gallery!");
            }
        }
    };

    const handleAnonLogin = async () => {
        const user = await signUp("", "", anonName);
        if (user.success && gallery && user.user) {
            const checkUserResponse = await checkUser();
            if (checkUserResponse) {
                AddUserToGallery(gallery.id, user.user?.id);
                history.push(`/gallery/${gallery.id}`);
            } else {    
                showToast("Failed to join gallery");
            }
            history.push(`/gallery/${gallery.id}`);
        }
        console.log("User:", user);
    };

    const handleLoginWithInviteCode = async () => {
        try {
            const result = await signIn(email, password);
            if (result.success && gallery && result.user) {
                const checkUserResponse = await checkUser();
                if (checkUserResponse) {
                    AddUserToGallery(gallery.id, result.user?.id, );
                    history.push(`/gallery/${gallery.id}`);
                    showToast("Joined gallery!");
                } else {
                    showToast("Failed to join gallery");
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <IonPage>

            <IonHeader>
                <IonToolbar>
                    <IonTitle>CAPTURE</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="ion-padding">

                {gallery ? (
                    <div>

                        {gallery.preview_image ? (
                            <img className="join-galerie-previeImg" src={gallery.preview_image}/>
                        ) : (
                            <img className="join-galerie-previeImg placeholder-img" src="https://images.unsplash.com/photo-1638438134099-a91e5373aaf0?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="placeholder" className="gallery-image"/>
                        )}

                        <div className="gallery-header-wrapper">
                            <p className="gallery-owner">By {gallery.profiles.display_name}</p>
                            <h1 className="gallery-title">{gallery.title}</h1>

                            {gallery.description && (
                                <p className="gallery-descr">{gallery.description}</p>
                            )}
                        </div>

                        <div className="form-container">
                            <IonItem>
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

                            <IonText className="sign-txt">Have an account? <Link  button id="open-modal">Log in</Link></IonText>

                        </div>


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
                                        <IonItem>
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

                                        <IonItem>
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