import {Redirect, Route} from 'react-router-dom';
import {
    IonApp,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
    setupIonicReact
} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';
import {logInOutline, imagesOutline, personOutline, addOutline} from 'ionicons/icons';
import SignInPage from './pages/SignInPage';
import GalleriesPage from './pages/GalleriesPage';
import CreateGalleryPage from './pages/CreateGalleryPage';
import ProfilPage from "./pages/ProfilPage";
import SignUpPage from "./pages/SignUpPage";
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
import GalleryDetailPage from "./pages/GalleryDetailPage";


setupIonicReact();

const App: React.FC = () => (
    <IonApp>
        <IonReactRouter>
            <IonTabs>
                <IonRouterOutlet>
                    {/* Standard-Route */}
                    <Route exact path="/">
                        <Redirect to="/tab2" />
                    </Route>

                    <Route exact path="/signin">
                        <SignInPage />
                    </Route>

                    <Route exact path="/signup">
                        <SignUpPage />
                    </Route>

                    <Route path="/galleries">
                        <GalleriesPage />
                    </Route>

                    <Route path="/create-gallery">
                        <CreateGalleryPage />
                    </Route>

                    <Route path="/profil">
                        <ProfilPage />
                    </Route>

                    {/* Galerie-Detailseite */}
                    <Route path="/gallery/:galleryId" component={GalleryDetailPage} />
                </IonRouterOutlet>

                {/* Tab Bar */}
                <IonTabBar slot="bottom">
                    <IonTabButton tab="signup" href="/signup">
                        <IonIcon aria-hidden="true" icon={logInOutline} />
                        <IonLabel>Sign Up</IonLabel>
                    </IonTabButton>

                    <IonTabButton tab="signin" href="/signin">
                        <IonIcon aria-hidden="true" icon={logInOutline} />
                        <IonLabel>Sign In</IonLabel>
                    </IonTabButton>

                    <IonTabButton tab="galleries" href="/galleries">
                        <IonIcon aria-hidden="true" icon={imagesOutline} />
                        <IonLabel>Galleries</IonLabel>
                    </IonTabButton>

                    <IonTabButton tab="create-gallery" href="/create-gallery">
                        <IonIcon aria-hidden="true" icon={addOutline} />
                        <IonLabel>Create Gallery</IonLabel>
                    </IonTabButton>

                    <IonTabButton tab="profil" href="/profil">
                        <IonIcon aria-hidden="true" icon={personOutline} />
                        <IonLabel>Profil</IonLabel>
                    </IonTabButton>
                </IonTabBar>
            </IonTabs>
        </IonReactRouter>
    </IonApp>
);

export default App;
