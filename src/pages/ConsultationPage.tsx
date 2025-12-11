import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter } from '../components/Card';
import { Button } from '../components/Button';
import { CardSkeleton } from '../components/Loading';
import { StatusBanner } from '../components/WidgetContainer';
import { useAppContext } from '../context/AppContext';
import {
  useRequestConsultation,
  requestDisplayMode,
  setWidgetState,
} from '../hooks/useToolCall';

type ConsultationType = 'business' | 'personal_injury';

const ConsultIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
  </svg>
);

export function ConsultationPage() {
  const navigate = useNavigate();
  const { isLoading, isWaitingForBackend } = useAppContext();
  const [consultationType, setConsultationType] = useState<ConsultationType | null>(null);
  const [success, setSuccess] = useState(false);
  const { loading, error, callTool } = useRequestConsultation();

  // Show loading shimmer while waiting for backend response
  if (isLoading || isWaitingForBackend) {
    return (
      <div className="p-4">
        <CardSkeleton />
      </div>
    );
  }

  const handleRequestConsultation = async () => {
    if (!consultationType) return;

    const result = await callTool({
      consultation_type: consultationType,
    });

    if (result?.success) {
      setSuccess(true);
      setWidgetState({
        consultationRequested: true,
        requestId: result.requestId,
      });

      // If there's a payment URL, navigate to payment
      if (result.paymentUrl) {
        navigate('/payment', { state: { paymentUrl: result.paymentUrl } });
      }
    }
  };

  const handleGoFullscreen = async () => {
    await requestDisplayMode('fullscreen');
  };

  if (success) {
    return (
      <div className="p-4">
        <Card>
          <CardHeader
            icon={<ConsultIcon />}
            title="Consultation Requested"
            subtitle="We'll connect you with an attorney"
          />
          <CardBody>
            <StatusBanner
              type="success"
              message="Your consultation request has been submitted. An attorney will review your case shortly."
            />
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                What happens next?
              </h3>
              <ul className="text-sm text-text-secondary-light dark:text-text-secondary-dark space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary">1.</span>
                  Our team reviews your request
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">2.</span>
                  We match you with a qualified attorney
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">3.</span>
                  You'll receive consultation details
                </li>
              </ul>
            </div>
          </CardBody>
          <CardFooter>
            <Button variant="secondary" onClick={() => navigate('/')}>
              Back to Services
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader
          icon={<ConsultIcon />}
          title="Consult an Attorney"
          subtitle="Connect with legal experts"
        />
        <CardBody>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
            Select the type of legal consultation you need:
          </p>

          <div className="space-y-3">
            {/* Business Law Option */}
            <button
              onClick={() => setConsultationType('business')}
              className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                consultationType === 'business'
                  ? 'border-primary bg-primary/5'
                  : 'border-border-light dark:border-border-dark hover:border-primary/50'
              }`}
            >
              <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                Business Law
              </div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
                Contracts, partnerships, compliance, and corporate matters
              </div>
            </button>

            {/* Personal Injury Option */}
            <button
              onClick={() => setConsultationType('personal_injury')}
              className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                consultationType === 'personal_injury'
                  ? 'border-primary bg-primary/5'
                  : 'border-border-light dark:border-border-dark hover:border-primary/50'
              }`}
            >
              <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                Personal Injury
              </div>
              <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
                Accidents, medical malpractice, and injury claims
              </div>
            </button>
          </div>

          {error && (
            <StatusBanner
              type="error"
              message={error.message || 'Failed to submit request. Please try again.'}
              onDismiss={() => {}}
            />
          )}

          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
              By proceeding, you agree to our Terms of Service and Privacy Policy.
              Consultation fees may apply.
            </p>
          </div>
        </CardBody>
        <CardFooter className="flex-col sm:flex-row">
          <Button variant="outline" onClick={() => navigate('/')}>
            Cancel
          </Button>
          <Button
            onClick={handleRequestConsultation}
            disabled={!consultationType}
            loading={loading}
            fullWidth
          >
            Request Consultation
          </Button>
        </CardFooter>
      </Card>

      {/* Expand button for more details */}
      <div className="mt-4 text-center">
        <button
          onClick={handleGoFullscreen}
          className="text-sm text-primary hover:underline"
        >
          View more details
        </button>
      </div>
    </div>
  );
}
