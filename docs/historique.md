# Historique des décisions (oct.–nov. 2026)

## Pourquoi cet outil
Relever 400-500 Muldos à la main (ou par captures d'écran envoyées à une IA) est long et peu fiable : une IA compte plusieurs fois
la même ligne sur des captures qui se chevauchent. Une vidéo du défilement, découpée en cartes par la page, puis des planches
sans doublon lues ensuite, règle le problème. Contrainte : tout doit rester simple pour le joueur, ou être internalisé.

## Étapes clés
1. OCR Tesseract des noms dans la page → abandonné (lecture trop mauvaise) ; la page produit des planches d'images, lues ensuite.
2. Recollage de pixels → lignes perdues. Appariement par signature de carte → pertes sur les quasi-doublons (tri alphabétique Mac).
   → `ShiftAligner` : mesure du défilement au pixel, numérotation des cartes par position. Mac 440/440.
3. Capture throttlée quand la page est cachée → `MediaStreamTrackProcessor`. Overlay Document Picture-in-Picture par-dessus Dofus.
4. Zones automatiques (liste + FILTRES), robustes à la position de défilement (barres de défilement), aux petites fenêtres.
5. Parcours guidé (compteurs, mâles, femelles, reproducteurs, succès) → un seul PDF.
6. Vie privée : partage coupé si ce n'est pas Dofus. Chrome ne donne pas le titre des fenêtres (`window:ID:0`, documenté :
   https://github.com/w3c/mediacapture-screen-share/issues/128) → lecture de la barre de titre dans l'image (nom de classe).
7. Reproducteurs (liste filtrée courte) : seuil de détection, zone à droite du panneau FILTRES.
8. Windows : bips en défilant (décalages d'1 px entre cartes, échelle 125 %) → tolérance ±1 ligne ; surbrillance au survol retirée.
9. Windows : 1 monture perdue par liste sans alerte (écart entre cartes ≈ 40,7 px, arrondi cumulé) → numérotation relative.
   Garde-fou par le contenu. Encadrement de la zone par « ETABLE » et « GÉNÉTIQUE » (idée du propriétaire).

## Validations réelles
- PC (oct.) : 496/496, compteurs conformes.
- Mac (1er nov.) : 226 + 214 = 440, 5 reproducteurs, totaux par génération conformes, noms ↔ générations cohérents.
- Windows (1er nov.) : 225 + 213 → corrections 8 et 9 ; **relevé complet à reconfirmer**.

## Méthode de vérification d'un PDF (faite à la main avec Python + Tesseract)
- Découper chaque planche en cartes (séparations sombres), lire le chiffre du badge « GEN. N » par regroupement des glyphes,
  compter par génération et par sexe, comparer aux compteurs.
- Trouver une monture manquante : OCR des noms des deux relevés, appariement en multiensemble avec distance d'édition ≤ 3.
- Les marqueurs orange dans la colonne des numéros signalent un trou détecté par l'outil ; une perte sans marqueur est silencieuse.
