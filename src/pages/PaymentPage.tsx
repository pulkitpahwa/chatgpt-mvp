import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter } from '../components/Card';
import { Button } from '../components/Button';
import { LoadingSpinner, CardSkeleton } from '../components/Loading';
import { useAppContext } from '../context/AppContext';
import {
  requestDisplayMode,
  setWidgetState,
  requestClose,
} from '../hooks/useToolCall';

const PaymentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

type PaymentStatus = 'pending' | 'processing' | 'success' | 'error';

export function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, isWaitingForBackend } = useAppContext();
  const [status, setStatus] = useState<PaymentStatus>('pending');
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  // Show loading shimmer while waiting for backend response
  if (isLoading || isWaitingForBackend) {
    return (
      <div className="p-4">
        <CardSkeleton />
      </div>
    );
  }

  // Get payment URL from location state or tool output
  useEffect(() => {
    const statePaymentUrl = (location.state as { paymentUrl?: string })?.paymentUrl;
    if (statePaymentUrl) {
      setPaymentUrl(statePaymentUrl);
    }
  }, [location.state]);

  // Request fullscreen for payment
  useEffect(() => {
    requestDisplayMode('fullscreen');
  }, []);

  // Listen for messages from Chargebee iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Handle Chargebee payment events
      // Note: Chargebee sends messages when payment is complete
      if (event.data?.type === 'chargebee.payment.success') {
        setStatus('success');
        setWidgetState({
          paymentComplete: true,
          paymentId: event.data.paymentId,
        });
      } else if (event.data?.type === 'chargebee.payment.error') {
        setStatus('error');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleComplete = () => {
    requestClose();
  };

  const handleRetry = () => {
    setStatus('pending');
  };

  // Success state
  if (status === 'success') {
    return (
      <div className="p-4 min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardBody>
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                Payment Successful!
              </h2>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Your payment has been processed successfully.
              </p>
            </div>
          </CardBody>
          <CardFooter className="justify-center">
            <Button onClick={handleComplete} fullWidth>
              Continue
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="p-4 min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardBody>
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                Payment Failed
              </h2>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                There was an issue processing your payment. Please try again.
              </p>
            </div>
          </CardBody>
          <CardFooter className="flex-col sm:flex-row">
            <Button variant="outline" onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button onClick={handleRetry} fullWidth>
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Payment form / iframe
  return (
    <div className="p-4 min-h-screen">
      <Card>
        <CardHeader
          icon={<PaymentIcon />}
          title="Complete Payment"
          subtitle="Secure payment powered by Chargebee"
        />
        <CardBody>
          {paymentUrl ? (
            <div className="relative">
              {/* Chargebee iframe */}
              <iframe
                src={paymentUrl}
                className="w-full h-[500px] border-0 rounded-lg"
                title="Payment Form"
                allow="payment"
              />

              {status === 'processing' && (
                <div className="absolute inset-0 bg-surface-light/80 dark:bg-surface-dark/80 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="mt-3 text-text-secondary-light dark:text-text-secondary-dark">
                      Processing payment...
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-text-secondary-light dark:text-text-secondary-dark">
                Loading payment form...
              </p>
            </div>
          )}

          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-text-secondary-light dark:text-text-secondary-dark">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure checkout
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              SSL encrypted
            </div>
          </div>
        </CardBody>
        <CardFooter>
          <Button variant="outline" onClick={() => navigate(-1)} fullWidth>
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
