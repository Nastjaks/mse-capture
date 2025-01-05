import {Gallery} from '../models/Gallery';
import {supabase} from "../config/supabaseConfig";


// ---------- GET All Gallery ----------
export const getGalleries = async () => {
    try {
        const {data, error} = await supabase
            .from('galleries')
            .select('*');

        if (error) {
            throw error;
        }
        return data;
    } catch (err) {
        console.log(err)
    }
}

// ---------- GET all Users Galleries by UserID ----------
export const getUsersGalleries = async (userId) => {
    try {
        const {data, error} = await supabase
            .from('galleries')
            .select('*')
            .eq('owner_id', userId); // Hier wird nach der userId gefiltert

        if (error) {
            throw error;
        }
        return data;
    } catch (err) {
        console.log("Error fetching user's galleries:", err);
        return []; // Rückgabe eines leeren Arrays im Fehlerfall
    }
};

// ---------- GET a Gallerie by Id ----------
export const getGalleryById = async (galleryId: string) => {
    try {
        const {data, error} = await supabase
            .from('galleries')
            .select('*')
            .eq('id', galleryId)
            .single(); // Eine einzelne Galerie abrufen
        if (error) {
            throw error;
        }
        return data;
    } catch (err) {
        console.error("Fehler beim Abrufen der Galerie:", err);
        return null;
    }
};

// ---------- GET Gallery Images by Gallery ID ----------
export const getGalleryImages = async (galleryId: string) => {
    try {
        const {data, error} = await supabase
            .from('gallery_images')
            .select('*')
            .eq('gallery_id', galleryId);  // Filtere nach der gallery_id

        if (error) {
            console.error('Fehler beim Abrufen der Bilder:', error.message);
            throw error;
        }

        return data;  // Gibt die Bilder zurück
    } catch (err) {
        console.error('Fehler beim Abrufen der Galerie-Bilder:', err);
        return null;
    }
};

// ---------- CREATING A NEW GALLERY
export const createGallery = async (gallery: Gallery, preview_image: File | null) => {

    try {
        //Gallery erstellen
        const {data, error} = await supabase
            .from('galleries')
            .insert([
                {
                    title: gallery.title,
                    description: gallery.description,
                    owner_id: gallery.owner_id,
                },
            ]).select();

        if (error) {
            console.error('Error inserting gallery:', error.message);
            return {success: false, message: 'Error inserting gallery.', data: null};
        }

        if (data && data.length > 0) {
            const galleryId = data[0].id;
            if (preview_image != null) {
                //Vorschaubild hochladen in Storage
                const previewImageUrl = await insertPreviewImage(gallery.owner_id, galleryId, preview_image);
                if (previewImageUrl) {
                    //Vorschaubild url in Gallery ablegen
                    const updateResult = await updateGalleryPreviewImage(previewImageUrl, galleryId);
                    if (!updateResult) {
                        console.error("Failed to update gallery with preview image.");
                    }
                }
            }
            return {success: true, message: 'Successful created Album', data: data[0].id};
        } else {
            return {success: false, message: 'Unexpected error.', data: null};
        }
    } catch (err) {
        console.error('Unexpected error:', err);
        return {success: false, message: 'Unexpected error.', data: null};
    }
};


// Läd das prieview bild hoch
const insertPreviewImage = async (ownerID: string , gallerieID: string , preview_image: File) => {
    const folderPath = `public/${ownerID}/${gallerieID}/${preview_image?.name}`;

    try {
        // Läd das Preview Image in den Storage
            const {data: uploadData, error} = await supabase.storage
                .from('capture-images') // Name des Buckets
                .upload(folderPath, preview_image, {
                    cacheControl: '3600',
                    upsert: false, // Überschreibt die Datei, falls sie existiert
                });
            if (error) {
                console.error("Upload error:", error);
                throw new Error(`Failed to upload the preview image: ${error}`);
            }
            // Hole die öffentliche URL des hochgeladenen Bildes
            const {data: publicUrlData} = supabase.storage
                .from('capture-images')
                .getPublicUrl(folderPath); // Verwende den exakten Upload-Pfad
        return publicUrlData?.publicUrl || null;
    } catch (err) {
        console.error('Error uploading preview image:', err);
        return null; // Im Fehlerfall null zurückgeben
    }
}

// Packt die BildUrl zur Gallery
const updateGalleryPreviewImage = async (previewImageUrl: string , galleryID: string ):Promise<boolean> => {
    const {error} = await supabase
        .from('galleries')
        .update({preview_image: previewImageUrl}) // Vorschau-Bild-URL speichern
        .eq('id', galleryID); // Filter: Update nur die aktuelle Galerie
    if (error) {
        console.error('Error updating gallery with preview image URL:', error);
        return false;
    } else {
        return true;
    }
}


// ---------- Add a Image to a Gallerie
export const addImagesToGallery = async (galleryOwnerId: string, galleryId: string, image: File) => {
    if (!galleryOwnerId || !galleryId) {
        console.error("Owner ID oder Gallery ID fehlt");
        return null;
    }

    const folderPath = `public/${galleryOwnerId}/${galleryId}/${image.name}`;

    try {
        // Bild in den Storage hochladen
        const {data: uploadData, error: uploadError} = await supabase.storage
            .from('capture-images') // Name des Buckets
            .upload(folderPath, image, {
                cacheControl: '3600',
                upsert: false, // Verhindert das Überschreiben von Dateien mit demselben Namen
            });

        if (uploadError) {
            console.error("Upload-error:", uploadError);
            return { success: false, message: uploadError};
        }

        // Öffentliche URL des Bildes abrufen
        const {data: publicUrlData} = supabase.storage
            .from('capture-images')
            .getPublicUrl(folderPath);

        const imageUrl = publicUrlData?.publicUrl;
        if (!imageUrl) {
            console.error('Fehler beim Abrufen der Bild-URL.');
            throw new Error('Konnte die öffentliche URL des Bildes nicht abrufen.');
        }

        // Bild in der Datenbank speichern
        const {error: dbError} = await supabase
            .from('gallery_images')
            .insert([
                {
                    gallery_id: galleryId,
                    image_url: imageUrl,
                },
            ]);

        if (dbError) {
            console.error('Fehler beim Speichern des Bildes in der Datenbank:', dbError.message);
            throw new Error(`Fehler beim Speichern des Bildes: ${dbError.message}`);
        }

        return imageUrl;
    } catch (err) {
        console.error('Fehler beim Hinzufügen eines Bildes:', err);
        return null;
    }
};

//------------------------------------------------------------------------------------------------------

// ---------- DELETE Gallery //TODO DELETE THE IAMGES
export const deleteGallery = async (id: string) => {
    try {
        const {data, error} = await supabase
            .from('galleries')
            .delete()
            .eq('id', id);
        if (error) {
            throw error;
        }
        return { success: true, message: "Gallery has been deleted"};
    } catch (err) {
        console.error('Error deleting gallery:', err);
        return { success: false, message: err};
    }
}


