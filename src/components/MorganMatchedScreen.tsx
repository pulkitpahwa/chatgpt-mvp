import { useState } from "react";
// import { Button } from "@openai/apps-sdk-ui/components/Button";
import { Input } from "@openai/apps-sdk-ui/components/Input";
import { Textarea } from "@openai/apps-sdk-ui/components/Textarea";
import { Alert } from "@openai/apps-sdk-ui/components/Alert";
import {
  ArrowsMergeIcon,
  HandHeartIcon,
  UserCircleCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react";

// Extend Window interface for webplus
declare global {
  interface Window {
    webplus?: {
      requestDisplayMode?: (options: { mode: string }) => void;
    };
  }
}

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
  phone: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

interface MatchInfo {
  who: string;
  why: string;
  nextSteps: string;
}

interface MorganMatchedScreenProps {
  onSubmit: (data: FormData & { phone: string }) => Promise<void>;
  loading?: boolean;
  error?: Error | null;
  matchInfo?: MatchInfo;
}

const defaultMatchInfo: MatchInfo = {
  who: "Morgan & Morgan, a national law firm of 1,000 PI attorneys in all 50 states",
  why: "Your chat describes a plane accident at the runway at JFK, and this firm has a strong aviation practice in NY",
  nextSteps:
    "The NY office will review your chat and call you within 24 hours to discuss your case. If they take it, you pay only if they win.",
};

export function MorganMatchedScreen({
  onSubmit,
  loading = false,
  error = null,
  matchInfo = defaultMatchInfo,
}: MorganMatchedScreenProps) {
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
    await onSubmit(formData);
  };

  // Form View
  if (showForm) {
    return (
      <div className=" overflow-y-auto">
        <div className="bg-background-secondary rounded-xl shadow-sm p-4">
          {/* Back button and title */}
          <div className="flex items-center gap-2 mb-3">
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
          <div className="space-y-2">
            {/* Row 1: Full Name, Email */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium text-foreground-primary mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  className="h-[40px] px-[12px]"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  invalid={!!formErrors.name}
                  placeholder="Your full name"
                />
                {formErrors.name && (
                  <p className="text-xs text-red-500 mt-0.5">
                    {formErrors.name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground-primary mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <Input
                  className="h-[40px] px-[12px]"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  invalid={!!formErrors.phone}
                  placeholder="Enter your phone"
                />
                {formErrors.phone && (
                  <p className="text-xs text-red-500 mt-0.5">
                    {formErrors.phone}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground-primary mb-1">
                  Email Address
                </label>
                <Input
                  className="h-[40px] px-[12px]"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  invalid={!!formErrors.email}
                  placeholder="your@email.com"
                />
                {formErrors.email && (
                  <p className="text-xs text-red-500 mt-0.5">
                    {formErrors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Additional details */}
            <div>
              <label className="block text-xs font-medium text-foreground-primary mb-1">
                Additional context (optional)
              </label>
              <Textarea
                value={formData.notes}
                className="py-[8px] px-[12px]"
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Case details which aren't in your chat"
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

  // Matched View (default)
  return (
    <div className="overflow-y-auto p-2">
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
              Connect with Morgan & Morgan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
