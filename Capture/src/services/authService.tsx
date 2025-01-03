import {supabase} from '../config/supabaseConfig';

interface AuthResponse {
    success: boolean;
    message: string;
    userId?: string;
}

// ----- Regestrieren -----
export const signUp = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const {error} = await supabase.auth.signUp({email, password});
        if (error) {
            return { success: false, message: error.message};
        }
        return { success: true, message: 'Registration successful.'};
    } catch (err) {
        console.error(err);
        return { success: false, message: 'Unexpected error.'};
    }
};

// ----- Einloggen -----
export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const {error} = await supabase.auth.signInWithPassword({email, password});
        if (error) {
            return { success: false, message: error.message};
        }
        return { success: true, message: 'Login successful.'};
    } catch (err){
        console.error(err);
        return { success: false, message: 'Unexpected error.'};
    }
};

// ----- Ausloggen -----
export const signOut = async (): Promise<AuthResponse> => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            return { success: false, message: error.message};
        }
        return { success: true, message: 'Successfully logged out.'};
    } catch (err) {
        console.error(err);
        return { success: false, message: 'Unexpected error.'};
    }
};

// ----- Get ID of logged-in User -----
export const getLoggedInUserId = async (): Promise<AuthResponse> => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error){
            console.error(error);
            return { success: false, message: 'Authorization error. Please log in.', userId: ""};
        }
        return { success: true, message: '', userId: user?.id};
    } catch (err){
        console.error(err);
        return { success: false, message: 'Unexpected error.', userId: ""};
    }
};

// ----- Anon Login -----
export const signInAnon = async (): Promise<AuthResponse> => {
    try {
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) {
            console.error('Error signing in anonymously:', error);
            return { success: false, message: 'Error signing in anonymously.', userId: ""};
        }
        if (data.user) {
            return { success: true, message: 'Anon logged in', userId: data.user.id};
        }
        return { success: false, message: 'No user data found.', userId: ""};
    } catch (err) {
        console.error(err);
        return { success: false, message: 'Unexpected error.', userId: ""};
    }
};