// Règles partagées par l'application et par scripts/validate-quizzes.mjs.
//
// Les options sont mélangées à chaque partie : une option ne doit donc jamais
// désigner une autre option par sa position.

// Options qui portent sur l'ensemble des choix (« Toutes ces réponses »,
// « Aucune de ces réponses »…). Elles restent vraies après mélange, mais on les
// affiche toujours en dernier pour qu'elles se lisent naturellement.
export const GLOBAL_OPTION =
  /^(toutes|tous|aucune|aucun)\s+(de\s+)?(ces|les)\s+(réponses|méthodes|options)\b/i;

// Options qui désignent d'autres options par leur position (« Réponses 1 et 3 »,
// « A et B », « Les deux premières »…). Interdites : après mélange, la position
// affichée ne correspond plus.
export const POSITIONAL_OPTION =
  /\b(réponses?|options?|choix|propositions?)\s*n?°?\s*\d|^\s*\d\s*(et|&)\s*\d\s*$|^\s*[a-d]\s*(et|&)\s*[a-d]\s*$|\bles deux\s*(premières|derniers?|dernières|méthodes|réponses|options)?\s*(sont valides|fonctionnent)?\s*$|ci-dessus|précédentes?\b/i;
