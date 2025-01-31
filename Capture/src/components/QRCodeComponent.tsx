import React, {useEffect, useState} from "react";
import {IonButton, IonContent, IonIcon, IonModal} from "@ionic/react";
import * as QRCode from "qrcode";
import {useToast} from "../contexts/ToastContext";
import {copySharp, download} from "ionicons/icons";
import {menuController} from "@ionic/core/components";

interface QRCodeComponentProps {
    galleryId: string;
    istShareOpen: boolean;
}

// Component to generate and display the QR-Code and Link for sharing the gallery
const QRCodeComponent: React.FC<QRCodeComponentProps> = ({galleryId, istShareOpen}) => {
    const [qrCodeData, setQrCodeData] = useState<string | null>(null);
    const {showToast} = useToast();
    const joinGalleryUrl = "https://capture-mse.netlify.app/join-gallery/";

    useEffect(() => {
        const generateQRCode = async () => {
            try {
                const qrCodeUrl = `${joinGalleryUrl}${galleryId}`;
                const qrCode = await QRCode.toDataURL(qrCodeUrl);
                setQrCodeData(qrCode);
            } catch (err) {
                console.error("Error generating QR-code:", err);
            }
        };
        generateQRCode();
    }, [galleryId]);

    // Download the QR-Code as image
    const downloadFile = (url: string, fileName: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
    };

    // Copy the link to the clipboard
    const copyToClipboard = async (link: string) => {
        try {
            await navigator.clipboard.writeText(link);
            showToast("Copied to clipboard.");
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    return (

        // Modal to display the QR-Code and the link for sharing the gallery
        <IonModal
            isOpen={istShareOpen}
            breakpoints={[0, 0.60]}
            initialBreakpoint={0.60}
            className="share-modal action-modal"
            backdropDismiss={true}
            keepContentsMounted={false}
            show-backdrop={true}
            handleBehavior="cycle"
            onWillPresent={async () => await menuController.close()}
        >

            {/*Content of the modal*/}
            <IonContent className="ion-padding">
                <div className="ion-margin-top">
                    <div className="qr-code-container">
                        {qrCodeData ? (
                            <>
                                <div className="action-modal-title qr-image-top">
                                    <p>Invite your friends</p>
                                    <IonButton shape="round" onClick={() => copyToClipboard(joinGalleryUrl + galleryId)}> <IonIcon aria-hidden="true" icon={copySharp}/>Copy Link</IonButton>
                                </div>

                                <div className="qr-image-content">
                                    <img src={qrCodeData} alt="QR Code" className="qr-code-image"/>
                                    <IonButton shape="round" onClick={() => downloadFile(qrCodeData!, "qrcode.png")}> <IonIcon aria-hidden="true" icon={download}/>Download QR</IonButton>
                                </div>
                            </>
                        ) : (
                            <p>Generating QR-Code...</p>
                        )}
                    </div>
                </div>
            </IonContent>

        </IonModal>

    );
};

export default QRCodeComponent;
