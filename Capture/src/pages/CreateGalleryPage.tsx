import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import {useState} from "react";
import {getLoggedInUser} from "../services/authService";
import {createGallery} from "../services/galleryService";
import {Gallery} from "../models/Gallery";
import './CreateGallery.css';

const CreateGalleryPage: React.FC = () => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [preview_image, setPreviewImage] = useState<File | null>(null);

    const handleAddGallery = async () => {
        try {
            const owner_id = await getLoggedInUser();
            await createGallery({title, description, owner_id} as Gallery, preview_image);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setPreviewImage(event.target.files[0]);
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
                        <IonTitle size="large">Create Gallery</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <h1>Album erstellen</h1>

                <div className="form-container">
                    <input
                        placeholder="Title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        placeholder="Description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <input type="file" accept="image/*" onChange={handleFileChange}/>

                    <button onClick={handleAddGallery}>Add Gallery</button>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default CreateGalleryPage;