import { useState } from "react";
import { Input } from "@openai/apps-sdk-ui/components/Input";
import { Alert } from "@openai/apps-sdk-ui/components/Alert";
import { ArrowRightIcon, CheckIcon } from "@phosphor-icons/react";

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

interface NotMatchedScreenProps {
  onSubmit: (data: FormData) => Promise<void>;
  loading?: boolean;
  error?: Error | null;
}

export function NotMatchedScreen({
  onSubmit,
  loading = false,
  error = null,
}: NotMatchedScreenProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [consentChecked, setConsentChecked] = useState(false);

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

  if (typeof window.openai?.notifyIntrinsicHeight === "function") {
    window.openai.notifyIntrinsicHeight();
  }

  return (
    <div className="p-4 overflow-y-auto">
      {/* Title */}
      <h1 className="text-[22px] font-bold text-center text-black mb-3">
        No Attorneys Available
      </h1>

      <p className="text-[14px] text-center text-black">
        We couldn’t find any lawyers with relevant experience to this matter.
        However, we can keep looking and contact if you match.
      </p>

      {/* Form fields */}
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.name}
            className="h-[48px] px-[16px] border-[1px] border-gray-200 focus:border-gray-500 focus:border-[1px] focus:ring-0 focus:outline-none transition-colors text-[#000] placeholder-gray-400"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            invalid={!!formErrors.name}
            placeholder="Enter your name"
          />
          {formErrors.name && (
            <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <Input
            type="tel"
            value={formData.phone}
            className="h-[48px] px-[16px] border-[1px] border-gray-200 focus:border-gray-500 focus:border-[1px] focus:ring-0 focus:outline-none transition-colors text-[#000] placeholder-gray-400"
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            invalid={!!formErrors.phone}
            placeholder="Enter your mobile number"
          />
          {formErrors.phone && (
            <p className="text-sm text-red-500 mt-1">{formErrors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            value={formData.email}
            className="h-[48px] px-[16px] border-[1px] border-gray-200 focus:border-gray-500 focus:border-[1px] focus:ring-0 focus:outline-none transition-colors text-[#000] placeholder-gray-400"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            invalid={!!formErrors.email}
            placeholder="john@company.com"
          />
          {formErrors.email && (
            <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
          )}
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

        {/* Consent */}
        <label className="text-xs text-[#374151] flex items-start gap-2 cursor-pointer">
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
          <div>
            <input
              type="checkbox"
              className="sr-only"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
            />
            <span>
              I consent to your{" "}
              <a
                href="https://www.inhouse.ai/terms-of-service"
                target="_blank"
                className="underline"
              >
                Terms
              </a>{" "}
              &{" "}
              <a
                href="https://www.inhouse.ai/privacy-policy"
                target="_blank"
                className="underline"
              >
                Privacy Policy
              </a>
              , and agree to receive automated communications including calls,
              texts, emails, and/or prerecorded messages.
            </span>
          </div>
        </label>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !consentChecked}
          className={`text-white rounded-[999px] w-full bg-[#1B2B48] px-[24px] py-[14px]
            hover:bg-[#111827] flex items-center justify-center gap-2 font-medium ${
              loading || !consentChecked ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          Keep Searching
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
}
