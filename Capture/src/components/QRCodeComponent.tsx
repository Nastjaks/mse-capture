import React, {useEffect, useState} from "react";
import {IonIcon} from "@ionic/react";
import * as QRCode from "qrcode";
import {useToast} from "../contexts/ToastContext";
import {copySharp, downloadSharp} from "ionicons/icons";

interface QRCodeComponentProps {
    galleryId: string;
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({galleryId}) => {
    const [qrCodeData, setQrCodeData] = useState<string | null>(null);
    const {showToast} = useToast();

    useEffect(() => {
        const generateQRCode = async () => {
            try {
                const localurl = window.location.origin;
                const qrCodeUrl = `${localurl}/${galleryId}`;
                const qrCode = await QRCode.toDataURL(qrCodeUrl);
                setQrCodeData(qrCode);
            } catch (err) {
                console.error("Fehler beim Generieren des QR-Codes:", err);
            }
        };
        generateQRCode();
    }, [galleryId]);

    const downloadFile = (url: string, fileName: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
    };

    const copyToClipboard = async (link: string) => {
        try {
            await navigator.clipboard.writeText(link);
            showToast("Copied to clipboard.");
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    return (
        <div className="qr-code-container">
            {qrCodeData ? (
                <>
                    <div className="qr-image-top">
                        <div>
                            <p>Share this Gallery</p>
                            <p>ID: {galleryId} </p>
                        </div>

                        <div className="qr-options">
                            <IonIcon aria-hidden="true" icon={downloadSharp} onClick={() => downloadFile(qrCodeData!, "qrcode.png")}/>
                            <IonIcon aria-hidden="true" icon={copySharp} onClick={() => copyToClipboard(window.location.origin + "/" + galleryId)}/>
                        </div>
                    </div>

                    <div className="qr-image-wrapper">
                        <img src={qrCodeData} alt="QR Code" className="qr-code-image"/>
                    </div>
                </>
            ) : (
                <p>QR-Code wird generiert...</p>
            )}
        </div>
    );
};

export default QRCodeComponent;
