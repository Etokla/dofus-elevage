# Passer sur GitHub et Claude Code

## 1. Mettre le projet sur GitHub (une fois)
1. Crée un compte sur https://github.com — avec ton **pseudonyme / nom de marque**, pas ton nom.
2. Installe **GitHub Desktop** (https://desktop.github.com) : c'est le plus simple si tu n'as jamais utilisé Git.
3. Dézippe ce dossier, par exemple dans `Documents/dofus-elevage`.
4. GitHub Desktop › *File › Add local repository* › choisis le dossier › il propose de créer le dépôt : accepte.
5. Fais un premier *commit* (message : « Version de départ »), puis **Publish repository**.
   Laisse coché **Keep this code private** tant que tu ne veux pas le publier.

## 2. Installer Claude Code
Le plus simple : l'**application de bureau Claude** (macOS et Windows), onglet **Code** — elle inclut Claude Code.
- macOS : https://claude.ai/api/desktop/darwin/universal/dmg/latest/redirect
- Windows : https://claude.ai/api/desktop/win32/x64/setup/latest/redirect

Ou en ligne de commande :
- macOS : `curl -fsSL https://claude.ai/install.sh | bash`
- Windows (PowerShell) : `irm https://claude.ai/install.ps1 | iex` (installe aussi Git for Windows : https://git-scm.com/downloads/win)

Puis, dans le dossier du projet : `claude`. Il faut un abonnement Claude payant.
Documentation : https://code.claude.com/docs/en/overview

## 3. Installer Node.js (pour les tests)
https://nodejs.org (version LTS). Puis dans le dossier : `npm install` et `npm test`.

## 4. Première session
Claude Code lit automatiquement `CLAUDE.md` (tout le contexte et les pièges connus). Pour commencer :
> « Lis CLAUDE.md, lance npm test et npm run test:long, et dis-moi si tout passe. »

Ensuite, une demande à la fois, par exemple :
> « Sur Windows il manque une monture : voici le PDF [glisse le fichier]. Compare aux compteurs et trouve laquelle. »

Avant d'accepter une modification de l'analyse d'image, demande-lui de relancer les deux séries de tests.
À chaque étape qui marche : commit dans GitHub Desktop (c'est ta sauvegarde, tu peux revenir en arrière).

## 5. Plus tard : mettre l'outil en ligne
GitHub Pages (Settings › Pages) sert `index.html` en https gratuitement — nécessaire pour que d'autres joueurs l'utilisent.
À faire seulement quand tu veux le rendre public (le dépôt doit alors être public, ou passer par un autre hébergeur).

## À faire ensuite (pistes)
- Relevé Windows complet à confirmer (226 mâles, 214 femelles, 5 reproducteurs) avec la dernière version.
- Ajouter dans la page les consignes Mac (autorisation d'enregistrement d'écran, Chrome sur tous les bureaux, Dofus fenêtré).
- Lecture des planches par IA (noms → `muldo.json`) intégrée ou guidée.
- Découper `index.html` en modules si le fichier devient difficile à faire évoluer (les tests extraient les fonctions par nom).
