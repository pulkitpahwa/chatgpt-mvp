import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { WidgetContainer } from './components/WidgetContainer';
import { Home } from './pages/Home';
import { ConsultationPage } from './pages/ConsultationPage';
import { PersonalInjuryPage } from './pages/PersonalInjuryPage';
import { MSADraftPage } from './pages/MSADraftPage';
import { FinalizationPage } from './pages/FinalizationPage';
import { PaymentPage } from './pages/PaymentPage';

// Note: Authentication is handled by ChatGPT via OAuth flow with the MCP server.
// When tools require authentication, ChatGPT prompts the user to sign in.
// The widget receives authenticated user context through window.openai.toolOutput.

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <WidgetContainer>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/consultation" element={<ConsultationPage />} />
            <Route path="/personal-injury" element={<PersonalInjuryPage />} />
            <Route path="/msa" element={<MSADraftPage />} />
            <Route path="/finalization" element={<FinalizationPage />} />
            <Route path="/payment" element={<PaymentPage />} />
          </Routes>
        </WidgetContainer>
      </HashRouter>
    </AppProvider>
  );
}

export default App;
