# Format du relevé (`muldo.json`)

JSON compact, une seule entrée par couleur, seulement les couleurs présentes. Exemple : `data/muldo-pc-exemple.json`.

```json
{"total_etable": 496,
 "gen10_obtenues": ["ambre_dore", "..."],
 "reproducteurs": [{"nom": "RoEbkRo Eb", "node_id": "roux", "sexe": "f", "niveau": 43}],
 "entries": [{"node_id": "amande", "count": 19, "males": 9}],
 "noms": [{"nom": "InkIn Or", "node_id": "indigo", "sexe": "m", "gen": 1, "niveau": 80}]}
```

- `node_id` : nom de la couleur sans « Muldo », minuscules, sans accents, « X et Y » → `x_y`, « Aigue-marine » → `aigue_marine`.
- Contrôles : somme des `count` = total ; somme des `males` = compteur « Monture mâle » ; totaux par génération = section GÉNÉRATION ;
  nombre de `reproducteurs` = compteur « Reproducteur » (CAPACITÉS) ; 50 objectifs Gen 10 lus (obtenus + manquants).
- Génération d'après le nom : codes Or Eb In Po Do = 1, Ro Am = 3, Iv Tu = 5, Em Pr = 7, Ab Co Az Ag = 9 ; bicolore = max + 1.
  Ne pas vérifier parents ↔ couleur : les grands-parents comptent aussi.
