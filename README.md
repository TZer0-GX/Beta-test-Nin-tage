# Nin-tage v0.2

Refonte de l'alpha fourni pour le projet Nin-tage.

## Ce qui est inclus

- Bibliothèque dynamique depuis `data/games.json`
- Filtres NES / Game Boy
- Recherche et tri
- Miniatures remplaçables dans `assets/images/games/`
- Page de jeu dédiée
- Intégration EmulatorJS pour NES et Game Boy
- Audio, fullscreen, save/load state et réglages de contrôles via EmulatorJS
- Détection de manettes via Gamepad API
- Favoris et notes 0,5 → 5 stockés localement pour le prototype
- Lecteur PDF préparé sur la fiche de jeu
- Page Wiki / Forum préparée
- HTML, CSS et JavaScript séparés
- Compatible avec un hébergement statique type GitHub Pages


## Ajouter un jeu

Ajoute une entrée dans `data/games.json`, puis place :

- la miniature dans `assets/images/games/`
- la ROM dans `roms/nes/` ou `roms/gameboy/`
- le manuel PDF dans `assets/manuals/`
- 

## À propos d'EmulatorJS

La première itération utilise le CDN stable d'EmulatorJS afin d'éviter d'embarquer plusieurs dizaines/centaines de Mo de cores dans le dépôt. Le moteur est configurable depuis `js/emulator/emulator.js`.

Pour une version de production, on pourra ensuite auto-héberger les fichiers EmulatorJS dans le dépôt ou un stockage/CDN contrôlé.

## Backend futur

Le frontend utilise actuellement `localStorage` pour rendre les interactions immédiatement testables. Ce n'est pas une authentification réelle.

La prochaine étape serveur devra fournir notamment :

- comptes et sessions sécurisées
- mots de passe hachés côté serveur avec Argon2id ou bcrypt
- base de données
- favoris / notes persistants
- commentaires et modération
- métadonnées des jeux
- gestion des fichiers et permissions
- éventuellement stockage objet pour ROMs/manuels

GitHub Pages peut héberger le frontend, mais le backend devra être déployé séparément.
