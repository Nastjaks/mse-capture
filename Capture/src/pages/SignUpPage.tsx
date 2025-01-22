import {IonButton, IonContent, IonHeader, IonInput, IonItem, IonPage, IonText, IonTitle, IonToolbar, useIonViewWillEnter, useIonViewWillLeave} from '@ionic/react';
import {useEffect, useState} from "react";
import {signUp} from "../services/authService";
import {useToast} from "../contexts/ToastContext";
import {Link, useHistory} from "react-router-dom";
import {getRandomUserName} from "../utilitys/randomUsername";
import {useAuth} from "../contexts/AuthContext";

const SignUpPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");

    const {isAuthenticated, checkUser} = useAuth();
    const {showToast} = useToast();
    const history = useHistory();


    //Todo Validate input fields

    const handleSignUp = async () => {
        const finalUserName = userName || getRandomUserName(); //setzt einen Random namen
        try {
            const {success, message} = await signUp(email, password, finalUserName);
            if (success) {
                await checkUser();

                    //history.push(`/profil`); // Weiterleitung

            }
            showToast(message);
        } catch (err) {
            console.error(err);
            showToast(String(err));
        }
    };

    //Resetet die Felder wenn die View verlassen wird
    useIonViewWillLeave(() => {
        restFields();
    });

    useIonViewWillEnter(() => {
        console.log("Sign UP ", isAuthenticated );
    });

    const restFields = () => {
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
                        <IonItem>
                            <IonInput
                                placeholder="Anonymer Loris..."
                                labelPlacement="floating"
                                label="Name"
                                value={userName}
                                required={true}
                                type="text"
                                onIonChange={(e) => setUserName(e.detail.value!)}
                            >
                            </IonInput>
                        </IonItem>

                        <IonItem>
                            <IonInput
                                placeholder="Email..."
                                labelPlacement="floating"
                                label="Email*"
                                value={email}
                                required={true}
                                type="email"
                                onIonChange={(e) => setEmail(e.detail.value!)}
                            >
                            </IonInput>
                        </IonItem>

                        <IonItem>
                            <IonInput
                                placeholder="Password..."
                                labelPlacement="floating"
                                label="Password*"
                                value={password}
                                required={true}
                                type="password"
                                onIonChange={(e) => setPassword(e.detail.value!)}
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