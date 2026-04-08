const HTML_ENTITY_MAP: Record<string, string> = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  nbsp: ' ',
  quot: '"',
  '#39': "'",
};

function decodeHtmlEntities(input: string): string {
  return input.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity) => {
    const normalizedEntity = entity.toLowerCase();

    if (normalizedEntity.startsWith('#x')) {
      const codePoint = Number.parseInt(normalizedEntity.slice(2), 16);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }

    if (normalizedEntity.startsWith('#')) {
      const codePoint = Number.parseInt(normalizedEntity.slice(1), 10);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }

    return HTML_ENTITY_MAP[normalizedEntity] ?? match;
  });
}

export function normalizeToolDescription(input?: string | null): string {
  if (!input) {
    return '';
  }

  const withPlainTextBreaks = input
    .replace(/\r\n?/g, '\n')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<li\b[^>]*>/gi, '\n- ')
    .replace(/<(?:br|hr)\s*\/?>/gi, '\n')
    .replace(/<\/(?:p|div|section|article|header|footer|aside|main|blockquote|h[1-6]|ul|ol|li|table|tr)>/gi, '\n\n')
    .replace(/<[^>]*>/g, ' ');

  const normalizedParagraphs = decodeHtmlEntities(withPlainTextBreaks)
    .replace(/\u00a0/g, ' ')
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/[ \t\f\v]+/g, ' ').replace(/\n+/g, ' ').trim())
    .filter(Boolean);

  return normalizedParagraphs.join('\n\n');
}
