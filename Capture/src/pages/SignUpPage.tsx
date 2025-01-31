import {IonButton, IonContent, IonInput, IonItem, IonPage, IonText, useIonViewWillLeave} from '@ionic/react';
import {useState} from "react";
import {signUp} from "../services/authService";
import {useToast} from "../contexts/ToastContext";
import {Link, useHistory} from "react-router-dom";
import {getRandomUserName} from "../utilitys/randomUsername";
import {useAuth} from "../contexts/AuthContext";

// Page to sign up
const SignUpPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");

    const {checkUser} = useAuth();
    const {showToast} = useToast();


    const handleSignUp = async () => {
        if (!email) {
            showToast("Email required");
            return;
        }
        if (!password) {
            showToast("Password required");
            return;
        }
        const finalUserName = userName || getRandomUserName();
        try {
            const {success, message} = await signUp(email, password, finalUserName);
            if (success) {
                await checkUser();
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
        setUserName("");
    }

    return (
        <IonPage>
            <IonContent fullscreen={true} className="ion-padding">
                <div className="page-bottom">
                    <div className="header-wrapper">
                        <div className="header-top">
                        </div>
                    </div>

                    <h1 className="pageTitle">Sign up</h1>

                    <div className="form-container">
                        <IonItem lines="none">
                            <IonInput
                                placeholder="Anonymer Loris..."
                                labelPlacement="floating"
                                label="Name"
                                value={userName}
                                required={true}
                                type="text"
                                onIonInput={(e) => setUserName(e.detail.value!)}
                            >
                            </IonInput>
                        </IonItem>

                        <IonItem lines="none">
                            <IonInput
                                placeholder="Email..."
                                labelPlacement="floating"
                                label="Email*"
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
                                onIonInput={(e) => setPassword(e.detail.value!)}
                            >
                            </IonInput>
                        </IonItem>
                        <IonButton expand="block" onClick={handleSignUp} shape="round"> Sign Up </IonButton>
                        <IonText className="sign-txt">Have an account? <Link to={`/signin`}>Sign In</Link></IonText>
                    </div>
                </div>
            </IonContent>

        </IonPage>
    );
};

export default SignUpPage;