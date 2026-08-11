export const Messages = {
  errors: {
    badRequest: "Les informations saisies ne sont pas valides. Vérifiez les champs indiqués.",
    unauthorized: "Veuillez vous connecter pour continuer.",
    sessionExpired: "Votre session a expiré. Veuillez vous reconnecter.",
    forbidden:
      "Accès refusé. Votre compte ne dispose pas des autorisations nécessaires pour effectuer cette action.",
    notFound: "L’élément demandé est introuvable ou a peut-être été supprimé.",
    conflict: "Cet élément existe déjà. Veuillez utiliser une autre valeur.",
    validation: "Les informations saisies ne sont pas valides. Vérifiez les champs indiqués.",
    tooManyRequests: "Trop de requêtes. Veuillez réessayer dans quelques instants.",
    internal: "Une erreur inattendue s’est produite. Veuillez réessayer dans quelques instants.",
    network:
      "Impossible de contacter le serveur. Vérifiez votre connexion Internet puis réessayez.",
    timeout: "Le serveur met trop de temps à répondre. Veuillez réessayer.",
    saveFailed: "Les modifications n’ont pas pu être enregistrées. Veuillez réessayer.",
    createFailed: "Impossible de créer cet élément. Vérifiez les informations saisies.",
    deleteFailed:
      "Impossible de supprimer cet élément. Il est peut-être utilisé par d’autres données.",
    emailInvalid: "Veuillez saisir une adresse e-mail valide.",
    required: "Ce champ est obligatoire.",
    retry: "Veuillez réessayer dans quelques instants.",
    updateFailed: "Échec de la mise à jour",
    saveFailedShort: "Échec de l’enregistrement",
    createFailedShort: "Échec de la création",
    deleteFailedShort: "Échec de la suppression",
    moveFailed: "Échec du déplacement",
    moveFeatureFailed: "Échec du déplacement de la feature",
  },
  success: {
    saved: "Les modifications ont été enregistrées avec succès.",
    created: "L’élément a été créé avec succès.",
    deleted: "L’élément a été supprimé avec succès.",
  },
} as const;

const TECHNICAL_PATTERNS = [
  /\bSQLSTATE/i,
  /\bPrisma/i,
  /\bPostgres(QueryError)?\b/i,
  /\bTypeError\b/,
  /\bReferenceError\b/,
  /\bSyntaxError\b/,
  /\bRangeError\b/,
  /Internal Server Error/i,
  /Request failed with status code \d+/,
  /Cannot read properties of (undefined|null)/,
  /Undefined array key/,
  /Network Error/i,
  /ECONNREFUSED|ETIMEDOUT|ENOTFOUND/,
  /\bInvalid password\b/i,
  /\bUnauthorized\b/,
  /at\s+[\w$.]+/,
  /^Error:\s/,
  /\b\d+\.\d+\.\d+\b/,
];

export function isTechnicalError(message: string): boolean {
  return TECHNICAL_PATTERNS.some((pattern) => pattern.test(message));
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError) return true;
  if (
    error instanceof Error &&
    /failed to fetch|networkerror|network request failed/i.test(error.message)
  ) {
    return true;
  }
  return false;
}

export function getHttpStatusMessage(status: number): string {
  switch (status) {
    case 400:
      return Messages.errors.badRequest;
    case 401:
      return Messages.errors.unauthorized;
    case 403:
      return Messages.errors.forbidden;
    case 404:
      return Messages.errors.notFound;
    case 408:
      return Messages.errors.timeout;
    case 409:
      return Messages.errors.conflict;
    case 422:
      return Messages.errors.validation;
    case 429:
      return Messages.errors.tooManyRequests;
    case 500:
    case 502:
    case 503:
    case 504:
      return Messages.errors.internal;
    default:
      return Messages.errors.internal;
  }
}

export function getErrorMessage(
  error: unknown,
  fallback: string = Messages.errors.internal,
): string {
  if (isNetworkError(error)) return Messages.errors.network;

  const message =
    typeof error === "string"
      ? error
      : error instanceof Error && error.message
        ? error.message
        : null;

  if (message && message.trim() && !isTechnicalError(message)) {
    return message;
  }

  return fallback;
}
