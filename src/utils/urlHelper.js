/**
 * Ensures any external URL string starts with a valid protocol (https://, http://, mailto:, etc.)
 * so the browser does not treat it as a relative URL (which causes domain prefixing).
 */
export const ensureAbsoluteUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed || trimmed === 'https://example.com' || trimmed === 'example.com') return trimmed;

  if (/^(https?:\/\/|mailto:|tel:|\/\/|\/)/i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};
