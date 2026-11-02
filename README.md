# Relevé d'étable Muldo (Dofus)

Outil web qui fait le relevé de ton étable Muldo en filmant la fenêtre Dofus pendant que tu fais défiler la liste.
Tout reste dans ton navigateur : aucune image n'est envoyée.

## Utiliser
1. Ouvre `index.html` dans **Chrome** (double-clic, ou `npm start` puis http://localhost:8080).
2. Dans Dofus (en mode fenêtré), ouvre la fenêtre **Élevage**, onglet ETABLE, filtres décochés.
3. **Partager une fenêtre** → choisis la fenêtre Dofus. La page vérifie que c'est Dofus (barre de titre) puis détecte les zones.
4. Vérifie les rectangles sur l'aperçu, puis lance le **parcours guidé** : la petite fenêtre flottante t'indique chaque étape.
5. À la fin, télécharge `etable-complete.pdf`.

Sur Mac : Chrome a besoin de l'autorisation « Enregistrement de l'écran et audio système » (Réglages Système › Confidentialité).

## Développer
- `npm install`, puis `npm test` (rapide) et `npm run test:long` (simulations, plusieurs minutes).
- Contexte complet, architecture et pièges connus : [CLAUDE.md](CLAUDE.md).
- Démarrer avec GitHub et Claude Code : [DEMARRAGE.md](DEMARRAGE.md).

## Contenu
| Dossier | Rôle |
|---|---|
| `index.html` | l'outil (un seul fichier) |
| `tools/test-barre-titre.html` | page de test : ce que Chrome capture en haut de la fenêtre partagée |
| `tests/` | tests automatiques et leurs images réelles (`fixtures/`) |
| `docs/` | historique des décisions, format du relevé |
| `data/` | exemple de relevé (`muldo.json`) |
