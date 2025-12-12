import { useState, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter } from '../components/Card';
import { Button } from '../components/Button';
import { TransitionScreen } from '../components/TransitionScreen';
import { StatusBanner } from '../components/WidgetContainer';
import { UserInfo } from '../components/UserInfo';
import { FormInput, FormTextarea } from '../components/form';
import { ProgressBar } from '../components/ProgressBar';
import { useAppContext } from '../context/AppContext';
import { useUserInfo } from '../hooks/useOpenAiGlobal';
import {
  useRequestConsultation,
  requestDisplayMode,
  setWidgetState,
} from '../hooks/useToolCall';

const HeartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);


type Step = 1 | 2 

interface FormState {
  currentStep: Step;
  name: string;
  email: string;
  phone: string;
  incidentDate: string;
  injuryType: string;
  description: string;
  errors: {
    name?: string;
    email?: string;
    phone?: string;
    incidentDate?: string;
    injuryType?: string;
  };
}

type FormAction =
  | { type: 'SET_FIELD'; field: string; value: string }
  | { type: 'SET_ERROR'; field: string; error: string | undefined }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'RESET' };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_ERROR':
      return { ...state, errors: { ...state.errors, [action.field]: action.error } };
    case 'CLEAR_ERRORS':
      return { ...state, errors: {} };
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, 2) as Step };
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1) as Step };
    case 'RESET':
      return {
        currentStep: 1,
        name: '',
        email: '',
        phone: '',
        incidentDate: '',
        injuryType: '',
        description: '',
        errors: {},
      };
    default:
      return state;
  }
}

