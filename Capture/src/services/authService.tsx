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


// Prüfen, ob ein Benutzer eingeloggt ist
export const isLoggedIn = async () => {
    const {
        data: { session },
        error,
    } = await supabase.auth.getSession();

    if (error) throw error;

    return !!session; // Gibt `true` zurück, wenn eine Sitzung existiert
};



// Get logged-in User
export const getLoggedInUser = async () => {
    const {
        data: { session },
        error,
    } = await supabase.auth.getSession();

    if (error) throw error; // Fehler werfen, falls etwas schiefgeht

    if (!session || !session.user) {
        throw new Error("Kein Benutzer eingeloggt");
    }

    console.log("Benutzer-ID:", session.user.id);
    return session.user.id; // Vollständiges Benutzerobjekt zurückgeben
};