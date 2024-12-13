import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import {Auth} from "../components/auth.tsx"
import {db} from "../config/firebaseConfig";
import {useEffect, useState} from "react";
import {getDocs, collection} from 'firebase/firestore';

const Tab1: React.FC = () => {

    const [galleryList, setGalleryList] = useState([])

    const galleryCollectionRef = collection(db, "gallery");

    useEffect(() => {
        const getGalleryList = async () => {
            try {
                const data = await getDocs(galleryCollectionRef);
                const cleanData = data.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));

                console.log(cleanData);
                setGalleryList(cleanData);

            } catch (err) {
                console.error(err);
            }
        }

        getGalleryList();
    }, []);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Tab 1</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large"></IonTitle>
                    </IonToolbar>
                </IonHeader>
                <ExploreContainer name="Tab 1 page"/>
                <Auth/>
                <div>
                    {galleryList.map((gallery) =>
                    <div>
                        {gallery.titel}
                    </div>
                    )}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Tab1;
