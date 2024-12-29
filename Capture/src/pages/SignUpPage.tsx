import {IonButton, IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import {useState} from "react";
import {signUp} from "../services/authService";
import {useToast} from "../contexts/ToastContext";
import {useHistory} from "react-router-dom";

const SignUpPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const history = useHistory();
    const {showToast} = useToast();

    const handleSignUp = async () => {
        try {
            const result = await signUp(email, password);
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

            <IonContent fullscreen={true} className="ion-padding">
                <h1>Account erstellen</h1>

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

                    <IonButton expand="block" onClick={handleSignUp} shape="round"> SignUp </IonButton>

                </div>
            </IonContent>

        </IonPage>
    );
};

export default SignUpPage;