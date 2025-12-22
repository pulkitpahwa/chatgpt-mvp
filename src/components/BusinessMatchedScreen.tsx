import { useState } from "react";
import { Button } from "@openai/apps-sdk-ui/components/Button";
import { Input } from "@openai/apps-sdk-ui/components/Input";
import { Textarea } from "@openai/apps-sdk-ui/components/Textarea";
import { Alert } from "@openai/apps-sdk-ui/components/Alert";
import MMIntroImage from "../../public/mm-intro.png";

// Extend Window interface for webplus
declare global {
  interface Window {
    webplus?: {
      requestDisplayMode?: (options: { mode: string }) => void;
    };
  }
}

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
  phone: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

interface BusinessMatchedScreenProps {
  onSubmit: (data: FormData & { phone: string }) => Promise<void>;
  loading?: boolean;
  error?: Error | null;
}

export function BusinessMatchedScreen({
  onSubmit,
  loading = false,
  error = null,
}: BusinessMatchedScreenProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    notes: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const changeFormShowStatus = (status: boolean) => {
    setShowForm(status);
    window.scrollTo(0, 0);
    if (status) {
      if (window?.webplus?.requestDisplayMode) {
        window.webplus.requestDisplayMode({ mode: "fullscreen" });
      }
    } else {
      document.exitFullscreen?.();
    }
  };

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
    await onSubmit({ ...formData, phone: formData.phone || "" });
  };

  // Form View
  if (showForm) {
    return (
      <div className="p-4 max-h-[480px] overflow-y-auto">
        <div className="bg-background-secondary rounded-xl shadow-sm">
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
              Share your business details
            </h2>
          </div>

          {/* Form */}
          <div className="space-y-3">
            {/* Row 1: Full Name, Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground-primary mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  className="h-[48px] px-[16px]"
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
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <Input
                  className="h-[48px] px-[16px]"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  invalid={!!formErrors.phone}
                  placeholder="Enter your phone"
                />
                {formErrors.phone && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.phone}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-primary mb-1">
                  Email Address
                </label>
                <Input
                  className="h-[48px] px-[16px]"
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
                Business details (optional)
              </label>
              <Textarea
                value={formData.notes}
                className="py-[12px] px-[16px]"
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Describe your business legal needs"
                rows={2}
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
              className={`text-white rounded-lg py-2 w-[100%] px-4`}
            >
              Send to lawyer
            </Button>

            <p className="text-xs text-foreground-tertiary text-center">
              By submitting, you agree to be contacted about your business
              matter.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Initial Card View
  return (
    <div className="flex p-4 md:h-[480px] xs:h-[480px] max-h-[480px] overflow-y-auto">
      <div className="flex gap-3 w-full flex-col shadow">
        {/* Card: Benefits + CTA for Business */}
        <div className="bg-background-secondary rounded-xl shadow-lg flex-1 flex flex-col justify-center border-[0.5px] border-[#0D0D0D26]">
          <img
            src={MMIntroImage}
            alt="Morgan & Morgan"
            className="mb-4 rounded h-[160px] object-cover object-top"
          />
          <div className="gap-3 flex flex-col mb-4 px-4">
            <div className="flex items-start">
              <p className=" text-foreground-primary flex flex-col md:flex-row">
                <span className="font-[700] text-[16px] leading-[140%] text-[#0D0D0D]">
                  Business Legal Consultation
                </span>
                <span className="md:px-2 font-[400] text-[14px] leading-[20px] text-[#0D0D0D] items-center flex md:pt-1">
                  Expert Business Law Support
                </span>
              </p>
            </div>

            <div className="flex items-start gap-1">
              <ul className="text-[#5D5D5D] text-[14px] leading-[20px] list-disc ml-4 flex flex-col gap-1">
                <li>
                  Connect with an experienced business law attorney for
                  consultation
                </li>
                <li>
                  Contract disputes, corporate matters, and commercial
                  litigation
                </li>
                <li>Get expert guidance on your business legal needs</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 px-4">
            <Button
              color="primary"
              onClick={() => {
                changeFormShowStatus(true);
              }}
              id="show-form-button"
              className="text-white rounded-lg py-2 w-[100%] px-4 text-[14px]"
            >
              Get Business Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
