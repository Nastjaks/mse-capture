export const addTimestampToFilename = (file: File): string => {
    const timestamp = Date.now(); // Aktueller Zeitstempel
    const extension = file.name.split('.').pop(); // Dateiendung extrahieren
    const baseName = file.name.replace(/\.[^/.]+$/, ""); // Name ohne Endung
    return `${baseName}_${timestamp}.${extension}`;
};