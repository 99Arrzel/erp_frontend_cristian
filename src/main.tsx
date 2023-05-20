import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

export const baseUrl = import.meta.env.VITE_BASE_URL as string;
//export const baseUrl = 'http://localhost:3333';
export const baseUrlReports = import.meta.env.VITE_BASE_URL_REPORTS as string;
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
