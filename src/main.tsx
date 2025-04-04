
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { APP_CONFIG } from './config/app.config';

// Set the document title from app configuration
document.getElementById('app-title')!.textContent = APP_CONFIG.branding.appName;
document.title = APP_CONFIG.branding.appName;

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
