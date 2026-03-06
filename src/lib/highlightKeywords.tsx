import React from 'react';

/**
 * Highlights specific keywords in a text string by wrapping them in a styled span
 * @param text - The text to process
 * @param keywords - Array of keywords to highlight
 * @returns JSX with highlighted keywords
 */
export function highlightKeywords(text: string, keywords: string[]): React.ReactNode {
  if (!keywords || keywords.length === 0) {
    return text;
  }

  // Create a regex pattern that matches any of the keywords (case-insensitive)
  const pattern = keywords
    .map(keyword => keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // Escape special regex chars
    .join('|');

  const regex = new RegExp(`(${pattern})`, 'gi');

  // Split the text by the keywords
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        // Check if this part matches any keyword (case-insensitive)
        const isKeyword = keywords.some(
          keyword => keyword.toLowerCase() === part.toLowerCase()
        );

        if (isKeyword) {
          return (
            <mark
              key={index}
              className="bg-yellow-200 font-semibold px-1 rounded"
            >
              {part}
            </mark>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

/**
 * Alternative version that returns plain HTML string (for non-React contexts)
 */
export function highlightKeywordsHTML(text: string, keywords: string[]): string {
  if (!keywords || keywords.length === 0) {
    return text;
  }

  let result = text;
  keywords.forEach(keyword => {
    const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    result = result.replace(
      regex,
      '<mark class="bg-yellow-200 font-semibold px-1 rounded">$1</mark>'
    );
  });

  return result;
}
