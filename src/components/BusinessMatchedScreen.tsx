import { useState } from "react";
import { Input } from "@openai/apps-sdk-ui/components/Input";
import { Textarea } from "@openai/apps-sdk-ui/components/Textarea";
import { Alert } from "@openai/apps-sdk-ui/components/Alert";
import {
  ArrowRightIcon,
  ArrowsMergeIcon,
  CheckCircleIcon,
  HandHeartIcon,
  UserCircleCheckIcon,
} from "@phosphor-icons/react";

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

interface MatchInfo {
  who: string;
  why: string;
  nextSteps: string;
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
  matchInfo?: MatchInfo;
}

const defaultMatchInfo: MatchInfo = {
  who: "Inhouse Counsel, P.C. a national business law firm connected to over 2,000 subject matter experts in business law",
  why: "You drafted a terms of service which is a commercial contract that they have significant experience in",
  nextSteps:
    "They will review your chat and Terms of Service draft and email you to coordinate a time for a video call. You'll pay $99 for 30 minutes of the lawyer's time.",
};

export function BusinessMatchedScreen({
  onSubmit,
  loading = false,
  error = null,
  matchInfo = defaultMatchInfo,
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
      <div className="p-4 overflow-y-auto">
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

            <p className="text-xs text-foreground-tertiary">
              [] I hereby expressly consent to receive automated communications
              including calls, texts, emails, and/or prerecorded messages.
            </p>
            <p className="text-xs text-foreground-tertiary">
              By submitting this form, you agree to our{" "}
              <a
                href="https://www.inhouse.ai/terms-of-service"
                target="_blank"
                className="underline"
              >
                Terms
              </a>{" "}
              & acknowledge our{" "}
              <a
                href="https://www.inhouse.ai/privacy-policy"
                target="_blank"
                className="underline"
              >
                Privacy Policy.
              </a>
            </p>
            <button
              onClick={handleSubmit}
              disabled={loading}
              // loading={loading}
              // block
              className={`text-white rounded-[999px] w-full bg-[#1B2B48] px-[24px] py-[12px] 
                hover:bg-[#111827] flex items-center justify-center gap-2 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              Submit{" "}
              <span className="">
                <ArrowRightIcon />
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Initial Card View
  return (
    <div className="flex p-4   overflow-y-auto">
      <div className="bg-background-secondary rounded-xl shadow-sm border border-[#E5E7EB] shadow-md">
        {/* Header with green background */}
        <div className="bg-[#E3EFE3] rounded-t-xl px-4 py-3">
          <div className="flex items-center gap-2">
            <CheckCircleIcon />
            <h2 className="text-[#166534] font-semibold text-lg">
              You've been matched
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Who */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5 text-[#027A48]">
              <UserCircleCheckIcon />
            </div>
            <p className="text-[14px] text-[#374151]">
              <span className="font-semibold text-[#111827]">Who: </span>
              {matchInfo.who}
            </p>
          </div>
          <hr className="text-[#D1D1D1]" />

          {/* Why */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5 text-[#027A48]">
              <HandHeartIcon />
            </div>
            <p className="text-[14px] text-[#374151]">
              <span className="font-semibold text-[#111827]">Why: </span>
              {matchInfo.why}
            </p>
          </div>
          <hr className="text-[#D1D1D1]" />

          {/* Next steps */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5 transform rotate-270 text-[#027A48]">
              <ArrowsMergeIcon />
            </div>
            <p className="text-[14px] text-[#374151]">
              <span className="font-semibold text-[#111827]">Next steps: </span>
              {matchInfo.nextSteps}
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                changeFormShowStatus(true);
              }}
              id="show-form-button"
              className="w-full bg-[#1F2937] hover:bg-[#111827] text-white font-medium py-3 px-4 rounded-full transition-colors text-sm"
            >
              Get Business Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
