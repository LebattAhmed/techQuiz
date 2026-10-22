# Tech Quiz

Quiz en français pour évaluer ses connaissances en informatique : langages, réseau,
sécurité, développement web et mobile, bases de données, DevOps.

Next.js 15 (App Router) · React 19 · Tailwind CSS 4 · framer-motion.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
```

| Commande                   | Rôle                                                |
| -------------------------- | --------------------------------------------------- |
| `npm run dev`              | Serveur de développement                            |
| `npm run build`            | Valide les questions puis construit le site statique |
| `npm run lint`             | ESLint                                              |
| `npm run validate:quizzes` | Vérifie les fichiers de questions                   |

## Organisation

```
app/
  page.tsx                          accueil
  quiz/page.tsx                     /quiz : liste des catégories
  quiz/[category]/page.tsx          /quiz/langages : sujets d'une catégorie
  quiz/[category]/[subject]/page.tsx  /quiz/langages/python : le quiz
components/quiz.tsx                 composant de quiz unique (tous les sujets)
components/choice-grid.tsx          grille de cartes (catégories, sujets)
lib/quizzes.ts                      catalogue des catégories/sujets + lecture des questions
lib/shuffle.ts                      tirage des questions et mélange des options
lib/option-rules.mjs                règles sur les options (partagées avec le validateur)
data/quizzes/<sujet>-quiz.json      questions
scripts/validate-quizzes.mjs        validation des questions
```

## Ajouter des questions

Chaque fichier `data/quizzes/<sujet>-quiz.json` a la forme :

```json
{
  "questions": [
    {
      "question": "Quel mot-clé définit une fonction en Python ?",
      "options": ["function", "def", "func", "define"],
      "answer": "def",
      "difficulty": "facile"
    }
  ]
}
```

Règles (vérifiées par `npm run validate:quizzes`, lancé automatiquement avant chaque build) :

- `answer` doit être **exactement** l'une des `options` ; les options doivent être uniques ;
- `difficulty` vaut `facile`, `moyen` ou `difficile`, avec **au moins 15 questions par niveau** ;
- **les options sont mélangées à chaque partie** : une option ne doit jamais désigner une autre
  par sa position (« Réponses 1 et 3 », « Les deux méthodes sont valides »…). Écrivez le contenu
  à la place, par exemple « `// Commentaire` ou `/* Commentaire */` » ;
- « Toutes ces réponses » et « Aucune de ces réponses » sont autorisées : elles restent toujours
  affichées en dernière position.

Un sujet dont le fichier est vide apparaît comme « Bientôt disponible ». Pour ajouter un sujet,
déclarez-le dans `lib/quizzes.ts` et créez le fichier JSON correspondant.
