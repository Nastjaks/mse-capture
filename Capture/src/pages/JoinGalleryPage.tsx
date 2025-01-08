import {IonButton, IonContent, IonHeader, IonInput, IonItem, IonPage, IonText, IonTitle, IonToolbar} from '@ionic/react';
import {useEffect, useState} from 'react';
import {AddUserToGallery, getGalleryById} from '../services/galleryService';
import {Gallery} from "../models/Gallery";
import {Link, useParams} from "react-router-dom";
import {useHistory} from "react-router";
import {signIn, signInAnon} from '../services/authService';
import {getLoggedInUserId} from "../services/authService";


const JoinGalleryPage: React.FC = () => {
    const [gallery, setGallery] = useState<Gallery | null>(null); // State für die Galerie
    const [name, setName] = useState("");
    const history = useHistory();
    const {galleryId} = useParams<{ galleryId: string }>(); // Galerie-ID aus der URL extrahieren
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    // Galerie-Daten basierend auf der ID laden
    useEffect(() => {
        const fetchGallery = async () => {
            if (galleryId) {
                const result_galleryData = await getGalleryById(galleryId); // Funktion zum Abrufen der Galerie
                if (result_galleryData) {
                    setGallery(result_galleryData);
                }
                const userResponse = await getLoggedInUserId();
                if(userResponse.success){
                    history.push(`/gallery/${galleryId}`);
                }
            }
        };
    
        fetchGallery();
    }, [galleryId]);

    const onButtonClick = async () => {
        const user = await signInAnon();
        if (user.success) {
            if (gallery) {
                history.push(`/gallery/${gallery.id}`);
            }
        }
        console.log("User:", user);
    };

    const handleLoginWithInviteCode = async () => {
        try {
            const result = await signIn(email, password);
            if (result.success && gallery && result.user) {
                AddUserToGallery(gallery.id, result.user?.id);
                history.push(`/gallery/${gallery.id}`);
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
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large"></IonTitle>
                    </IonToolbar>
                </IonHeader>

                <div className="form-container">
                {gallery ? (
                        <div>
                            <div className="galerie-header">
                                <h1>{gallery.title}</h1>
                                <h2>Galerie: {gallery.id}</h2>
                                <h2>Owner: {gallery.owner_id}</h2>
                                {gallery.preview_image && (
                                    <img className="galerie-previeImg" src={gallery.preview_image}/>
                                )}
                            </div>

                            <p>{gallery.description}</p>

                            <IonInput
                                placeholder="Ananastasia stinkt..."
                                label="Name"
                                labelPlacement="floating"
                                value={name}
                                required={true}
                                type="text"
                                onIonChange={(e) => setName(e.detail.value!)}
                            />

                            <IonButton expand="block" onClick={onButtonClick} shape="round"> Join Gallery </IonButton>
                        </div>
                    ) : (
                        <p>Ananastasia hat keine Gallerie hierfür erstellt...</p>
                    )}
                </div>
                <h1>Einloggen</h1>

                <div className="form-container">
                    <IonItem>
                        <IonInput
                            placeholder="Email..."
                            labelPlacement="floating"
                            value={email}
                            required={true}
                            type="email"
                            onIonChange={(e) => setEmail(e.detail.value!)}
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
                            onIonChange={(e) => setPassword(e.detail.value!)}
                        >
                            <div slot="label">Password<IonText>*</IonText></div>
                        </IonInput>
                    </IonItem>
                    <IonButton expand="block" onClick={handleLoginWithInviteCode} shape="round"> Sign In </IonButton>
                </div>

            </IonContent>
        </IonPage>
    );
};

export default JoinGalleryPage;