import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import TestApp from './TestApp.tsx'
import SimpleApp from './SimpleApp.tsx'
import TestImports from './TestImports.tsx'
import AppTest from './AppTest.tsx'
import './index.css'

console.log('main.tsx: Starting React app...');

const rootElement = document.getElementById('root');
console.log('main.tsx: Root element:', rootElement);

if (!rootElement) {
  console.error('main.tsx: Root element not found!');
} else {
  console.log('main.tsx: Creating React root...');
  const root = ReactDOM.createRoot(rootElement);
  
  console.log('main.tsx: Rendering App component...');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  console.log('main.tsx: App component rendered');
}