export function PersonalInjuryPage() {
  const navigate = useNavigate();
  const { isLoading, isWaitingForBackend } = useAppContext();
  const userInfo = useUserInfo();
  const isLoggedIn = !!userInfo?.email;

  const [success, setSuccess] = useState(false);
  const [state, dispatch] = useReducer(formReducer, {
    currentStep: 1,
    name: '',
    email: '',
    phone: '',
    incidentDate: '',
    injuryType: '',
    description: '',
    errors: {},
  });

  const { loading, error, callTool } = useRequestConsultation();

  // Request fullscreen mode for non-logged-in users
  useEffect(() => {
    if (!isLoggedIn && !isLoading && !isWaitingForBackend) {
      requestDisplayMode('fullscreen');
    }
  }, [isLoggedIn, isLoading, isWaitingForBackend]);

  // Show loading state
  if (isLoading || isWaitingForBackend) {
    return (
      <div className="p-4">
        <TransitionScreen message="Loading..." />
      </div>
    );
  }

  const validateStep = (step: Step): boolean => {
    dispatch({ type: 'CLEAR_ERRORS' });
    let isValid = true;

    if (step === 1) {
      if (!state.name.trim()) {
        dispatch({ type: 'SET_ERROR', field: 'name', error: 'Name is required' });
        isValid = false;
      }
      if (!state.email.trim()) {
        dispatch({ type: 'SET_ERROR', field: 'email', error: 'Email is required' });
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
        dispatch({ type: 'SET_ERROR', field: 'email', error: 'Please enter a valid email' });
        isValid = false;
      }
      if (!state.phone.trim()) {
        dispatch({ type: 'SET_ERROR', field: 'phone', error: 'Phone number is required' });
        isValid = false;
      }
    } 

    return isValid;
  };

  const handleNext = () => {
    if (validateStep(state.currentStep)) {
      dispatch({ type: 'NEXT_STEP' });
    }
  };

  const handleBack = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  const handleSubmit = async () => {
    // For logged-in users, no validation needed
    if (!isLoggedIn && !validateStep(state.currentStep)) {
      return;
    }

    const args = isLoggedIn
      ? { consultation_type: 'personal_injury' }
      : {
          consultation_type: 'personal_injury',
          name: state.name,
          email: state.email,
          phone: state.phone,
          incident_date: state.incidentDate,
          injury_type: state.injuryType,
          description: state.description || undefined,
        };

    const result = await callTool(args);

    if (result?.success) {
      setSuccess(true);
      setWidgetState({
        consultationRequested: true,
        requestId: result.requestId,
      });

      // Switch back to inline mode
      if (!isLoggedIn) {
        requestDisplayMode('inline');
      }

      // Navigate to payment if URL provided
      if (result.paymentUrl) {
        navigate('/payment', { state: { paymentUrl: result.paymentUrl } });
      }
    }
  };

  const handleClose = () => {
    requestDisplayMode('inline');
    navigate('/');
  };

  // Success state
  if (success) {
    return (
      <div className="p-4">
        <Card>
          <CardHeader
            icon={<HeartIcon />}
            title="Request Received"
            subtitle="We're here to help"
          />
          <CardBody>
            <StatusBanner
              type="success"
              message="We've received your request. A personal injury specialist will contact you soon."
            />
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                What happens next?
              </h3>
              <ul className="text-sm text-text-secondary-light dark:text-text-secondary-dark space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary">1.</span>
                  A specialist reviews your case details
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">2.</span>
                  We'll reach out within 24 hours
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">3.</span>
                  Free initial consultation to discuss your options
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

  // Logged-in view: Simple CTA
  if (isLoggedIn) {
    return (
      <div className="p-4">
        <Card>
          <CardHeader
            icon={<HeartIcon />}
            title="Personal Injury Support"
            subtitle="Compassionate legal assistance"
          />
          <CardBody>
            <UserInfo />

            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-4 mb-4">
              We understand this is a difficult time. Our personal injury specialists are here to help you navigate your claim with care and expertise. Whether it's a vehicle accident, workplace injury, or medical malpractice, we're ready to support you.
            </p>

            {error && (
              <StatusBanner
                type="error"
                message={error.message || 'Failed to submit request. Please try again.'}
                onDismiss={() => {}}
              />
            )}

            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                Your information is kept confidential
              </p>
            </div>
          </CardBody>
          <CardFooter>
            <Button variant="outline" onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} loading={loading} fullWidth>
              Request Consultation
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Not logged-in view: Multi-step form in fullscreen
  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-border-light dark:border-border-dark px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
          Personal Injury Support
        </h1>
        <button
          onClick={handleClose}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-text-secondary-light dark:text-text-secondary-dark"
          aria-label="Close"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Form content */}
      <div className="p-4 max-w-lg mx-auto">
        <ProgressBar currentStep={state.currentStep} totalSteps={2} />

        {/* Step 1: Contact Information */}
        {state.currentStep === 1 && (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                Contact Information
              </h2>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                We'll use this information to reach out to you about your case.
              </p>
            </div>

            <FormInput
              label="Full Name"
              required
              value={state.name}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'name', value: e.target.value })}
              error={state.errors.name}
              placeholder="Your full name"
            />

            <FormInput
              label="Email Address"
              type="email"
              required
              value={state.email}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })}
              error={state.errors.email}
              placeholder="your@email.com"
            />

            <FormInput
              label="Phone Number"
              type="tel"
              required
              value={state.phone}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'phone', value: e.target.value })}
              error={state.errors.phone}
              placeholder="+1 (555) 123-4567"
              tooltip="We may call you to discuss your case"
            />

            <div className="pt-4">
              <Button onClick={handleNext} fullWidth>
                Next
              </Button>
            </div>
          </div>
        )}

     

        {/* Step 3: Description */}
        {state.currentStep === 2 && (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                Tell Us More
              </h2>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Share as much or as little as you're comfortable with. This helps us prepare for your consultation.
              </p>
            </div>

            <FormTextarea
              label="Describe What Happened"
              value={state.description}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'description', value: e.target.value })}
              placeholder="Share any details about your situation that you think would be helpful..."
              rows={6}
            />

            {error && (
              <StatusBanner
                type="error"
                message={error.message || 'Failed to submit request. Please try again.'}
                onDismiss={() => {}}
              />
            )}

            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                Your information is kept strictly confidential.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleSubmit} loading={loading} fullWidth>
                Submit Request
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
