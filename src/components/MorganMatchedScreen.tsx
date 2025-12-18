import { useState } from "react";
import { Card, CardBody } from "./Card";
import { Button } from "./Button";
import { FormInput, FormTextarea } from "./form";
import { StatusBanner } from "./WidgetContainer";

// Icons
const CheckmarkIcon = () => (
  <svg
    className="w-4 h-4 text-green-500 flex-shrink-0"
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

const ScaleIcon = () => (
  <svg
    className="h-48 text-primary"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
    />
  </svg>
);

const BackIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

interface FormData {
  name: string;
  email: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

interface MorganMatchedScreenProps {
  onSubmit: (data: FormData & { phone: string }) => Promise<void>;
  loading?: boolean;
  error?: Error | null;
}

export function MorganMatchedScreen({
  onSubmit,
  loading = false,
  error = null,
}: MorganMatchedScreenProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    // Phone is not collected in simplified form, pass empty string
    await onSubmit({ ...formData, phone: "" });
  };

  // Form View
  if (showForm) {
    return (
      <div className="p-4 max-h-[400px] overflow-y-auto">
        <Card className="shadow-md flex-grow">
          <CardBody>
            {/* Back button and title */}
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setShowForm(false)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Go back"
              >
                <BackIcon />
              </button>
              <h2 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                Share your details
              </h2>
            </div>

            {/* Form - horizontal on desktop, vertical on mobile */}
            <div className="space-y-3">
              {/* Row 1: Full Name, Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormInput
                  label="Full Name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  error={formErrors.name}
                  placeholder="Your full name"
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
                  placeholder="your@email.com"
                />
              </div>

              {/* Row 2: Additional details */}
              <FormTextarea
                label="Additional details (optional)"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Anything else you'd like the lawyer to know..."
                rows={3}
              />

              {/* Error banner */}
              {error && (
                <StatusBanner
                  type="error"
                  message={
                    error.message || "Failed to submit. Please try again."
                  }
                />
              )}

              {/* Row 3: CTA */}
              <Button onClick={handleSubmit} loading={loading} fullWidth>
                Get Free Consultation
              </Button>

              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark text-center">
                By submitting, you agree to be contacted about your case.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Two-Card View (default)
  return (
    <div className="flex p-4 md:h-[400px] max-h-[400px] overflow-y-auto ">
      <div className="flex gap-3">
        {/* Card 1: You've been matched */}
        <Card className="shadow-md flex-grow">
          <CardBody>
            <div className="flex gap-3 flex-col">
              <div className="flex justify-center h-[150px]">
                <ScaleIcon />
              </div>
              <div className="flex flex-col py-8">
                <h1 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark">
                  You've been matched with Morgan & Morgan
                </h1>
                <p className="text-center text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  America's largest personal injury law firm
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Card 2: Benefits + CTA */}
        <Card className="shadow-md flex-grow">
          <CardBody className="flex flex-col my-auto gap-4 align-middle h-[90%]">
            <div className="gap-2 my-auto  flex flex-col">
              <div className="flex items-start gap-2">
                <CheckmarkIcon />
                <p className="text-sm text-text-primary-light dark:text-text-primary-dark">
                  A local lawyer will call you within 24 hours
                </p>
              </div>

              <div className="flex items-start gap-2">
                <CheckmarkIcon />
                <p className="text-sm text-text-primary-light dark:text-text-primary-dark">
                  The lawyer will have this chat for context
                </p>
              </div>

              <div className="flex items-start gap-2">
                <CheckmarkIcon />
                <p className="text-sm text-text-primary-light dark:text-text-primary-dark">
                  If your case is accepted, you won't pay anything
                </p>
              </div>
            </div>

            <Button onClick={() => setShowForm(true)} fullWidth>
              Get Free Consultation
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
