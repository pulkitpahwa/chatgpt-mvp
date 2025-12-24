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
  CheckIcon,
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
  title: string;
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
  const [consentChecked, setConsentChecked] = useState(false);

  // Get match data from Redux store
  const reduxMatchData = useAppSelector((state) => state.match);

  // Use Redux state if available, otherwise fall back to props or defaults
  const matchInfo: MatchInfo = {
    who:
      reduxMatchData.message_copy || propMatchInfo?.who || defaultMatchInfo.who,
    why: reduxMatchData.why_copy || propMatchInfo?.why || defaultMatchInfo.why,
    nextSteps:
      reduxMatchData.nextsteps_copy ||
      propMatchInfo?.nextSteps ||
      defaultMatchInfo.nextSteps,
  };

  const changeFormShowStatus = (status: boolean) => {
    setShowForm(status);
    window.scrollTo(0, 0);
    // if (status) {
    //   if (window?.webplus?.requestDisplayMode) {
    //     window.webplus.requestDisplayMode({ mode: "fullscreen" });
    //   }
    // } else {
    //   document.exitFullscreen?.();
    // }
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

    // Phone validation - accepts formats like: (123) 456-7890, 123-456-7890, 1234567890, +1 123 456 7890
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else {
      const phoneDigits = formData.phone.replace(/\D/g, "");
      if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        errors.phone = "Please enter a valid phone number (10-15 digits)";
      }
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
              className="cursor-pointer p-4 rounded-full shadow-lg w-4 h-4 border border-[0.5px] border-[#0D0D0D1A] hover:bg-background-tertiary transition-colors flex items-center justify-center text-[#000]"
              aria-label="Go back"
            >
              <XIcon
                onClick={() => setShowForm(false)}
                className="cursor-pointer"
              />
            </button>
            <div className="flex text-center gap-2 mb-4 mt-[-20px]">
              <h2 className="text-[18px] text-center w-full font-semibold text-foreground-primary text-dark text-black">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground-primary mb-1 text-dark text-black">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  className="h-[48px] px-[16px] border-[1px] border-gray-100 focus:border-red-500 focus:border-[1px] focus:ring-0 focus:outline-none transition-colors text-[#000] placeholder-gray-400"
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
                <label className="block text-sm font-medium text-foreground-primary mb-1 text-dark text-black">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <Input
                  className="h-[48px] px-[16px] border-[1px] border-gray-100 focus:border-red-500 focus:border-[1px] focus:ring-0 focus:outline-none transition-colors text-[#000] placeholder-gray-400"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  invalid={!!formErrors.phone}
                  placeholder="Enter Your Phone. e.g.: (123) 456-7890"
                />
                {formErrors.phone && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.phone}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-dark text-black mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  className="h-[48px] px-[16px] border-[1px] border-gray-100 focus:border-red-500 focus:border-[1px] focus:ring-0 focus:outline-none transition-colors text-[#000] placeholder-gray-400"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  invalid={!!formErrors.email}
                  placeholder="Enter your email address"
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
                description={error.message}
                className="p-2"
              />
            )}

            <label className="text-xs text-foreground-tertiary my-3 flex items-start gap-2 cursor-pointer text-dark text-black">
              <div
                className={`w-4 h-4 mt-0.5 flex-shrink-0 border rounded flex items-center justify-center ${
                  consentChecked
                    ? "bg-[#1B2B48] border-[#1B2B48]"
                    : "border-gray-300 bg-white"
                }`}
              >
                {consentChecked && (
                  <CheckIcon className="w-3 h-3 text-white" weight="bold" />
                  // <svg
                  //   className="w-3 h-3 text-white"
                  //   fill="none"
                  //   stroke="currentColor"
                  //   viewBox="0 0 24 24"
                  // >
                  //   <path
                  //     strokeLinecap="round"
                  //     strokeLinejoin="round"
                  //     strokeWidth={3}
                  //     d="M5 13l4 4L19 7"
                  //   />
                  // </svg>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <input
                    type="checkbox"
                    className="sr-only rounded-full"
                    required
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    name="consent"
                  />
                  <div className="md:flex  md:flex-col gap-1 md:gap-2">
                    <span className="text-black text-dark">
                      I hereby express my consent to receive automated
                      communications including calls, texts, emails, and/or
                      prerecorded messages.{" "}
                    </span>
                    <span className="text-black text-dark">
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
                        Privacy Policy
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </label>
            <button
              onClick={handleSubmit}
              disabled={loading || !consentChecked}
              className={`text-white mt-2 rounded-[999px] w-full bg-[#1B2B48] px-[24px] py-[12px]
                hover:bg-[#111827] flex items-center justify-center gap-2 ${
                  loading || !consentChecked
                    ? "opacity-50 cursor-not-allowed"
                    : ""
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
            <CheckCircleIcon className="text-[#166534] " />
            <h2 className="text-[#166534] font-semibold text-lg">
              {labels.title}
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
