import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from "react";
import {getLoggedInUserId} from "../services/authService";
import { getUsersGalleries} from "../services/galleryService";
import GalleryListComponent from "../components/GalleryListComponent";
import { Gallery } from "../models/Gallery";
import {useHistory} from "react-router-dom";
import {useToast} from "../contexts/ToastContext";

const ProfilPage: React.FC = () => {
    const [user, setUser] = useState<string | undefined>(""); // Benutzer-ID speichern
    const [galleries, setGalleries] = useState<Gallery[]>([]); // Galerien des Benutzers

    const history = useHistory();
    const {showToast} = useToast();

    useEffect(() => {
        const fetchUserAndGalleries = async () => {
            const result_user = await getLoggedInUserId();

            if (result_user.success) {
                setUser(result_user.userId);
                const userGalleries = await getUsersGalleries(result_user.userId); // Benutzer-ID übergeben
                setGalleries(userGalleries); // Galerien setzen
            } else {
                showToast(result_user.message);
                history.push(`/signin`);
            }
        };
        fetchUserAndGalleries();
    }, []);

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
                        <IonTitle size="large">CAPTURE</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <h1>Nutzer: {user}</h1>
                <h1>Deine Galerien</h1>
                <GalleryListComponent galleries={galleries}/>
            </IonContent>
        </IonPage>
    );
};

export default ProfilPage;
