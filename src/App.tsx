import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppsSDKUIProvider } from '@openai/apps-sdk-ui/components/AppsSDKUIProvider';
import { Link } from 'react-router-dom';
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
    <HashRouter>
      <AppsSDKUIProvider linkComponent={Link}>
        <AppProvider>
          <WidgetContainer>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/personal-injury" element={<PersonalInjuryPage />} />
            </Routes>
          </WidgetContainer>
        </AppProvider>
      </AppsSDKUIProvider>
    </HashRouter>
  );
}

export default App;
