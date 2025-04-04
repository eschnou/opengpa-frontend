
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { APP_CONFIG } from './config/app.config';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Set the document title from app configuration
document.getElementById('app-title')!.textContent = APP_CONFIG.branding.appName;
document.title = APP_CONFIG.branding.appName;

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register the service worker for PWA support
serviceWorkerRegistration.register();
