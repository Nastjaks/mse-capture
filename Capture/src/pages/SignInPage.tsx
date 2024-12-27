import {IonButton, IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import {useState} from "react";
import {signIn} from "../services/authService";
import {useToast} from '../contexts/ToastContext';
import {useHistory} from "react-router-dom";

const SignInPage: React.FC = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const history = useHistory();
    const {showToast} = useToast();

    const handleLogin = async () => {
        try {
            const result = await signIn(email, password);
            if (result.success) {
                history.push(`/profil`);
            }
            showToast(result.message);
        } catch (err) {
            console.error(err);
            showToast(err);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>CAPTURE</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large"></IonTitle>
                    </IonToolbar>
                </IonHeader>

                <h1>Einloggen</h1>

                <div className="form-container">
                    <IonInput
                        placeholder="Email..."
                        label="Email"
                        labelPlacement="floating"
                        value={email}
                        required={true}
                        type="email"
                        onIonChange={(e) => setEmail(e.detail.value!)}
                    />

                    <IonInput
                        placeholder="Password..."
                        label="password"
                        labelPlacement="floating"
                        value={password}
                        required={true}
                        type="password"
                        onIonChange={(e) => setPassword(e.detail.value!)}
                    />

                    <IonButton expand="block" onClick={handleLogin} shape="round"> SignIn </IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default SignInPage;