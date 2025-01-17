import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

const initializeStatusBar = async () => {
    if (Capacitor.isNativePlatform()) {
        // Deaktiviere Overlay, damit die App nicht hinter der Statusbar startet
        await StatusBar.setOverlaysWebView({ overlay: false });

        // Setze die Hintergrundfarbe der Statusbar
        await StatusBar.setBackgroundColor({ color: '#151515' }); // Deine gewünschte Farbe

        // Setze den Stil der Statusbar
        await StatusBar.setStyle({ style: Style.Dark  }); // Oder Style.Dark / Style.Default
    }
};

// Initialisierung der Statusleiste
initializeStatusBar();

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
