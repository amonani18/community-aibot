import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

console.log('Starting application...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found!');
} else {
  try {
    const root = createRoot(rootElement);
    
    // Check if we're running as a microfrontend
    const isMicrofrontend = window.location.pathname.includes('/auth');
    
    const Router = isMicrofrontend ? MemoryRouter : BrowserRouter;
    const basename = isMicrofrontend ? '/auth' : '/';
    
    root.render(
      <StrictMode>
        <Router basename={basename}>
          <App />
        </Router>
      </StrictMode>,
    );
    console.log('Application rendered successfully');
  } catch (error) {
    console.error('Error rendering application:', error);
  }
}
