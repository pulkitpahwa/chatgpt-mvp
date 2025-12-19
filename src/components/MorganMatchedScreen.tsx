import { useState } from "react";
import { Button } from "@openai/apps-sdk-ui/components/Button";
import { Input } from "@openai/apps-sdk-ui/components/Input";
import { Textarea } from "@openai/apps-sdk-ui/components/Textarea";
import { Alert } from "@openai/apps-sdk-ui/components/Alert";
import MMIntroImage from "../../public/mm-intro.png";

// Icons

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
        <div className="bg-background-secondary rounded-xl p-6 shadow-sm">
          {/* Back button and title */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setShowForm(false)}
              className="p-1 rounded hover:bg-background-tertiary transition-colors"
              aria-label="Go back"
            >
              <BackIcon />
            </button>
            <h2 className="text-sm font-semibold text-foreground-primary">
              Share your details
            </h2>
          </div>

          {/* Form */}
          <div className="space-y-3">
            {/* Row 1: Full Name, Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground-primary mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  invalid={!!formErrors.name}
                  placeholder="Your full name"
                />
                {formErrors.name && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-primary mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  invalid={!!formErrors.email}
                  placeholder="your@email.com"
                />
                {formErrors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Additional details */}
            <div>
              <label className="block text-sm font-medium text-foreground-primary mb-1">
                Additional details (optional)
              </label>
              <Textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Anything else you'd like the lawyer to know..."
                rows={3}
              />
            </div>

            {/* Error banner */}
            {error && (
              <Alert
                color="danger"
                title="Error"
                description={
                  error.message || "Failed to submit. Please try again."
                }
              />
            )}

            {/* Submit button */}
            <Button
              color="primary"
              onClick={handleSubmit}
              loading={loading}
              block
            >
              Get Free Consultation
            </Button>

            <p className="text-xs text-foreground-tertiary text-center">
              By submitting, you agree to be contacted about your case.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Two-Card View (default)
  return (
    <div className="flex p-4 md:h-[400px] max-h-screen overflow-y-auto">
      <div className="flex gap-3 w-full flex-col shadow ">
        {/* Card 1: No longer being used. this is discarded after the new designs were presented. th
        this will now come as message from the backend. */}
        {/* <div className="bg-background-secondary rounded-xl p-6 shadow-lg flex-1 border-[0.5px] border-[#0D0D0D26]">
          <div className="flex gap-3 flex-col h-full justify-center">
            <div className="flex flex-col  py-4">
              <h1 className="text-base text-foreground-primary">
                <b>Inhouse</b> determined this issue is a strong fit and matched
                you with <b>Morgan & Morgan</b>, the nation’s largest
                plaintiff-side law firm.
              </h1>
            </div>
          </div>
        </div> */}

        {/* Card 2: Benefits + CTA */}
        <div className="bg-background-secondary rounded-xl p-6 shadow-lg flex-1 flex flex-col justify-center shadow-lg border-[0.5px] border-[#0D0D0D26]">
          <img
            src={MMIntroImage}
            alt="Morgan & Morgan"
            className="mb-4 rounded"
          />
          <div className="gap-3 flex flex-col mb-4">
            <div className="flex items-start gap-2">
              <p className="text-sm text-foreground-primary flex flex-col md:flex-row">
                <span className="font-[700] text-[18px] leading-[160%] text-[#0D0D0D]">
                  Morgan & Morgan{" "}
                </span>
                <span className="font-[400] text-[14px] leading-[20px] text-[#0D0D0D]">
                  $25 Billion Recovered for Clients
                </span>
              </p>
            </div>

            <div className="flex items-start gap-2">
              <ul className="text-[#5D5D5D] text-[14px] leading-[20px] list-disc ml-5">
                <li>
                  Share your details and a local lawyer will call you within 24
                  hours{" "}
                </li>
                <li>If your case is accepted, you won’t pay</li>
              </ul>
            </div>
          </div>
          <Button
            color="primary"
            onClick={() => setShowForm(true)}
            block
            className="text-white rounded-lg px-4 py-2"
          >
            Consult Now, It’s Free!
          </Button>
          <p
            onClick={() => setShowForm(true)}
            className="font-[590] text-center px-4 mt-4 py-2 text-[14px] text-[#5D5D5D] leading-[20px]"
          >
            Have more questions?
          </p>
        </div>
      </div>
    </div>
  );
}
