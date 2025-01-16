import React from "react";
import {Route, useLocation} from 'react-router-dom';
import {IonApp, IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';
import {logInOutline, imagesOutline, personOutline, addOutline} from 'ionicons/icons';
import { match } from 'path-to-regexp';

/* PAGES */
import SignInPage from './pages/SignInPage';
import GalleriesPage from './pages/GalleriesPage';
import CreateGalleryPage from './pages/CreateGalleryPage';
import ProfilPage from "./pages/ProfilPage";
import SignUpPage from "./pages/SignUpPage";
import GalleryDetailPage from "./pages/GalleryDetailPage";
import JoinGalleryPage from './pages/JoinGalleryPage';
import TaskPage from './pages/TaskPage';

/* Context */
import {ToastProvider} from './contexts/ToastContext';
import {AuthProvider} from "./contexts/AuthContext";
import ProtectedRoute from "./utilitys/ProtectedRoute";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';


setupIonicReact();

const AppContent: React.FC = () => {
    const location = useLocation();

    // Liste der Routen, auf denen die Tabbar angezeigt werden soll
    const showTabBarRoutes = [
        '/profil',
        '/galleries',
        '/create-gallery',
        '/gallery/:galleryId',
        '/gallery/:galleryId/:taskId'
    ];

    const showTabBar = showTabBarRoutes.some((route) => {
        const matchFn = match(route, { decode: decodeURIComponent });
        return matchFn(location.pathname);
    });


    return (
        <IonTabs>
            <IonRouterOutlet animated={false}>

                {/*<Route exact path="/signin" component={SignInPage}/>
                    <Route exact path="/signup" component={SignUpPage}/>
                    <Route exact path="/profil" component={ProfilPage} />
                    <Route exact path="/galleries" component={GalleriesPage}/>
                    <Route exact path="/create-gallery" component={CreateGalleryPage}/>
                    <Route exact path="/gallery/:galleryId" component={GalleryDetailPage}/>
                    <Route exact path="/gallery/:galleryId/:taskId" component={TaskPage}/>*/}

                <ProtectedRoute exact path="/" component={SignInPage} publicOnly/>
                <ProtectedRoute exact path="/signin" component={SignInPage} publicOnly/>
                <ProtectedRoute exact path="/signup" component={SignUpPage} publicOnly/>

                <ProtectedRoute exact path="/profil" component={ProfilPage}/>
                <ProtectedRoute exact path="/create-gallery" component={CreateGalleryPage}/>
                <ProtectedRoute exact path="/galleries" component={GalleriesPage}/>

                {/*TODO Sonder fall*/}
                <Route exact path="/join-gallery/:galleryId" component={JoinGalleryPage}/>
                <ProtectedRoute exact path="/gallery/:galleryId" component={GalleryDetailPage}/>
                <ProtectedRoute exact path="/gallery/:galleryId/:taskId" component={TaskPage}/>
            </IonRouterOutlet>

            {showTabBar && (
                <IonTabBar slot="bottom">
                    {/*
                    <IonTabButton tab="signin" href="/signin">
                        <IonIcon aria-hidden="true" icon={logInOutline}/>
                    </IonTabButton>
                    */}
                    <IonTabButton tab="galleries" href="/galleries">
                        <IonIcon aria-hidden="true" icon={imagesOutline}/>
                    </IonTabButton>
                    <IonTabButton tab="create-gallery" href="/create-gallery">
                        <IonIcon aria-hidden="true" icon={addOutline}/>
                    </IonTabButton>
                    <IonTabButton tab="profil" href="/profil">
                        <IonIcon aria-hidden="true" icon={personOutline}/>
                    </IonTabButton>
                </IonTabBar>
            )}
        </IonTabs>
    );
};

const App: React.FC = () => (
    <IonApp>
        <AuthProvider>
            <ToastProvider>
                <IonReactRouter>
                    <AppContent/>
                </IonReactRouter>
            </ToastProvider>
        </AuthProvider>
    </IonApp>
);

export default App;