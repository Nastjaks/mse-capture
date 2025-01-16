const randomNames: string[] = [
    "Fliegendes Einhorn", "Tanzende Wurst", "Kochender Alpaka", "Schwimmender Pinguin",
    "Bürokratie Piraten", "Rennende Kartoffel", "Verwirrter Panda", "Magischer Tiger",
    "Lachender Bär", "Tanzende Spaghetti", "Schwankender Fuchs", "Kichernder Drache",
    "Hüpfende Eule", "Tropfender Frosch", "Schwebender Lachs", "Glockenklirrende Katze",
    "Bunter Wolf", "Schnatternde Ente", "Fliegender Flamingo", "Sprechender Kaktus",
    "Springender Dachs", "Schwimmender Affe", "Schwankender Hase", "Schreiender Frosch",
    "Brennender Wal", "Hinterhältiger Wurm", "Sprechende Mütze", "Quakender Dino",
    "Rennender Luchs", "Chillenender Bison", "Wankender Karpfen", "Hüpfender Igel",
    "Blubbernder Rabe", "Schnüffelnde Giraffe", "Verwirrte Schnecke", "Kichernder Esel",
    "Flimmernder Pinguin", "Stolpernder Panther", "Fliegende Gurke", "Sprechender Toast",
    "Fauchender Drache", "Springende Blume", "Lachender Wolf", "Flimmernder Bison",
    "Tanzende Tomate", "Laufender Pinguin", "Süßer Apfel", "Fliegender Lachs",
    "Brennende Banane", "Drehender Frosch", "Hüpfender Lachs", "Fliegende Biene",
    "Fliegender Teppich", "Brüllende Schildkröte", "Kauender Biber", "Knusprige Brezel"
];

// Funktion, um einen zufälligen Namen aus dem Array zu wählen
export const getRandomUserName = (): string => {
    const randomIndex = Math.floor(Math.random() * randomNames.length);
    return randomNames[randomIndex];
};
