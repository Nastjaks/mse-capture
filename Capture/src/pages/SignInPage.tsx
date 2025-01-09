import {IonButton, IonContent, IonHeader, IonInput, IonItem, IonPage, IonText, IonTitle, IonToolbar, useIonViewWillLeave} from '@ionic/react';
import {useState} from "react";
import {signIn} from "../services/authService";
import {useToast} from '../contexts/ToastContext';
import {Link, useHistory} from "react-router-dom";

const SignInPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const history = useHistory();
    const {showToast} = useToast();

    //TODO wenn der nutzer schon eingelogt ist, soll es auf die Profiel seite umgeleitet werden
    //Todo Validate input fields

    const handleLogin = async () => {

        try {
            const {success, message} = await signIn(email, password);
            if (success) {
                history.push(`/profil`);
            }
            showToast(message);
        } catch (err) {
            console.error(err);
            showToast(String(err));
        }
    };

    useIonViewWillLeave(() => {
        restFields();
    });


    const restFields = () => {
        setEmail("");
        setPassword("");
    }

    return (
        <IonPage>

            <IonHeader>
                <IonToolbar>
                    <IonTitle>CAPTURE</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen={true} className="ion-padding">
                <h1>Einloggen</h1>

                <div className="form-container">
                    <IonItem>
                        <IonInput
                            placeholder="Email..."
                            labelPlacement="floating"
                            value={email}
                            required={true}
                            type="email"
                            onIonChange={(e) => setEmail(e.detail.value!)}
                        >
                            <div slot="label">Email<IonText>*</IonText></div>
                        </IonInput>
                    </IonItem>

                    <IonItem>
                        <IonInput
                            placeholder="Password..."
                            labelPlacement="floating"
                            value={password}
                            required={true}
                            type="password"
                            onIonChange={(e) => setPassword(e.detail.value!)}
                        >
                            <div slot="label">Password<IonText>*</IonText></div>
                        </IonInput>
                    </IonItem>

                    <IonButton expand="block" onClick={handleLogin} shape="round"> Sign In </IonButton>

                    <IonText>Don't have an account? <Link to={`/signup`}>Sign up</Link></IonText>

                </div>
            </IonContent>

        </IonPage>
    );
};

export default SignInPage;