import {supabase} from "../config/supabaseConfig";

export const getTasks = async (galleryId: string) => {

    let { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('gallery_id', galleryId)
    if (error) {
        console.error('Fehler beim Abrufen der Aufgaben:', error);
        throw error;
    }
    return tasks;
};

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



export const editTask = async () => {
    //TODO
}