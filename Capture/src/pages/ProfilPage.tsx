import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from "react";
import { getLoggedInUser } from "../services/authService";
import {getGalleries, deleteGallery, getUsersGalleries} from "../services/galleryService";
import GalleryListComponent from "../components/GalleryListComponent";
import { Gallery } from "../models/Gallery";

const ProfilPage: React.FC = () => {
    const [user, setUser] = useState<string>(""); // Benutzer-ID speichern
    const [galleries, setGalleries] = useState<Gallery[]>([]); // Galerien des Benutzers

    useEffect(() => {
        const fetchUserAndGalleries = async () => {
            const loggedInUser = await getLoggedInUser();
            if (loggedInUser) {
                setUser(loggedInUser); // Benutzer-ID setzen
                const userGalleries = await getUsersGalleries(loggedInUser);
                setGalleries(userGalleries); // Galerien setzen
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
