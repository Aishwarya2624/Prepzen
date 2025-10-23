import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { ThemeProvider } from 'next-themes'
import './index.css'
import App from './App.tsx'
import { ToasterProvider } from "./provider/toast-provider.tsx";
import { AuthProvider } from './contexts/AuthContext'
import { applyBrowserPolyfills } from './utils/browser-polyfill'

// Apply browser polyfills to handle extension communication issues
applyBrowserPolyfills()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <App />
        <ToasterProvider />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
