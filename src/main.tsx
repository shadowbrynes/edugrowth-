import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/common/ErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary
      fallbackTitle="ExcelMind System Notice"
      fallbackMessage="ExcelMind encountered a temporary error. Please refresh or try again."
    >
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
