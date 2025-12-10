import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { WidgetContainer } from './components/WidgetContainer';
import { Home } from './pages/Home';
import { ConsultationPage } from './pages/ConsultationPage';
import { MSADraftPage } from './pages/MSADraftPage';
import { FinalizationPage } from './pages/FinalizationPage';
import { PaymentPage } from './pages/PaymentPage';

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <WidgetContainer>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/consultation" element={<ConsultationPage />} />
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
