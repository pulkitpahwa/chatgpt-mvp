import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter } from '../components/Card';
import { Button } from '../components/Button';
import { StatusBanner } from '../components/WidgetContainer';
import {
  useRequestFinalization,
  requestDisplayMode,
  setWidgetState,
} from '../hooks/useToolCall';

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export function FinalizationPage() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const { loading, error, callTool } = useRequestFinalization();

  const handleRequestFinalization = async () => {
    await requestDisplayMode('fullscreen');

    const result = await callTool({
      // Document context from the conversation
    });

    if (result?.success) {
      setSuccess(true);
      setWidgetState({
        finalizationRequested: true,
        requestId: result.requestId,
      });

      // If there's a payment URL, navigate to payment
      if (result.paymentUrl) {
        navigate('/payment', { state: { paymentUrl: result.paymentUrl } });
      }
    }
  };

  if (success) {
    return (
      <div className="p-4">
        <Card>
          <CardHeader
            icon={<CheckIcon />}
            title="Finalization Requested"
            subtitle="Your document is being processed"
          />
          <CardBody>
            <StatusBanner
              type="success"
              message="Your finalization request has been submitted successfully."
            />
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                What happens next?
              </h3>
              <ul className="text-sm text-text-secondary-light dark:text-text-secondary-dark space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary">1.</span>
                  A lawyer reviews your document
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">2.</span>
                  Legal adjustments are made as needed
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">3.</span>
                  You receive the finalized, enforceable document
                </li>
              </ul>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Estimated turnaround: 2-3 business days
              </p>
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
          icon={<CheckIcon />}
          title="Document Finalization"
          subtitle="Make your document legally enforceable"
        />
        <CardBody>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
            Our legal team will review and finalize your document to ensure it's legally binding
            and enforceable.
          </p>

          <div className="space-y-3 mb-4">
            <div className="p-4 border border-border-light dark:border-border-dark rounded-lg">
              <h3 className="font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                What's included:
              </h3>
              <ul className="text-sm text-text-secondary-light dark:text-text-secondary-dark space-y-2">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-primary mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Professional legal review
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-primary mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Language and clause optimization
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-primary mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Enforceability verification
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-primary mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Final certified document
                </li>
              </ul>
            </div>
          </div>

          {error && (
            <StatusBanner
              type="error"
              message={error.message || 'Failed to submit request. Please try again.'}
            />
          )}

          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
              By proceeding, you agree to our Terms of Service and Privacy Policy.
              Finalization fees apply based on document complexity.
            </p>
          </div>
        </CardBody>
        <CardFooter className="flex-col sm:flex-row">
          <Button variant="outline" onClick={() => navigate('/')}>
            Cancel
          </Button>
          <Button onClick={handleRequestFinalization} loading={loading} fullWidth>
            Request Finalization
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
