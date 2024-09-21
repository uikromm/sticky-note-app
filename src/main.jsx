import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';


// APP COMPONENTS
import App from './App.jsx';

// CSS COMPONENTS
import "./index.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
