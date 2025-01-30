import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

const initializeStatusBar = async () => {
    if (Capacitor.isNativePlatform()) {
        await StatusBar.setOverlaysWebView({ overlay: false });  // Deaktiviere Overlay, damit die App nicht hinter der Statusbar startet
        await StatusBar.setBackgroundColor({ color: '#0e0e0e' }); // Hintergrundfarbe der Statusbar
        await StatusBar.setStyle({ style: Style.Dark  });  // Schriftfarbe - Stil der Statusbar
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
