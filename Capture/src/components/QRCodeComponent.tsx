import React, {useEffect, useState} from "react";
import {IonButton, IonContent, IonIcon, IonModal} from "@ionic/react";
import * as QRCode from "qrcode";
import {useToast} from "../contexts/ToastContext";
import {copySharp, download, shareOutline} from "ionicons/icons";
import {menuController} from "@ionic/core/components";

interface QRCodeComponentProps {
    galleryId: string;
    istShareOpen: boolean;
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({galleryId, istShareOpen}) => {
    const [qrCodeData, setQrCodeData] = useState<string | null>(null);
    const {showToast} = useToast();

    useEffect(() => {
        const generateQRCode = async () => {
            try {
                const qrCodeUrl = `$capture-mse.netlify.app/${galleryId}`;
                const qrCode = await QRCode.toDataURL(qrCodeUrl);
                setQrCodeData(qrCode);
            } catch (err) {
                console.error("Fehler beim Generieren des QR-Codes:", err);
            }
        };
        generateQRCode();
    }, [galleryId]);

    //Download the QR-Code Image
    const downloadFile = (url: string, fileName: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
    };

    //Copy the Gallerylink to Clipboard
    const copyToClipboard = async (link: string) => {
        try {
            await navigator.clipboard.writeText(link);
            showToast("Copied to clipboard.");
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    return (

        <IonModal
            isOpen={istShareOpen}
            breakpoints={[0, 0.55]}
            initialBreakpoint={0.55}
            className="share-modal action-modal"
            backdropDismiss={true}
            keepContentsMounted={false}
            show-backdrop={true}
            handleBehavior="cycle"
            onWillPresent={async () => await menuController.close()}
        >

            <IonContent className="ion-padding">
                <div className="ion-margin-top">
                    <div className="qr-code-container">
                        {qrCodeData ? (
                            <>
                                <div className="action-modal-title qr-image-top">
                                    <p>Invite your friends</p>
                                    <IonButton shape="round" onClick={() => copyToClipboard("capture-mse.netlify.app//join-gallery/" + galleryId)}> <IonIcon aria-hidden="true" icon={copySharp}/>Copy Link</IonButton>
                                </div>

                                <div className="qr-image-content">
                                    <div>
                                        <p>The QR code <br/>for this gallery</p>
                                        <p>Scan to join</p>
                                        <IonButton shape="round" onClick={() => downloadFile(qrCodeData!, "qrcode.png")}> <IonIcon aria-hidden="true" icon={download}/>Download</IonButton>
                                    </div>
                                    <div className="qr-image-wrapper">
                                        <img src={qrCodeData} alt="QR Code" className="qr-code-image"/>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p>QR-Code wird generiert...</p>
                        )}
                    </div>
                </div>
            </IonContent>

        </IonModal>

    );
};

export default QRCodeComponent;
