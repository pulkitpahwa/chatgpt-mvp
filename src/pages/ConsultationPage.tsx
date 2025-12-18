import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, CardFooter } from "../components/Card";
import { Button } from "../components/Button";
import { TransitionScreen } from "../components/TransitionScreen";
import { StatusBanner } from "../components/WidgetContainer";
import { UserInfo } from "../components/UserInfo";
import { FormInput, FormTextarea } from "../components/form";
import { useAppContext } from "../context/AppContext";
import { useUserInfo } from "../hooks/useOpenAiGlobal";
import {
  useRequestConsultation,
  requestDisplayMode,
  setWidgetState,
} from "../hooks/useToolCall";

const BriefcaseIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

// const QUERY_TYPE_OPTIONS = [
//   { value: 'contract', label: 'Contract Review' },
//   { value: 'ip', label: 'Intellectual Property' },
//   { value: 'dispute', label: 'Business Dispute' },
// ];

interface FormData {
  name: string;
  email: string;
  phone: string;
  queryType: string;
  description: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export function ConsultationPage() {
  const navigate = useNavigate();
  const { isLoading, isWaitingForBackend } = useAppContext();
  const userInfo = useUserInfo();
  const isLoggedIn = !!userInfo?.email;

  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    queryType: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const { loading, error, callTool } = useRequestConsultation();

  // Request fullscreen mode for non-logged-in users
  useEffect(() => {
    if (!isLoggedIn && !isLoading && !isWaitingForBackend) {
      requestDisplayMode("fullscreen");
    }
  }, [isLoggedIn, isLoading, isWaitingForBackend]);

  // Show loading state
  if (isLoading || isWaitingForBackend) {
    return (
      <div className="p-4">
        <TransitionScreen message="Loading consultation..." />
      </div>
    );
  }

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    // For logged-in users, no validation needed
    if (!isLoggedIn && !validateForm()) {
      return;
    }

    const args = isLoggedIn
      ? { consultation_type: "business" }
      : {
          consultation_type: "business",
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          query_type: formData.queryType || undefined,
          description: formData.description || undefined,
        };

    const result = await callTool(args);

    // Check for successful response using structuredContent
    const isSuccess = result?.structuredContent?.status === "complete";

    if (isSuccess) {
      setSuccess(true);

      // Extract requestId from structuredContent or parse from message
      const requestId = result.structuredContent?.requestId ||
        extractRequestIdFromMessage(result.structuredContent?.message);

      setWidgetState({
        consultationRequested: true,
        requestId,
      });

      // Switch back to inline mode
      if (!isLoggedIn) {
        requestDisplayMode("inline");
      }

      // Navigate to payment if URL provided
      const paymentUrl = result.structuredContent?.paymentUrl;
      if (paymentUrl) {
        navigate("/payment", { state: { paymentUrl } });
      }
    }
  };

  // Helper to extract UUID from message if requestId not provided directly
  const extractRequestIdFromMessage = (message?: string): string | undefined => {
    if (!message) return undefined;
    const uuidMatch = message.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
    return uuidMatch?.[0];
  };

  const handleClose = () => {
    requestDisplayMode("inline");
    navigate("/");
  };

  // Success state
  if (success) {
    return (
      <div className="p-4">
        <Card>
          <CardHeader
            icon={<BriefcaseIcon />}
            title="Consultation Requested"
            subtitle="We'll connect you with an attorney"
          />
          <CardBody>
            <StatusBanner
              type="success"
              message="Your business consultation request has been submitted. An attorney will review your case shortly."
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
                  We match you with a qualified business attorney
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">3.</span>
                  You'll receive consultation details via email
                </li>
              </ul>
            </div>
          </CardBody>
          <CardFooter>
            <Button variant="secondary" onClick={() => navigate("/")}>
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
            icon={<BriefcaseIcon />}
            title="Business Consultation"
            subtitle="Connect with business law experts"
          />
          <CardBody>
            <UserInfo />

            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-4 mb-4">
              Connect with experienced business attorneys for contracts, IP
              matters, disputes, and corporate legal needs. Our team of
              specialists will review your case and provide expert guidance.
            </p>

            {error && (
              <StatusBanner
                type="error"
                message={
                  error.message || "Failed to submit request. Please try again."
                }
                onDismiss={() => {}}
              />
            )}

            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                By proceeding, you agree to our{" "}
                <a
                  href="https://www.inhouse.ai/terms-of-service"
                  target="blank"
                >
                  Terms of Service
                </a>
                and
                <a href="https://www.inhouse.ai/privacy-policy" target="blank">
                  Privacy Policy
                </a>
                . Consultation fees may apply.
              </p>
            </div>
          </CardBody>
          <CardFooter>
            <Button variant="outline" onClick={() => navigate("/")}>
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

  // Not logged-in view: Full form in fullscreen
  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-border-light dark:border-border-dark px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
          Business Consultation
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
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-6">
          Connect with experienced business attorneys. Please provide your
          contact information to get started.
        </p>

        {/* Contact Information */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
            Contact Information
          </h2>

          <FormInput
            label="Full Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
            placeholder="John Doe"
          />

          <FormInput
            label="Email Address"
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            error={formErrors.email}
            placeholder="john@company.com"
          />

          <FormInput
            label="Phone Number"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            error={formErrors.phone}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        {/* Service Details */}
        <div className="mb-6">
          <FormTextarea
            label="Describe Your Situation"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Tell us about your legal needs..."
            rows={4}
          />
        </div>

        {error && (
          <div className="mb-4">
            <StatusBanner
              type="error"
              message={
                error.message || "Failed to submit request. Please try again."
              }
              onDismiss={() => {}}
            />
          </div>
        )}

        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
            By proceeding, you agree to our Terms of Service and Privacy Policy.
            Consultation fees may apply.
          </p>
        </div>

        <Button onClick={handleSubmit} loading={loading} fullWidth>
          Submit Request
        </Button>
      </div>
    </div>
  );
}
