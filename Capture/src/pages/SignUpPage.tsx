import {IonButton, IonContent, IonHeader, IonInput, IonItem, IonPage, IonText, IonTitle, IonToolbar, useIonViewWillLeave} from '@ionic/react';
import {useState} from "react";
import {signUp} from "../services/authService";
import {useToast} from "../contexts/ToastContext";
import {Link, useHistory} from "react-router-dom";
import {getRandomUserName} from "../utilitys/randomUsername";

const SignUpPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");

    const history = useHistory();
    const {showToast} = useToast();

    //TODO wenn der nutzer schon eingelogt ist, soll es auf die Profiel seite umgeleitet werden
    //Todo Validate input fields

    const handleSignUp = async () => {

        const finalUserName = userName || getRandomUserName(); //setzt einen Random namen

        try {
            const {success, message} = await signUp(email, password, finalUserName);
            if (success) {
                history.push(`/profil`);
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

                    <h1 className="pageTitle">Sing up</h1>


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

                        <IonText>Have an account? <Link to={`/signin`}>Sign In</Link></IonText>
                    </div>
                </div>
            </IonContent>

        </IonPage>
    );
};

export default SignUpPage;