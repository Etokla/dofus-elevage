# Relevé d'étable Muldo (Dofus) — contexte pour Claude Code

## Ce que fait le projet
`index.html` est un outil web autonome (un seul fichier, pas de build) qui fait le relevé de l'étable Muldo d'un joueur de Dofus :
le joueur partage la **fenêtre** Dofus (getDisplayMedia), fait défiler la liste de l'Élevage, et la page reconstitue la liste complète
des montures (mâles, femelles, reproducteurs), capture les compteurs du panneau FILTRES et le succès « Muldo : Dixième génération »,
puis produit un PDF (`etable-complete.pdf`) de planches de 40 cartes. La lecture des noms (par IA) se fait ensuite hors de la page.

Objectif produit : un outil gratuit (pub/dons) pour la communauté élevage Muldo, puis un service de « passage de succès » payé en kamas.
Le propriétaire travaille sous **pseudonyme / marque**, sans exposition personnelle.

## Règles non négociables
- **Vie privée** : rien ne quitte le navigateur (aucun envoi d'image). Seule la fenêtre Dofus est acceptée ; sinon le partage est coupé.
  L'aperçu reste masqué tant que la fenêtre n'est pas reconnue comme Dofus.
- **CGU Ankama** : la page ne fait que regarder l'image ; elle ne clique, ne tape ni n'automatise rien dans le jeu.
- Textes de l'interface en **français**, tutoiement.
- Toute modification de l'analyse d'image passe `npm test` **et** `npm run test:long` (simulations), sans régression.

## Commandes
- `npm install` puis `npm test` : tests rapides (zones sur captures réelles, diagnostic Windows rejoué) — quelques secondes.
- `npm run test:long` : simulations de relevés complets (Mac 440, PC 492, surbrillance, écart non entier, erreurs forcées) — plusieurs minutes.
- `npm start` : sert la page sur http://localhost:8080 (getDisplayMedia exige localhost ou https ; `file://` marche aussi dans Chrome).
- Les tests extraient les fonctions de `index.html` par leur nom (`tests/lib/page.js`) : **ne pas renommer** `detectCardsAt`, `detectCards`,
  `autoZones`, `cardSig`, `sigDist`, ni déplacer le bloc `const PCOLS … class Aligner {` sans mettre à jour ce fichier.

## Architecture de index.html (dans l'ordre du flux)
1. **Partage** (`startShare`) : `getDisplayMedia({video: {displaySurface: 'window'}})`, `selfBrowserSurface: 'exclude'`,
   CaptureController `setFocusBehavior('no-focus-change')` (la page reste devant pour vérifier les zones).
2. **Est-ce Dofus ?** (`checkDofusTitle`) : Chrome **ne donne jamais le titre** de la fenêtre (`track.label` = `window:123:0`, documenté).
   La barre de titre est dans l'image : on la lit avec Tesseract.js (chargé depuis jsDelivr, préchargé) et on y cherche une des
   19 classes (« Perso - Sadida - 3.7.12.12 - Release »). Titre lisible sans classe → partage coupé. Barre illisible (plein écran) →
   repli : la liste de l'Élevage doit être trouvée en ~3 s (`verifyByImage`).
3. **Élevage ouvert ?** (`waitElevage`) : attente sans limite que la liste des montures apparaisse (`hasElevage`, image réduite à 1400 px).
4. **Zones** (`autoZones`) : liste = colonne de cartes régulières (≥ 3 si juste à droite du panneau FILTRES, sinon ≥ 6) ;
   FILTRES = colonne de cases à cocher. Hauteur de la liste : piste de la barre de défilement, cartes complètes oubliées ajoutées,
   puis **encadrement par les mots « ETABLE » et « GÉNÉTIQUE »** lus par Tesseract (`frameByLabels`).
5. **Enregistrement** : `MediaStreamTrackProcessor` (pas throttlé quand la page est cachée), `processFrame` →
   `detectCards` → `ShiftAligner.add`. Fenêtre flottante (Document Picture-in-Picture) par-dessus Dofus, bip si montures sautées.
6. **Parcours guidé** : compteurs (1/5), mâles, femelles, reproducteurs, succès (vues fixes) → PDF dans l'ordre
   compteurs, succès, mâles, femelles, reproducteurs.

## Leçons apprises (ne pas réintroduire ces bugs)
- **OCR des noms dans la page** : Tesseract lisait mal les noms (abandonné) ; il sert seulement aux mots fixes (titre, ETABLE, GÉNÉTIQUE).
- **Recollage de pixels** puis appariement par signature de carte : pertes de lignes. → `ShiftAligner` : mesure du défilement
  au pixel entre deux images (profil grossier puis comparaison fine), indépendante de l'apparence des cartes.
- **Surbrillance au survol** : une carte s'éclaircit d'un bloc → l'écart de luminosité de chaque ligne est retiré avant comparaison.
- **Windows à 125 %** : les cartes ne défilent pas d'un bloc (décalages d'1 px entre cartes) → comparaison tolérante à ±1 ligne
  (`fineError(..., tol=true)`), puis position exacte fixée sans tolérance.
- **Écart entre cartes non entier** (~40,7 px) : numéroter depuis le haut accumulait l'arrondi → deux montures sur la même place,
  **perte silencieuse**. → chaque carte est numérotée depuis la carte enregistrée la plus proche, position remise à jour à chaque image.
- **Garde-fou par le contenu** : si les cartes déjà vues ressemblent mieux à la place voisine (signature 64×8 normalisée ;
  même carte ≈ 0,03, voisine ≈ 0,18), les numéros sont décalés d'une place.
- **Liste courte** (filtre Reproducteur, 5 montures) : le seuil à la médiane tombait sur le fond vide → repli au 80e centile si < 6 cartes.
- **Mac** : la piste de défilement est plus courte que la liste (dernière ligne jamais lue) → extension + encadrement par les mots.
- **Page cachée derrière Dofus** : `<video>` peut se figer → images fraîches via `MediaStreamTrackProcessor` sur une copie de la piste.
- Les **compteurs** du jeu sont la vérité : total, par génération, par sexe, reproducteurs (section CAPACITÉS). Toujours comparer.

## Vérifier un relevé (PDF renvoyé par l'utilisateur)
Comparer aux compteurs du jeu (premières pages du PDF) : totaux par sexe, par génération (badge « GEN. N » de chaque carte),
nombre de reproducteurs. Pour trouver une monture manquante, comparer nom par nom avec un relevé complet (multiensemble,
tolérance d'OCR) : l'ordre des listes dépend du tri choisi en jeu. Voir `docs/historique.md`.

## Conventions Muldo utiles
Nom renommé = `XkP1 P2` (couleur `k` parent1 parent2) ; codes : Or Eb In Po Do (Gen 1), Ro Am (3), Iv Tu (5), Em Pr (7), Ab Co Az Ag (9) ;
bicolore = génération max + 1. Les Gen 1 capturés restent « Anonyme ». Format du relevé : `docs/format-releve.md`.
