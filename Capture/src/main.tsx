import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

const initializeStatusBar = async () => {
    if (Capacitor.isNativePlatform()) {
        await StatusBar.setOverlaysWebView({ overlay: false });  // Deaktiviere Overlay, damit die App nicht hinter der Statusbar startet
        await StatusBar.setBackgroundColor({ color: '#151515' }); // Hintergrundfarbe der Statusbar
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
