import {User} from '@supabase/supabase-js';
import {supabase} from '../config/supabaseConfig';

interface AuthResponse {
    success: boolean;
    message: string;
    user?: User | null;
}

// ----- Regestrieren -----
export const signUp = async (email: string, password: string, displayName: string): Promise<AuthResponse> => {
    try {
        const {data: {user}, error} = await supabase.auth.signUp({email, password, options: {data: {display_name: displayName}}});
        if (error) {
            return {success: false, message: error.message};
        }
        return {success: true, message: 'Registration successful.', user: user};
    } catch (err) {
        console.error(err);
        return {success: false, message: 'Unexpected error.'};
    }
};

// ----- Einloggen -----
export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const {data: {user}, error} = await supabase.auth.signInWithPassword({email, password});
        if (error) {
            return {success: false, message: error.message};
        }
        return {success: true, message: 'Login successful.', user: user};
    } catch (err) {
        console.error(err);
        return {success: false, message: 'Unexpected error.'};
    }
};

// ----- Ausloggen -----
export const signOut = async (): Promise<AuthResponse> => {
    try {
        const {error} = await supabase.auth.signOut();
        if (error) {
            return {success: false, message: error.message};
        }
        return {success: true, message: 'Successfully logged out.'};
    } catch (err) {
        console.error(err);
        return {success: false, message: 'Unexpected error.'};
    }
};

// ----- Get logged-in User -----
export const getLoggedInUser = async (): Promise<AuthResponse> => {
    try {
        const {data: {user}, error} = await supabase.auth.getUser()
        if (error) {
            console.error(error);
            return {success: false, message: 'Authorization error. Please log in.', user: null};
        }
        return {success: true, message: '', user: user};
    } catch (err) {
        console.error(err);
        return {success: false, message: 'Unexpected error.', user: null};
    }
};

// ----- Update User -----
export const updateUser = async (name: string): Promise<AuthResponse> => {
    try {
        // Update the user data. (email, etc... possible too)
        const {data, error} = await supabase.auth.updateUser({
            data: {
                display_name: name,
            },
        });
        if (error) {
            console.error(error);
            return {
                success: false,
                message: "Error updating user data.",
                user: null,
            };
        }
        return {
            success: true,
            message: "User data updated successfully.",
            user: data.user,
        };
    } catch (err) {
        console.error(err);
        return {
            success: false,
            message: "Unexpected error.",
            user: null,
        };
    }
};

// ----- Anon Login -----
export const signInAnon = async (): Promise<AuthResponse> => {
    try {
        const {data, error} = await supabase.auth.signInAnonymously();
        if (error) {
            console.error('Error signing in anonymously:', error);
            return {success: false, message: 'Error signing in anonymously.', user: null};
        }
        if (data.user) {
            return {success: true, message: 'Anon logged in', user: data.user};
        }
        return {success: false, message: 'No user data found.', user: null};
    } catch (err) {
        console.error(err);
        return {success: false, message: 'Unexpected error.', user: null};
    }
};
