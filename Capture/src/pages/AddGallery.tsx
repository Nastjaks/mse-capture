import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { useState } from 'react';
import { createGallery } from '../services/galleryService';
import { Gallery } from '../models/Gallery';
import { get } from 'http';
import { getLoggedInUser } from '../services/authService';

export const AddGallery = () =>{

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [preview_image, setImage] = useState<File | null>(null);
    
    const handleAddGallery = async () => {
        try {
            const owner_id = await getLoggedInUser();
            console.log("ananas: " + owner_id);
            await createGallery({title, description, owner_id} as Gallery, preview_image);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
          setImage(event.target.files[0]);
        }
      };


    return (
        <div>
            <input placeholder="Title..."
                   onChange={(e) => setTitle(e.target.value)}
            />

            <input placeholder="Description..."
                   onChange={(e) => setDescription(e.target.value)}
            />

            <input type="file" accept="image/*" onChange={handleFileChange} />
            
            <br/>
            <button onClick={handleAddGallery}>Add Gallery</button>

        </div>
    );


}