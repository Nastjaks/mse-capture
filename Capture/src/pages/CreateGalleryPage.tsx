import {IonButton, IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import {useState} from "react";
import {useHistory} from 'react-router-dom'; // Importieren von useHistory
import {getLoggedInUserId} from "../services/authService";
import {createGallery} from "../services/galleryService";
import {Gallery} from "../models/Gallery";
import {useToast} from "../contexts/ToastContext";

const CreateGalleryPage: React.FC = () => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [preview_image, setPreviewImage] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

    const history = useHistory();
    const {showToast} = useToast();

    const handleCreateGallery = async () => {
        //Titel validieren
        if (!title.trim()) {
            showToast("The title is required.");
            return;
        }

        try {
            const result_user = await getLoggedInUserId();

            if (result_user.success) {
                const owner_id = result_user.userId
                const result_newGallery = await createGallery({title, description, owner_id} as Gallery, preview_image);

                if (result_newGallery.success) {
                    restFields();
                    history.push(`/gallery/${result_newGallery.data}`);
                }
                showToast(result_newGallery.message);
            } else {
                showToast(result_user.message);
                restFields();
                history.push(`/signin`);
            }
        } catch (err) {
            console.error(err);
            showToast(err);
        }
    };

    const restFields = () => {
        setTitle("");
        setDescription("");
        setPreviewImage(null);
        setImagePreviewUrl(null);
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];

            // Validierung der Dateigröße (max. 2 MB)
            if (file.size > 2 * 1024 * 1024) {
                showToast("The file must not be larger than 2 MB.");
                return;
            }

            setPreviewImage(file);

            // Bildvorschau generieren
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
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
                    <IonInput
                        placeholder="Titel..."
                        label="Titel"
                        labelPlacement="floating"
                        value={title}
                        required={true}
                        type="text"
                        onIonChange={(e) => setTitle(e.detail.value!)}
                    />
                    <IonInput
                        placeholder="Beschreibung..."
                        label="Beschreibung"
                        labelPlacement="floating"
                        value={description}
                        type="text"
                        onIonChange={(e) => setDescription(e.detail.value!)}
                    />

                    <p className="label">Vorschaubild</p>

                    {/* Bildvorschau */}
                    {imagePreviewUrl && (
                        <div className="image-preview">
                            <img src={imagePreviewUrl} alt="Preview"/>
                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />

                    <IonButton expand="block" onClick={handleCreateGallery} shape="round">
                        Create Gallery
                    </IonButton>

                </div>
            </IonContent>
        </IonPage>
    );
};

export default CreateGalleryPage;