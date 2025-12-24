import { useState } from "react";
import { Input } from "@openai/apps-sdk-ui/components/Input";
import { Alert } from "@openai/apps-sdk-ui/components/Alert";
import {
  ArrowsMergeIcon,
  HandHeartIcon,
  UserCircleCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useAppSelector } from "../store/hooks";

// Extend Window interface for webplus
declare global {
  interface Window {
    webplus?: {
      requestDisplayMode?: (options: { mode: string }) => void;
    };
  }
}

export interface FormData {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export interface MatchInfo {
  who: string;
  why: string;
  nextSteps: string;
}

interface MatchedScreenLabels {
  firmName: string;
  whoLabel: string;
  whyLabel: string;
  nextStepsLabel: string;
  connectButtonText: string;
  formTitle: string;
  formSubtitle: string;
  submitButtonText: string;
  termsUrl: string;
  privacyUrl: string;
}

export interface MatchedScreenProps {
  onSubmit: (data: FormData) => Promise<void>;
  loading?: boolean;
  error?: Error | null;
  matchInfo?: MatchInfo;
  defaultMatchInfo: MatchInfo;
  labels: MatchedScreenLabels;
}

export function MatchedScreen({
  onSubmit,
  loading = false,
  error = null,
  matchInfo: propMatchInfo,
  defaultMatchInfo,
  labels,
}: MatchedScreenProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Get match data from Redux store
  const reduxMatchData = useAppSelector((state) => state.match);

  // Use Redux state if available, otherwise fall back to props or defaults
  const matchInfo: MatchInfo = {
    who:
      reduxMatchData.message_copy ||
      propMatchInfo?.who ||
      defaultMatchInfo.who,
    why:
      reduxMatchData.why_copy || propMatchInfo?.why || defaultMatchInfo.why,
    nextSteps:
      reduxMatchData.nextsteps_copy ||
      propMatchInfo?.nextSteps ||
      defaultMatchInfo.nextSteps,
  };

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
      <div className="p-4 overflow-y-auto">
        <div className="bg-background-secondary rounded-xl shadow-sm flex flex-col gap-3">
          {/* Back button and title */}
          <div className="flex flex-col">
            <button
              onClick={() => setShowForm(false)}
              className="p-4 rounded-full shadow-lg w-4 h-4 border border-[0.5px] border-[#0D0D0D1A] hover:bg-background-tertiary transition-colors flex items-center justify-center"
              aria-label="Go back"
            >
              <XIcon />
            </button>
            <div className="flex text-center gap-2 mb-4">
              <h2 className="text-[18px] text-center w-full font-semibold text-foreground-primary">
                {labels.formTitle}
              </h2>
            </div>
            <p className="text-[16px] text-center text-[#011513]">
              {labels.formSubtitle}
            </p>
          </div>

          {/* Form */}
          <div className="flex gap-2 flex-col">
            {/* Row 1: Full Name, Phone, Email */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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

            <p className="text-xs text-foreground-tertiary my-3">
              <span>
                <input
                  type="checkbox"
                  className="border w-2 h-2"
                  required
                  checked
                  name="consent"
                />
              </span>{" "}
              <span>
                I hereby express my consent to receive automated communications
                including calls, texts, emails, and/or prerecorded messages.
              </span>
            </p>
            <p className="text-xs text-foreground-tertiary">
              By submitting this form, you agree to our{" "}
              <a
                href={labels.termsUrl}
                target="_blank"
                className="underline"
              >
                Terms
              </a>{" "}
              & acknowledge our{" "}
              <a
                href={labels.privacyUrl}
                target="_blank"
                className="underline"
              >
                Privacy Policy.
              </a>
            </p>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`text-white mt-4 rounded-[999px] w-full bg-[#1B2B48] px-[24px] py-[12px]
                hover:bg-[#111827] flex items-center justify-center gap-2 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {labels.submitButtonText}{" "}
              <span>
                <ArrowRightIcon />
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Matched Card View (default)
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
              <span className="font-semibold text-[#111827]">
                {labels.whoLabel}{" "}
              </span>
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
              <span className="font-semibold text-[#111827]">
                {labels.whyLabel}{" "}
              </span>
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
              <span className="font-semibold text-[#111827]">
                {labels.nextStepsLabel}{" "}
              </span>
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
              {labels.connectButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
