import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { SITE_CONFIG } from './config/site'
import App from './App.tsx'

document.title = SITE_CONFIG.tabTitle

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
