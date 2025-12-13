import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, CardFooter } from "../components/Card";
import { Button } from "../components/Button";
import { TransitionScreen } from "../components/TransitionScreen";
import { StatusBanner } from "../components/WidgetContainer";
import { FormInput, FormTextarea } from "../components/form";
import { useAppContext } from "../context/AppContext";
import { useUserInfo } from "../hooks/useOpenAiGlobal";
import {
  useRequestFinalization,
  requestDisplayMode,
  setWidgetState,
} from "../hooks/useToolCall";

const CheckIcon = () => (
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
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
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

const CheckmarkIcon = () => (
  <svg
    className="w-4 h-4 text-primary mt-0.5"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

interface FormData {
  name: string;
  email: string;
  phone: string;
  documentType: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  documentType?: string;
}

const FinalizationServiceFeatures = () => (
  <div className="dark:border-border-dark rounded-lg mb-4">
    <h3 className="font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
      What's included:
    </h3>
    <ul className="text-sm text-text-secondary-light dark:text-text-secondary-dark space-y-2">
      <li className="flex items-start gap-2">
        <CheckmarkIcon />
        Professional review by licensed attorney
      </li>
      <li className="flex items-start gap-2">
        <CheckmarkIcon />
        Legal language optimization
      </li>
      <li className="flex items-start gap-2">
        <CheckmarkIcon />
        Compliance verification
      </li>
      <li className="flex items-start gap-2">
        <CheckmarkIcon />
        Certified final document
      </li>
    </ul>
  </div>
);

export function FinalizationPage() {
  const navigate = useNavigate();
  const { isLoading, isWaitingForBackend } = useAppContext();
  const userInfo = useUserInfo();
  const isLoggedIn = !!userInfo?.email;

  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    documentType: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const { loading, error, callTool } = useRequestFinalization();

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
        <TransitionScreen message="Loading finalization..." />
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
    if (!formData.documentType.trim()) {
      errors.documentType = "Document type is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    // For logged-in users, no validation needed
    if (!isLoggedIn && !validateForm()) {
      return;
    }

    const args = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      document_type: formData.documentType,
      notes: formData.notes || undefined,
    };

    const result = await callTool(args);

    if (result?.success) {
      setSuccess(true);
      setWidgetState({
        finalizationRequested: true,
        requestId: result.requestId,
      });

      // Switch back to inline mode
      if (!isLoggedIn) {
        requestDisplayMode("inline");
      }

      // Navigate to payment if URL provided
      if (result.paymentUrl) {
        navigate("/payment", { state: { paymentUrl: result.paymentUrl } });
      }
    }
  };

  const handleClose = () => {
    requestDisplayMode("inline");
    navigate("/");
  };

  // Success state
  if (success) {
    return (
      <div className="p-4 m-4">
        <Card>
          <CardHeader
            icon={<CheckIcon />}
            title="Request Received"
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
                  <span className="text-primary">1.</span>A lawyer reviews your
                  document
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

  return (
    <div className="bg-surface-light dark:bg-surface-dark max-h-screen overflow-y-auto">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-border-light dark:border-border-dark px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
          Document Finalization
        </h1>
        <button
          onClick={handleClose}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-text-secondary-light dark:text-text-secondary-dark"
          aria-label="Close"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="flex gap-4 md:flex-row flex-col p-4 max-w-4xl mx-auto">
        <Card className="w-full md:w-[50%]">
          <CardHeader
            icon={<CheckIcon />}
            title="Document Finalization"
            subtitle="Make your document legally enforceable"
          />
          <CardBody>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-4 mb-4">
              Our legal team will review and finalize your document to ensure
              it's legally binding and enforceable.
            </p>
            <FinalizationServiceFeatures />
          </CardBody>
        </Card>

        <Card className="w-full md:w-[50%]">
          <CardBody>
            {/* Contact Information */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
                Contact Information
              </h2>

              <FormInput
                label="Full Name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
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

              <FormTextarea
                label="Additional Notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Any specific requirements or concerns about the document..."
                rows={4}
              />
            </div>

            {error && (
              <div className="mb-4">
                <StatusBanner
                  type="error"
                  message={
                    error.message ||
                    "Failed to submit request. Please try again."
                  }
                  onDismiss={() => {}}
                />
              </div>
            )}

            <Button onClick={handleSubmit} loading={loading} fullWidth>
              Request Finalization
            </Button>

            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mt-4">
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                By proceeding, you agree to our{" "}
                <a
                  href="https://www.inhouse.ai/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="https://www.inhouse.ai/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Privacy Policy
                </a>
                . Finalization fees apply based on document complexity.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
