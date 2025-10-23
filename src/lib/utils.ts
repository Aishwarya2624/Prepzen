import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Handles browser extension errors and provides user-friendly notifications
 * @param error The error object to check
 * @returns true if it was a browser extension error and was handled, false otherwise
 */
export function handleBrowserExtensionError(error: any): boolean {
  // Check if this is a browser extension error
  const isExtensionError = error?.message && (
    error.message.includes('Could not establish connection') ||
    error.message.includes('Receiving end does not exist') ||
    error.message.includes('content-all.js')
  );

  if (isExtensionError) {
    console.warn('Browser extension error detected:', error.message);
    
    // Show a user-friendly toast notification
    toast.warning("Browser Extension Issue Detected", {
      description: "A browser extension may be interfering with the application. Try disabling extensions or using incognito mode.",
      duration: 6000,
      action: {
        label: "Dismiss",
        onClick: () => {}
      }
    });
    
    return true;
  }
  
  return false;
}
