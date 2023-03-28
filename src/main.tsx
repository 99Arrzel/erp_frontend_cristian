import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

export const baseUrl = 'http://134.195.91.224:3333';
export const baseUrlReports = 'https://reportes.pruebita.tk/';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
