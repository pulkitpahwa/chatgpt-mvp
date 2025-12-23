import { useNavigate } from "react-router-dom";

interface LegalOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
}

const PersonalInjuryIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const BusinessIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const OtherLegalIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
    />
  </svg>
);

const legalOptions: LegalOption[] = [
  {
    id: "personal-injury",
    title: "Personal Injury",
    description:
      "Car accidents, medical malpractice, workplace injuries, and more",
    icon: <PersonalInjuryIcon />,
    route: "/personal-injury",
  },
  {
    id: "business-consultation",
    title: "Business Consultation",
    description:
      "Business disputes, contracts, corporate law, and commercial matters",
    icon: <BusinessIcon />,
    route: "/business-consultation",
  },
  {
    id: "other-legal",
    title: "Other Legal Area",
    description:
      "Family law, criminal defense, immigration, real estate, and other areas",
    icon: <OtherLegalIcon />,
    route: "/not-available",
  },
];

export function LegalAreaSelection() {
  const navigate = useNavigate();

  return (
    <div className="max-h-[400px] overflow-y-auto">
      <div className="bg-background-secondary rounded-xl p-6 shadow-sm border-[0.5px] border-[#0D0D0D26]">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-foreground-primary mb-2">
            What type of legal help do you need?
          </h1>
          <p className="text-sm text-foreground-secondary">
            Select the area that best describes your situation
          </p>
        </div>

        <div className="space-y-3">
          {legalOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => navigate(option.route)}
              className="w-full p-4 bg-background-tertiary hover:bg-background-primary rounded-lg border border-transparent hover:border-[#0D0D0D26] transition-all text-left flex items-start gap-4 group"
            >
              <div className="w-10 h-10 rounded-full bg-background-primary group-hover:bg-background-secondary flex items-center justify-center text-foreground-secondary shrink-0">
                {option.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground-primary mb-1">
                  {option.title}
                </h3>
                <p className="text-sm text-foreground-secondary">
                  {option.description}
                </p>
              </div>
              <svg
                className="w-5 h-5 text-foreground-tertiary group-hover:text-foreground-secondary shrink-0 mt-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
