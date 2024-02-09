/**
 * Detects whether the browser app is running in Puppeteer.
 */
export function isPuppeteer() {
  return localStorage.getItem('IS_PUPPETEER') === 'true'
}
