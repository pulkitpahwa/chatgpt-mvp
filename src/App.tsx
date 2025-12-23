import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppsSDKUIProvider } from '@openai/apps-sdk-ui/components/AppsSDKUIProvider';
import { Link } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { WidgetContainer } from './components/WidgetContainer';
import { Home } from './pages/Home';
import { PersonalInjuryPage } from './pages/PersonalInjuryPage';
import { BusinessConsultationPage } from './pages/BusinessConsultationPage';
import { NotAvailablePage } from './pages/NotAvailablePage';
import { UnsupportedLocationPage } from './pages/UnsupportedLocationPage';

// Note: Authentication is handled by ChatGPT via OAuth flow with the MCP server.
// When tools require authentication, ChatGPT prompts the user to sign in.
// The widget receives authenticated user context through window.openai.toolOutput.

// This app provides legal consultation matching for:
// - Personal Injury (Morgan & Morgan)
// - Business Consultation
// - Other legal areas (not currently available)

function App() {
  return (
    <HashRouter>
      <AppsSDKUIProvider linkComponent={Link}>
        <AppProvider>
          <WidgetContainer>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/personal-injury" element={<PersonalInjuryPage />} />
              <Route path="/business-consultation" element={<BusinessConsultationPage />} />
              <Route path="/not-available" element={<NotAvailablePage />} />
              <Route path="/unsupported-location" element={<UnsupportedLocationPage />} />
            </Routes>
          </WidgetContainer>
        </AppProvider>
      </AppsSDKUIProvider>
    </HashRouter>
  );
}

export default App;
