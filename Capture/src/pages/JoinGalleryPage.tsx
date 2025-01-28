import {IonButton, IonContent, IonHeader, IonInput, IonItem, IonPage, IonText, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewWillEnter} from '@ionic/react';
import {useState} from 'react';
import {AddUserToGallery, getGalleryById} from '../services/galleryService';
import {Gallery} from "../models/Gallery";
import {useParams} from "react-router-dom";
import {useHistory} from "react-router";
import {signIn, signInAnon, signUp} from '../services/authService';
import {getLoggedInUser} from "../services/authService";
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { getRandomUserName } from '../utilitys/randomUsername';


const JoinGalleryPage: React.FC = () => {
    const [gallery, setGallery] = useState<Gallery | null>(null); // State für die Galerie
    const [anonName, setAnonName] = useState("");
    const history = useHistory();
    const {galleryId} = useParams<{ galleryId: string }>(); // Galerie-ID aus der URL extrahieren
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {showToast} = useToast();
    const {checkUser} = useAuth();

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


                        {gallery.preview_image && (
                            <img className="join-galerie-previeImg" src={gallery.preview_image}/>
                        )}


                        <h1>{gallery.title}</h1>
                        <h2>Owner: {gallery.profiles.display_name}</h2>
                        <p>{gallery.description}</p>

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
                        </div>


                        <div className="form-container">
                            <h1>Einloggen</h1>
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

                ) : (
                    <p>No Gallery found</p>
                )}


            </IonContent>
        </IonPage>
    );
};

export default JoinGalleryPage;