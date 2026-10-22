// Meilleur score par sujet, mémorisé dans le navigateur de l'utilisateur.
// Tous les accès sont protégés : le stockage peut être indisponible (navigation privée…).

export type BestScore = { score: number; total: number };

const key = (subject: string) => `techquiz:best:${subject}`;

export function readBestScore(subject: string): BestScore | null {
  try {
    const raw = localStorage.getItem(key(subject));
    return raw ? (JSON.parse(raw) as BestScore) : null;
  } catch {
    return null;
  }
}

// Enregistre le score s'il bat le précédent (ou s'il n'y en a pas encore).
// Renvoie true seulement quand un record existant est battu.
export function saveBestScore(subject: string, result: BestScore): boolean {
  const previous = readBestScore(subject);
  if (previous && previous.score / previous.total >= result.score / result.total) return false;
  try {
    localStorage.setItem(key(subject), JSON.stringify(result));
  } catch {
    return false;
  }
  return previous !== null;
}
