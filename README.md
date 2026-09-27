# Site Loup-Garou RPS

Site statique (HTML/CSS/JS, aucune dépendance ni build) : il suffit d'envoyer
le dossier `site/` tel quel sur n'importe quel hébergeur statique
(GitHub Pages, Netlify, Cloudflare Pages, un simple serveur web...).

## Pages
- `index.html` — accueil
- `telecharger.html` — téléchargement, prérequis, installation, journal des versions
- `wiki.html` — l'almanach (commandes, rôles, config, sons, FAQ)
- `licence.html` — licence MIT
- `contact.html` — formulaire de contact (ouvre la messagerie du visiteur)

## À personnaliser avant la mise en ligne
1. `assets/site.js`, en haut du fichier : l'objet `CONTACT`
   (adresse e-mail, invitation Discord, lien de suivi des bugs).
2. `downloads/` : remplacer le `.jar` et `resourcepack.zip` à chaque version,
   puis mettre à jour la taille et le SHA-1 affichés dans `telecharger.html`
   (`sha1sum downloads/*`).

## Identité visuelle
- Logo : `assets/logo.svg` (sceau complet) et `assets/logo-mark.svg` (emblème / favicon).
- Palette : Encre nuit `#1C1446`, Lune `#FFF3D6`, Lanterne `#FFC23A`,
  Sang `#E8341C`, Fiole `#14A37F`, Sortilège `#7A3FE0`, Cupidon `#FF6FA0`.
- Polices (Google Fonts) : Bowlby One SC (affiche), Fraunces (titres),
  Literata (texte), JetBrains Mono (code).
- Deux tirages : Jour et Nuit (bouton dans l'en-tête, suit le réglage du système par défaut).
