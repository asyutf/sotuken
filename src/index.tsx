// src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// ⛔ React.StrictMode を一時的に外す（開発中のみ）
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);
