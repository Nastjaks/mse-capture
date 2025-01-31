import {IonContent, IonHeader, IonPage, IonRefresher, IonRefresherContent, IonText, IonTitle, IonToolbar, useIonViewWillEnter} from '@ionic/react';
import React, {useState} from 'react';
import {getSharedGalleries, getUsersGalleries} from '../services/galleryService';
import {Gallery} from "../models/Gallery";
import GalleryListComponent from "../components/GalleryListComponent";
import {useAuth} from "../contexts/AuthContext";

// Page to display the galleries of the user and the galleries the user has joined
const GalleriesPage: React.FC = () => {

    const [usersGalleries, setUsersGalleries] = useState<Gallery[]>([]);
    const [sharedGalleries, setSharedGalleries] = useState<Gallery[]>([]);
    const {currentUser} = useAuth();
    const [selectedSegment, setSelectedSegment] = useState("users-galleries");

    const fetchGalleries = async () => {
        const userGalleries = await getUsersGalleries(currentUser.id);
        setUsersGalleries(userGalleries);
        const userSharedGalleries = await getSharedGalleries(currentUser.id);
        setSharedGalleries(userSharedGalleries)
    };

    useIonViewWillEnter(() => {
        fetchGalleries();
    });

    const handleRefresh = async (event: CustomEvent) => {
        await fetchGalleries();
        event.detail.complete();
    };

    const handleSegmentChange = (value: string) => {
        setSelectedSegment(value);
    };

    return (
        <IonPage>

            <IonContent fullscreen={true} className="ion-padding">

                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Galleries</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent
                        pullingText="Pull to refresh"
                        refreshingText="Refreshing..."
                        refreshingSpinner="circles"
                    />
                </IonRefresher>

                <div className="custom-segment-container">
                    <div className="custom-segment-background" style={{transform: `translateX(${selectedSegment === 'users-shared-galleries' ? '100%' : '0'})`}}></div>
                    <div
                        className={`custom-segment-button ${selectedSegment === "users-galleries" ? "active" : ""}`}
                        onClick={() => handleSegmentChange("users-galleries")}>
                        <IonText>Yours</IonText>
                    </div>
                    <div
                        className={`custom-segment-button ${selectedSegment === "users-shared-galleries" ? "active" : ""}`}
                        onClick={() => handleSegmentChange("users-shared-galleries")}>
                        <IonText>Shared</IonText>
                    </div>
                </div>

                {selectedSegment === "users-galleries" && (
                    <div>
                        <GalleryListComponent galleries={usersGalleries}/>
                    </div>
                )}

                {selectedSegment === "users-shared-galleries" && (
                    <div>
                        <GalleryListComponent galleries={sharedGalleries}/>
                    </div>
                )}

            </IonContent>
        </IonPage>
    );
};

export default GalleriesPage;
