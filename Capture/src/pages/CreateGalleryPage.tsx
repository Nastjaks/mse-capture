import {IonButton, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonPage, IonText, IonTitle, IonToolbar, useIonViewWillEnter} from '@ionic/react';
import {useState} from "react";
import {useHistory} from 'react-router-dom';
import {createGallery} from "../services/galleryService";
import {Gallery} from "../models/Gallery";
import {useToast} from "../contexts/ToastContext";
import {imageOutline, trash} from 'ionicons/icons';
import {useAuth} from "../contexts/AuthContext";

const CreateGalleryPage: React.FC = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [preview_image, setPreviewImage] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

    const {showToast} = useToast();
    const {checkUser, currentUser, isAuthenticated} = useAuth();
    const history = useHistory();

    const handleCreateGallery = async () => {
        //Titel validieren
        if (!title.trim()) {
            showToast("The title is required.");
            return;
        }

        try {
            const owner_id = currentUser.id;
            const result_newGallery = await createGallery({title, description, owner_id} as Gallery, preview_image);

            if (result_newGallery.success) {
                restFields();
                history.push(`/gallery/${result_newGallery.data}`);
            }
            showToast(result_newGallery.message);

        } catch (err) {
            console.error(err);
            showToast(String(err));
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

    useIonViewWillEnter(() => {
        console.log("Create Gallery ", isAuthenticated );
    });


    return (
        <IonPage>

            <IonHeader>
                <IonToolbar>
                    <IonTitle>Create Gallery</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen={true} className="ion-padding">

                <div className="form-container">
                    <IonItem>
                        <IonInput
                            placeholder="Title..."
                            labelPlacement="floating"
                            label="Title*"
                            value={title}
                            type="text"
                            onIonInput={(e) => setTitle(e.detail.value!)}
                        >
                        </IonInput>
                    </IonItem>

                    <IonItem>
                        <IonInput
                            placeholder="Description..."
                            labelPlacement="floating"
                            label="Description"
                            value={description}
                            type="text"
                            onIonInput={(e) => setDescription(e.detail.value!)}
                        >
                        </IonInput>
                    </IonItem>

                    <span className="imgPickerLabel">
                        <p className="label tumb-label">Thumbnail</p>

                        {/* Bild entfernen */}
                        {imagePreviewUrl && (
                            <IonIcon
                                className="removeImage"
                                aria-hidden="true"
                                icon={trash}
                                onClick={() => {
                                    setPreviewImage(null);
                                    setImagePreviewUrl(null);
                                }}
                            />
                        )}

                    </span>

                    <input
                        type="file"
                        accept="image/*"
                        id="imagePreview_id"
                        hidden
                        onChange={handleFileChange}
                    />

                    <label
                        id="imagePreview_label"
                        htmlFor="imagePreview_id"
                        className={imagePreviewUrl ? "hasImg" : ""}
                        style={{
                            backgroundImage: imagePreviewUrl ? `url(${imagePreviewUrl})` : undefined,
                        }}
                    >
                            <span className="imagePicker">
                                <span>Choose Image</span>
                                <IonIcon aria-hidden="true" icon={imageOutline}/>
                            </span>
                    </label>

                    <IonButton expand="block" onClick={handleCreateGallery} shape="round">
                        Create Gallery
                    </IonButton>

                </div>
            </IonContent>

        </IonPage>
    );
};

export default CreateGalleryPage;