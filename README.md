# MSE CAPTURE APP

Im Web: https://capture-mse.netlify.app

Projekt https://github.com/users/Nastjaks/projects/2

## Toolstack

- Ionic https://ionicframework.com/
- Capacitor https://capacitorjs.com/
- React https://react.dev/
- Supabase https://supabase.com/
- Netlify.com https://www.netlify.com/
- Figma https://www.figma.com/design/6B8HuH0injDHiGtOu7qunu/Untitled?node-id=48-237&t=5WNaP2zGBFHvpJPH-1

## MVP
- [x] Nach der Installation kann der Nutzer ein Benutzerprofil erstellen, um Zugang zu allen Funktionen der App zu erhalten.
  - Ein Nutzer kann sich regestrieren und Einloggen und kann dann alle Funktionen der App nutzen

- [x] Sobald der Nutzer angemeldet ist, kann er ein neues Fotoalbum erstellen.
  - Nur regestrierte Nutzer können eine Galerie erstellen

- [x] Der Nutzer kann sein Profil verwalten.
  - Der Nutzer kann seinen Namen und Passwort ändern
      
- [x] Der Ersteller des Albums hat die Möglichkeit, spezifische Foto-Tasks für das Album anzulegen.
  - Der Albumbesitzer kann Foto Tasks für das Album erstellen und löschen

- [x] Der Ersteller des Albums kann das Album bearbeiten/verwalten.
  - Der Albumbesitzer kann das Album löschen
  - Bearbeiten (Name, Beschreibung, Bild).
  - Der Albumbesitzer kann beliebige Bilder löschen.

- [x] Für jedes erstellte Fotoalbum wird ein Link/QR-Code generiert, durch die ein Gastzugang zum Album ermöglicht wird.
  - Es wird ein QR-Code generiert der gescannt und runtergeladen werden kann. Es kann auch der Link zur Gallerie kopiert/geteilt werden.

- [x] Andere Nutzer können dem Fotoalbum beitreten, ohne sich registrieren oder die App herunterladen zu müssen, indem sie den Linköffnen oder den QR-Code scannen und ihren Namen angeben. (Nicht registrierte Nutzer haben jedoch eingeschränkte Funktionen)
  - Nutzer können durch den Link oder QR-Code der Galerie beitreten, sie werden auf eine JOIN seite geleitet auf der sie sich als anonymer Nutzer temporär nur mit einem Namen anmelden können, oder auch mit einem bestehenden Konto.
  - Die App muss dafür nicht runtergeladen werden, da sie auch als Web Aplikation vorhanden ist.

- [x] Nach dem Beitritt haben Teilnehmer die Möglichkeit, ihre eigenen Fotos hochzuladen und direkt mit spezifischen Foto-Tasks verknüpft.
   - Nutzer können Bilder in die Gallerie, oder zu einer spezifischen Task hochladen.
   - Wenn ein Nutzer eine Task erfüllt hat, wird das mit einem grünen Hacken hervorgehoben.
   - Nutzer können ihre eigenen Bilder löschen.
   - Bilder können runtergeldan werden (nur in Web)

- [x] Registrierte Nutzer, die einem Fotoalbum beitreten, können das Album in ihrem Profil sehen und Fotos nachträglich löschen.
   - Geteile Gallerie werden in einem seperaten Bereich angezeigt, sowohl für regestrierte Nutzer als auch für temporäre. 

- [x] Alben, Fotos und Tasks werden übersichtlich dargestellt.
