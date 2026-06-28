/**
 * Extract plain text from HTML content
 * Removes all HTML tags and returns clean text
 */
export const extractTextFromHtml = (html: string): string => {
  if (!html) return '';
  
  // Pre-process HTML to add spaces/commas for blocks so they don't concatenate
  const processedHtml = html
    .replace(/<\/p>/gi, ' </p>')
    .replace(/<\/div>/gi, ' </div>')
    .replace(/<\/li>/gi, ', </li>') // Commas for list items look great in single-line preview
    .replace(/<br\s*\/?>/gi, ' <br>')
    .replace(/<\/h[1-6]>/gi, ' </h$1>');
    
  const temp = document.createElement('div');
  temp.innerHTML = processedHtml;
  
  // Get text content
  let text = temp.textContent || temp.innerText || '';
  
  // Clean up whitespace
  text = text
    .replace(/\s+/g, ' ') // Replace multiple spaces/newlines with single space
    .replace(/\s*,\s*,/g, ',') // Clean up duplicate commas if any
    .replace(/\s*,\s*$/g, '') // Clean up trailing comma
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
