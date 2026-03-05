import { useState, useEffect } from "react";
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
  state: string;
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
  formSubmitMessage: any;
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

  // Get match data from Redux store for dynamic content
  const reduxMatchData = useAppSelector((state) => state.match);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    notes: "",
    state: reduxMatchData.state || "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [consentChecked, setConsentChecked] = useState(false);

  // Sync state field from Redux when it updates
  useEffect(() => {
    if (reduxMatchData.state) {
      setFormData((prev) => ({ ...prev, state: reduxMatchData.state }));
    }
  }, [reduxMatchData.state]);

  // Use Redux state if available, otherwise fall back to config defaults
  const matchText = reduxMatchData.why_copy || config.matchText;
  const costText = reduxMatchData.pricing ?? config.costText;
  const turnAroundText = config.turnAroundText;

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
    window.openai?.notifyIntrinsicHeight?.();
    return (
      <div className="p-4 overflow-y-auto sm:h-[550px] md:h-[400px]">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground-primary mb-1 text-dark text-black">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  disabled={loading}
                  className="h-[48px] px-[16px] border-[1px] border-gray-100 focus:border-gray-500 focus:border-[1px] focus:ring-0 focus:outline-none transition-colors text-[#000] placeholder-gray-400"
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
                  className="h-[48px] px-[16px] border-[1px] border-gray-100 focus:border-gray-500 focus:border-[1px] focus:ring-0 focus:outline-none transition-colors text-[#000] placeholder-gray-400"
                  type="tel"
                  disabled={loading}
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
                  className="h-[48px] px-[16px] border-[1px] border-gray-100 focus:border-gray-500 focus:border-[1px] focus:ring-0 focus:outline-none transition-colors text-[#000] placeholder-gray-400"
                  type="email"
                  disabled={loading}
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
              <div>
                <label className="block text-sm font-medium text-dark text-black mb-1">
                  State
                </label>
                <select
                  className="w-full h-[48px] px-[16px] border-[1px] border-gray-150 rounded-lg focus:border-gray-500 focus:ring-0 focus:outline-none transition-colors text-[#000] bg-white"
                  value={formData.state}
                  disabled={loading}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                >
                  <option value="">Select State</option>
                  <option value="Alabama">Alabama</option>
                  <option value="Alaska">Alaska</option>
                  <option value="Arizona">Arizona</option>
                  <option value="Arkansas">Arkansas</option>
                  <option value="California">California</option>
                  <option value="Colorado">Colorado</option>
                  <option value="Connecticut">Connecticut</option>
                  <option value="Delaware">Delaware</option>
                  <option value="Florida">Florida</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Hawaii">Hawaii</option>
                  <option value="Idaho">Idaho</option>
                  <option value="Illinois">Illinois</option>
                  <option value="Indiana">Indiana</option>
                  <option value="Iowa">Iowa</option>
                  <option value="Kansas">Kansas</option>
                  <option value="Kentucky">Kentucky</option>
                  <option value="Louisiana">Louisiana</option>
                  <option value="Maine">Maine</option>
                  <option value="Maryland">Maryland</option>
                  <option value="Massachusetts">Massachusetts</option>
                  <option value="Michigan">Michigan</option>
                  <option value="Minnesota">Minnesota</option>
                  <option value="Mississippi">Mississippi</option>
                  <option value="Missouri">Missouri</option>
                  <option value="Montana">Montana</option>
                  <option value="Nebraska">Nebraska</option>
                  <option value="Nevada">Nevada</option>
                  <option value="New Hampshire">New Hampshire</option>
                  <option value="New Jersey">New Jersey</option>
                  <option value="New Mexico">New Mexico</option>
                  <option value="New York">New York</option>
                  <option value="North Carolina">North Carolina</option>
                  <option value="North Dakota">North Dakota</option>
                  <option value="Ohio">Ohio</option>
                  <option value="Oklahoma">Oklahoma</option>
                  <option value="Oregon">Oregon</option>
                  <option value="Pennsylvania">Pennsylvania</option>
                  <option value="Rhode Island">Rhode Island</option>
                  <option value="South Carolina">South Carolina</option>
                  <option value="South Dakota">South Dakota</option>
                  <option value="Tennessee">Tennessee</option>
                  <option value="Texas">Texas</option>
                  <option value="Utah">Utah</option>
                  <option value="Vermont">Vermont</option>
                  <option value="Virginia">Virginia</option>
                  <option value="Washington">Washington</option>
                  <option value="West Virginia">West Virginia</option>
                  <option value="Wisconsin">Wisconsin</option>
                  <option value="Wyoming">Wyoming</option>
                  <option value="District of Columbia">
                    District of Columbia
                  </option>
                </select>
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
                      I consent to your{" "}
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
                      , and agree to receive automated communications including
                      calls, texts, emails, and/or prerecorded messages.{" "}
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
              {!loading ? (
                <>
                  {config.submitButtonText}
                  <span>
                    <ArrowRightIcon />
                  </span>
                </>
              ) : (
                <div className="w-5 h-5 border-2 border-white border-t-[#1B2B48] rounded-full animate-spin"></div>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Card View
  return (
    <div className="overflow-y-auto p-2 sm:h-[450px] md:h-[350px]">
      <div className="bg-background-secondary rounded-xl shadow-sm  shadow-md">
        {/* Header with logo and firm info */}
        <div className="bg-[#E3EFE3] rounded-tl-xl rounded-tr-[20px] px-4 relative">
          {/* Matched badge */}
          <div className="absolute top-[-3px] right-[0px]">
            <span className="px-[16px] py-[4px] text-[12px] font-[600] text-white rounded-tl-0 rounded-tr-full rounded-bl-full bg-gradient-to-r from-[#A843AA] to-[#DF8A64] h-[26px]">
              Matched
            </span>
          </div>

          {/* Logo and firm info */}
          <div className="flex items-center gap-3 py-2">
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
        <div className="p-4 space-y-4 border border border-[#E5E7EB] rounded-b-xl">
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
          {costText && (
            <>
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
            </>
          )}

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
