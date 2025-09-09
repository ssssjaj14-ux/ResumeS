import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import JobManagementApp from './components/JobManagementApp.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <JobManagementApp />
  </StrictMode>
);
