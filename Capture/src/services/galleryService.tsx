import { Gallery } from '../models/Gallery';
import {supabase} from "../config/supabaseConfig";
import { getLoggedInUser } from '../services/authService';


//GET Gallery
export const getGalleries = async () => {
    try {
        const { data, error} = await supabase
            .from('galleries')
            .select('*');
        return data;
    } catch (err) {
        console.log(err)
    }
}

//POST Gallery
export const createGallery = async (gallery: Gallery, preview_image: File | null) => {
    console.log('Creating gallery:', gallery);
    console.log('title:', gallery.title);
    try {
        const previewImageUrl = await uploadPreviewImage(preview_image);
        if(!previewImageUrl){
            throw new Error('Fehler beim Hochladen des Bildes');
        }
        const { data, error } = await supabase
            .from('galleries')
            .insert([
                {
                    title: gallery.title,
                    description: gallery.description,
                    preview_image: previewImageUrl,
                    owner_id: gallery.owner_id,
                },
            ]);

        if (error) {
            throw error; // Fehler werfen, falls Supabase einen Fehler zurückgibt
        }

        console.log('Gallery created:', data); // Erfolgreich erstellte Galerie ausgeben
        return data; // Die erstellte Galerie zurückgeben
    } catch (err) {
        console.error('Fehler beim Erstellen der Galerie:', err);
        return null; // Im Fehlerfall null zurückgeben
    }
};

export const uploadPreviewImage = async (image: File | null) => {
    try {
        const userid = await getLoggedInUser(); 
        let imageUrl = null;

        if (image) {
            console.log('Uploading image:', image);
            console.log('userid image:', );
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('capture-images') // Name des Buckets
                .upload(`public/${userid}/${image.name}`, image, {
                    cacheControl: '3600',
                    upsert: false, // Überschreibt die Datei, falls sie existiert
                });
                
            if (uploadError) {
                console.error("Upload-Fehler:", uploadError);
                throw new Error(`Fehler beim Hochladen des Bildes: ${uploadError.message}`);
            }

            console.log("Upload erfolgreich:", uploadData);

            // Hole die öffentliche URL des hochgeladenen Bildes
            const { data } = supabase.storage
                .from('capture-images')
                .getPublicUrl(`public/${userid}/${image.name}`);

            imageUrl = data.publicUrl; // Zugriff auf die URL
        }
        return imageUrl;
    } catch (err) {
        console.error('Fehler beim Hochladen des Bildes:', err);
        return null; // Im Fehlerfall null zurückgeben
    }
};

//DELETE Gallery
export const deleteGallery = async (id: string) => {
    try {
        const { data, error } = await supabase
            .from('galleries')
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }

        console.log('Gallery deleted:', data);
        return data;
    } catch (err) {
        console.error('Error deleting gallery:', err);
        return null;
    }
}

//UPDATE Gallery
export const updateGallery = async (gallery: Gallery) => {
    try {
        const { data, error } = await supabase
            .from('galleries')
            .update({
                title: gallery.title,
                description: gallery.description,
            })
            .eq('id', gallery.id);

        if (error) {
            throw error;
        }

        console.log('Gallery updated:', data);
        return data;
    } catch (err) {
        console.error('Error updating gallery:', err);
        return null;
    }
}

