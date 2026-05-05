/**
 * Extract plain text from HTML content
 * Removes all HTML tags and returns clean text
 */
export const extractTextFromHtml = (html: string): string => {
  if (!html) return '';
  
  // Create a temporary div to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Get text content
  let text = temp.textContent || temp.innerText || '';
  
  // Clean up whitespace
  text = text
    .replace(/\s+/g, ' ') // Replace multiple spaces/newlines with single space
    .trim();
  
  return text;
};

/**
 * Extract plain text from HTML and truncate to a specified length
 */
export const extractAndTruncateHtml = (html: string, maxLength: number = 100): string => {
  const text = extractTextFromHtml(html);
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength).trim() + '...';
};
