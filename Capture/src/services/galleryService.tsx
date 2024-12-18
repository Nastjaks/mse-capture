import { Gallery } from '../models/Gallery';
import {supabase} from "../config/supabaseConfig";


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
export const createGallery = async (gallery: Gallery) => {
    try {
        const { data, error } = await supabase
            .from('galleries')
            .insert([
                {
                    title: gallery.title,
                    description: gallery.description,
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

//DELETE Gallery

//UPDATE Gallery

