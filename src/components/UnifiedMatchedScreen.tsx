import { useState } from "react";
import { Input } from "@openai/apps-sdk-ui/components/Input";
import { Alert } from "@openai/apps-sdk-ui/components/Alert";
import {
  CheckCircleIcon,
  ArrowRightIcon,
  XIcon,
  CheckIcon,
  ArrowsClockwiseIcon,
  MoneyWavyIcon,
} from "@phosphor-icons/react";
import { useAppSelector } from "../store/hooks";

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

export interface MatchConfig {
  // Header
  logo?: React.ReactNode;
  firmName: string;
  firmSubtitle: string;
  // Content
  matchText: string;
  costText: string;
  turnAroundText: string;
  // Button
  buttonText: string;
  // Form
  formTitle: string;
  formSubtitle: string;
  submitButtonText: string;
  termsUrl: string;
  privacyUrl: string;
}

export interface UnifiedMatchedScreenProps {
  config: MatchConfig;
  onSubmit: (data: FormData) => Promise<void>;
  loading?: boolean;
  error?: Error | null;
}

export function UnifiedMatchedScreen({
  config,
  onSubmit,
  loading = false,
  error = null,
}: UnifiedMatchedScreenProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [consentChecked, setConsentChecked] = useState(false);

  // Get match data from Redux store for dynamic content
  const reduxMatchData = useAppSelector((state) => state.match);

  // Use Redux state if available, otherwise fall back to config defaults
  const matchText = reduxMatchData.message_copy || config.matchText;
  const costText = reduxMatchData.why_copy || config.costText;
  const turnAroundText = reduxMatchData.nextsteps_copy || config.turnAroundText;

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
                {config.formTitle}
              </h2>
            </div>
            <p className="text-[16px] text-center text-[#011513]">
              {config.formSubtitle}
            </p>
          </div>

          {/* Form */}
          <div className="flex gap-2 flex-col">
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
                  <div className="md:flex md:flex-col gap-1 md:gap-2">
                    <span className="text-black text-dark">
                      I hereby express my consent to receive automated
                      communications including calls, texts, emails, and/or
                      prerecorded messages.{" "}
                    </span>
                    <span className="text-black text-dark">
                      By submitting this form, you agree to our{" "}
                      <a
                        href={config.termsUrl}
                        target="_blank"
                        className="underline"
                      >
                        Terms
                      </a>{" "}
                      & acknowledge our{" "}
                      <a
                        href={config.privacyUrl}
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
              {config.submitButtonText}{" "}
              <span>
                <ArrowRightIcon />
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Card View
  return (
    <div className="overflow-y-auto p-2">
      <div className="bg-background-secondary rounded-xl shadow-sm border border-[#E5E7EB] shadow-md">
        {/* Header with logo and firm info */}
        <div className="bg-[#E3EFE3] rounded-t-xl px-4 py-4 relative">
          {/* Matched badge */}
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 text-sm font-medium text-white rounded-full bg-gradient-to-r from-[#F97316] to-[#EC4899]">
              Matched
            </span>
          </div>

          {/* Logo and firm info */}
          <div className="flex items-center gap-3">
            {config.logo && <div className="flex-shrink-0">{config.logo}</div>}
            <div>
              <h2 className="text-[#111827] font-semibold text-lg">
                {config.firmName}
              </h2>
              <p className="text-[#6B7280] text-sm">{config.firmSubtitle}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Match */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5 text-[#027A48]">
              <CheckCircleIcon size={20} />
            </div>
            <p className="text-[14px] text-[#374151]">
              <span className="font-semibold text-[#111827]">Match: </span>
              {matchText}
            </p>
          </div>
          <hr className="text-[#D1D1D1]" />

          {/* Cost */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5 text-[#027A48]">
              <MoneyWavyIcon size={20} />
            </div>
            <p className="text-[14px] text-[#374151]">
              <span className="font-semibold text-[#111827]">Cost: </span>
              {costText}
            </p>
          </div>
          <hr className="text-[#D1D1D1]" />

          {/* Turn around */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5 text-[#027A48]">
              <ArrowsClockwiseIcon size={20} />
            </div>
            <p className="text-[14px] text-[#374151]">
              <span className="font-semibold text-[#111827]">
                Turn around:{" "}
              </span>
              {turnAroundText}
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-2">
            <button
              onClick={() => setShowForm(true)}
              id="show-form-button"
              className="w-full bg-[#1F2937] hover:bg-[#111827] text-white font-medium py-3 px-4 rounded-full transition-colors text-sm"
            >
              {config.buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
