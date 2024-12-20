import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import {useState} from "react";
import {signIn} from "../services/authService";

const SignInPage: React.FC = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            await signIn(email, password);
            console.log("Login successful");
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

                <h1>Einloggen</h1>

                <div className="form-container">
                    <input placeholder="Email..." onChange={(e) => setEmail(e.target.value)}/>
                    <input placeholder="password..." type="password" onChange={(e) => setPassword(e.target.value)}/>
                    <button onClick={handleLogin}>SignIn</button>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default SignInPage;