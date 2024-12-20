import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import {useState} from "react";
import {signUp} from "../services/authService";

const SignUpPage: React.FC = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try {
            await signUp(email, password);
        } catch (err) {
            console.error(err);
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

                <h1>Account erstellen</h1>
                <div className="form-container">
                    <input placeholder="Email..." onChange={(e) => setEmail(e.target.value)}/>
                    <input placeholder="password..." type="password" onChange={(e) => setPassword(e.target.value)}/>
                    <button onClick={handleRegister}>SignUp</button>

                </div>

            </IonContent>
        </IonPage>
    );
};

export default SignUpPage;