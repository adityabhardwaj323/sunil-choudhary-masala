// utils/htmlEscape.js

/**
 * Escapes HTML special characters to prevent HTML injection and XSS.
 * 
 * @param {string} str - The string to escape.
 * @returns {string} The escaped string.
 */
const htmlEscape = (str) => {
  if (typeof str !== 'string') {
    if (str == null) return '';
    return String(str);
  }
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

module.exports = htmlEscape;
