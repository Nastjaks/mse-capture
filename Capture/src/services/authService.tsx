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
        data: { session },
        error,
    } = await supabase.auth.getSession();

    if (error) throw error; // Fehler werfen, falls etwas schiefgeht
    console.log("grrrrrrrrrr: " + session?.user.id);
    return session?.user.id; // Benutzer-Objekt zurückgeben oder null, wenn niemand eingeloggt ist
};

