import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { WidgetContainer } from './components/WidgetContainer';
import { Home } from './pages/Home';
import { PersonalInjuryPage } from './pages/PersonalInjuryPage';

// Note: Authentication is handled by ChatGPT via OAuth flow with the MCP server.
// When tools require authentication, ChatGPT prompts the user to sign in.
// The widget receives authenticated user context through window.openai.toolOutput.

// This app is focused exclusively on personal injury lead collection
// in partnership with Morgan & Morgan.

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <WidgetContainer>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/personal-injury" element={<PersonalInjuryPage />} />
          </Routes>
        </WidgetContainer>
      </HashRouter>
    </AppProvider>
  );
}

export default App;
