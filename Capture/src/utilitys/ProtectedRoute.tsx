import React from 'react';
import {Redirect, Route, RouteProps} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import {IonSpinner, useIonViewWillEnter} from '@ionic/react';

interface ProtectedRouteProps extends RouteProps {
    component: React.ComponentType<any>;
    redirectTo?: string;
    publicOnly?: boolean; // Neue Option für öffentliche Routen
    requireNonAnonymous?: boolean; // für nicht-anonyme Benutzer
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
                                                           component: Component,
                                                           redirectTo = '/signin',
                                                           publicOnly = false, // Standardmäßig ist es eine geschützte Route
                                                           requireNonAnonymous = false,
                                                           ...rest
                                                       }) => {
    const {isAuthenticated, currentUser, loading} = useAuth();

    return (
        <Route
            {...rest}
            render={(props) => {
                if (loading) {
                    // Ladeanzeige anzeigen, während Authentifizierungsstatus geprüft wird
                    return <IonSpinner className="customSpinner" name="crescent"></IonSpinner>;
                }

                if (publicOnly) {
                    // Öffentliche Route: Weiterleitung, wenn Benutzer eingeloggt ist
                    if (isAuthenticated) {
                        return <Redirect to="/profil"/>;
                    }
                    return <Component {...props} />;
                }

                // Zusätzliche Bedingung: Prüfen, ob der Benutzer anonym ist
                if (requireNonAnonymous && currentUser?.is_anonymous) {
                    return <Redirect to="/profil" />;
                }


                // Geschützte Route: Weiterleitung, wenn Benutzer nicht eingeloggt ist
                if (isAuthenticated) {
                    return <Component {...props} />;
                }
                return <Redirect to={redirectTo}/>;
            }}
        />
    );
};

export default ProtectedRoute;
