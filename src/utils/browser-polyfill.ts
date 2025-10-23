/**
 * This polyfill addresses the "Could not establish connection. Receiving end does not exist" error
 * that can occur with Supabase Auth when browser extensions try to communicate with the page.
 */

// Polyfill for Chrome extension message passing
export function applyBrowserPolyfills() {
  // Only apply in browser environment
  if (typeof window === 'undefined') return;

  // Prevent errors from extensions trying to communicate with the page
  window.addEventListener('error', (event) => {
    // Check if the error is related to browser extension communication
    if (
      event.message?.includes('Could not establish connection') ||
      event.message?.includes('Receiving end does not exist') ||
      event.message?.includes('content-all.js') ||
      (event.filename && event.filename.includes('chrome-extension'))
    ) {
      // Prevent the error from propagating
      event.preventDefault();
      event.stopPropagation();
      console.warn('Suppressed browser extension communication error:', event.message);
      return true;
    }
    return false;
  }, true);
  
  // Also handle unhandledrejection events which might contain the same errors
  window.addEventListener('unhandledrejection', (event) => {
    const message = event.reason?.message || String(event.reason);
    if (
      message.includes('Could not establish connection') ||
      message.includes('Receiving end does not exist') ||
      message.includes('content-all.js')
    ) {
      event.preventDefault();
      console.warn('Suppressed unhandled promise rejection from extension:', message);
      return true;
    }
    return false;
  });

  // Patch window.postMessage to handle extension communication errors
  const originalPostMessage = window.postMessage;
  window.postMessage = function(...args) {
    try {
      return originalPostMessage.apply(this, args);
    } catch (err) {
      if (
        err.message?.includes('Could not establish connection') ||
        err.message?.includes('Receiving end does not exist') ||
        err.message?.includes('content-all.js')
      ) {
        console.warn('Suppressed postMessage error:', err.message);
        return;
      }
      throw err;
    }
  };
  
  // Patch console.error to filter out known extension errors
  const originalConsoleError = console.error;
  console.error = function(...args) {
    // Check if this is a known extension error
    const errorString = args.join(' ');
    if (
      errorString.includes('Could not establish connection') ||
      errorString.includes('Receiving end does not exist') ||
      errorString.includes('content-all.js')
    ) {
      // Replace with a warning instead
      console.warn('Suppressed console error from extension:', ...args);
      return;
    }
    // Otherwise, pass through to the original console.error
    return originalConsoleError.apply(this, args);
  };

  console.log('Browser polyfills applied for extension communication issues');
}