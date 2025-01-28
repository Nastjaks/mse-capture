import {supabase} from "../config/supabaseConfig";

/* -- Create a Task -- */
export const createTask = async (task: string, galleryId: string) => {
    const { data: tasks, error } = await supabase
        .from('tasks')
        .insert([{ task, gallery_id: galleryId }]);

    if (error) {
        console.error('Fehler beim Erstellen der Aufgabe:', error);
        throw error;
    }
    return true;
};


/* -- Get all Tasks and images id of uploadet images by user-- */
export const getTasks = async (galleryId: string, currentUserId: string) => {

    const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*, gallery_images (owner_id)')
        .eq('gallery_id', galleryId)
        .eq('gallery_images.owner_id', currentUserId)
    if (error) {
        console.error('Fehler beim Abrufen der Aufgaben:', error);
        throw error;
    }
    console.log(tasks);
    return tasks;
};


/* -- Get specific Task -- */
export const getTaskById = async (taskId: string) => {
    const { data: task, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();
    if (error) {
        console.error('Fehler beim Abrufen der Aufgaben:', error);
        throw error;
    }
    return task;
}


/* -- Delete Task -- */
export const deleteTask = async (taskId: string) => {
    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

    if (error) {
        console.error('Fehler beim Löschen der Aufgabe:', error);
        throw error;
    }
    return true;
};


/* -- Get Images of a Task -- */
export const getTaksImages = async (taskId: string) => {
    try {
        const {data, error} = await supabase
            .from('gallery_images')
            .select('*,  tasks (task), profiles(display_name)', )
            .eq('task_id', taskId);  // Filtere nach der gallery_id

        if (error) {
            console.error('Fehler beim Abrufen der Bilder:', error.message);
            throw error;
        }

        return data;  // Gibt die Bilder zurück
    } catch (err) {
        console.error('Fehler beim Abrufen der Galerie-Bilder:', err);
        return null;
    }
}


/* -- Upload a Image to a Task -- */
export const uploadImageToTask = async (galleryOwnerId: string, galleryId: string, image: File, taskId: string) => {
    if (!galleryOwnerId || !galleryId) {
        console.error("Owner ID oder Gallery ID fehlt");
        return null;
    }

    const modifiedImage = new File([image], image.name.replace(/\s/g, '_'), { type: image.type });
    const folderPath = `public/${galleryOwnerId}/${galleryId}/${modifiedImage.name}`;

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
                    task_id: taskId,
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




