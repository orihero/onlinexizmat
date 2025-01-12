/**
 * Truncates text to specified length while preserving HTML tags
 */
export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;

  // Preserve HTML tags
  const matches = text.match(/<[^>]+>|[^<>]+/g) || [];
  let result = '';
  let currentLength = 0;
  let openTags = [];

  for (const part of matches) {
    if (part.startsWith('<')) {
      if (!part.startsWith('</')) {
        openTags.push(part);
      } else {
        openTags.pop();
      }
      result += part;
    } else {
      const remainingLength = maxLength - currentLength - 3; // -3 for "..."
      if (remainingLength <= 0) break;

      if (part.length > remainingLength) {
        result += part.slice(0, remainingLength) + '...';
        break;
      }

      result += part;
      currentLength += part.length;
    }
  }

  // Close any remaining open tags
  while (openTags.length > 0) {
    const tag = openTags.pop();
    const closeTag = `</${tag.match(/<(\w+)/)[1]}>`;
    result += closeTag;
  }

  return result;
}