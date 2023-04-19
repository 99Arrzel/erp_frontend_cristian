import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

//export const baseUrl = 'https://backend.pruebita.tk';
//export const baseUrlReports = 'https://reportes.pruebita.tk';

export const baseUrl = 'https://escobar.arrzel.com:3333';
export const baseUrlReports = 'https://reportes.arrzel.com';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
