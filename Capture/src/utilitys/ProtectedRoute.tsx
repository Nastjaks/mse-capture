import React from 'react';
import {Redirect, Route, RouteProps} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import {IonSpinner, useIonViewWillEnter} from '@ionic/react';

interface ProtectedRouteProps extends RouteProps {
    component: React.ComponentType<any>;
    redirectTo?: string;
    publicOnly?: boolean; // Neue Option für öffentliche Routen
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
                                                           component: Component,
                                                           redirectTo = '/signin',
                                                           publicOnly = false, // Standardmäßig ist es eine geschützte Route
                                                           ...rest
                                                       }) => {
    const {isAuthenticated, loading} = useAuth();

    useIonViewWillEnter(() => {
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa " + isAuthenticated);
    });


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
