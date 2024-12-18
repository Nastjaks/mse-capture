import { supabase } from '../config/supabaseConfig';

//Regestrieren
export const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
};

//Einloggen
export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data;
};

//Ausloggen
export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

// Get logged-in User
export const getLoggedInUser = async () => {
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error) throw error; // Fehler werfen, falls etwas schiefgeht
    return user; // Benutzer-Objekt zurückgeben oder null, wenn niemand eingeloggt ist
};

