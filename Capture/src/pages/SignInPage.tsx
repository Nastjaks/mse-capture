import {IonButton, IonContent, IonInput, IonItem, IonPage, IonText, useIonViewWillEnter, useIonViewWillLeave} from '@ionic/react';
import {useState} from "react";
import {signIn} from "../services/authService";
import {useToast} from '../contexts/ToastContext';
import {Link, useHistory} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";

// Page to sign in
const SignInPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {checkUser} = useAuth();
    const {showToast} = useToast();
    const history = useHistory();

    const handleLogin = async () => {
        if (!email) {
            showToast("Email required");
            return;
        }

        if (!password) {
            showToast("Password required");
            return;
        }
        try {
            const {success, message} = await signIn(email, password);
            if (success) {
                await checkUser();
                history.push(`/profil`);
            }
            showToast(message);
        } catch (err) {
            console.error(err);
            showToast(String(err));
        }
    };

    useIonViewWillLeave(() => {
        resetFields();
    });

    const resetFields = () => {
        setEmail("");
        setPassword("");
    }

    return (
        <IonPage>
            <IonContent fullscreen={true} className="ion-padding">
                <div className="page-bottom">
                    <h1 className="pageTitle">SIGN IN</h1>

                    <div className="form-container">
                        <IonItem lines="none">
                            <IonInput
                                placeholder="Email..."
                                label="Email*"
                                labelPlacement="floating"
                                value={email}
                                required={true}
                                type="email"
                                onIonInput={(e) => setEmail(e.detail.value!)}
                            >
                            </IonInput>
                        </IonItem>

                        <IonItem lines="none">
                            <IonInput
                                placeholder="Password..."
                                labelPlacement="floating"
                                label="Password*"
                                value={password}
                                required={true}
                                type="password"
                                onIonInput={(e) => {
                                    setPassword(e.detail.value!)
                                }}
                            >
                            </IonInput>
                        </IonItem>
                        <IonButton expand="block" onClick={handleLogin} shape="round"> Sign In </IonButton>
                        <IonText className="sign-txt">Don't have an account? <Link to={`/signup`}>Sign up</Link></IonText>
                    </div>
                </div>
            </IonContent>

        </IonPage>
    );
};

export default SignInPage;