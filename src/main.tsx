import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import AuthProvider from './features/auth/AuthProvider.tsx';
import QueryProvider from './providers/QueryProvider.tsx';
import DevtoolProvider from './providers/DevtoolProvider.tsx';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <AuthProvider>
        <App />
        <DevtoolProvider />
        <Analytics />
        <SpeedInsights />
      </AuthProvider>
    </QueryProvider>
  </StrictMode>
);
