import {IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import {signOut} from "../services/authService";
import {useHistory} from "react-router-dom";
import {useToast} from "../contexts/ToastContext";

const LogOutPage: React.FC = () => {

    const history = useHistory();
    const {showToast} = useToast();

    const handleLoginOut = async () => {
        try {
            const result = await signOut();
            if (result.success) {
                history.push(`/signin`);
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
                <h1>Logout</h1>

                <div className="form-container">
                    <IonButton expand="block" onClick={handleLoginOut} shape="round"> LogOut </IonButton>
                </div>
            </IonContent>

        </IonPage>
    );
};

export default LogOutPage;