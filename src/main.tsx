import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Note: Authentication is handled by ChatGPT via OAuth flow with the MCP server.
// The widget receives authenticated user context through window.openai.
// No separate authentication is needed in the widget.

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
