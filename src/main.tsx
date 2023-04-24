import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

export const baseUrl = 'https://escobarbkn.arrzel.com';
//export const baseUrl = 'http://localhost:3333';
export const baseUrlReports = 'https://reportes.arrzel.com';



ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
