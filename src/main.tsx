import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppContent } from './App';
import { AppProvider } from './context/AppContext';
import { PWAProvider } from './context/PWAContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <PWAProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </PWAProvider>
  </React.StrictMode>
);
