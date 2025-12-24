// import { useNavigate } from "react-router-dom";

// interface LegalOption {
//   id: string;
//   title: string;
//   description: string;
//   icon: React.ReactNode;
//   route: string;
// }

// const legalOptions: LegalOption[] = [
//   {
//     id: "personal-injury",
//     title: "Personal Injury",
//     description:
//       "Car accidents, medical malpractice, workplace injuries, and more",
//     icon: <PersonalInjuryIcon />,
//     route: "/personal-injury",
//   },
//   {
//     id: "business-consultation",
//     title: "Business Consultation",
//     description:
//       "Business disputes, contracts, corporate law, and commercial matters",
//     icon: <BusinessIcon />,
//     route: "/business-consultation",
//   },
//   {
//     id: "other-legal",
//     title: "Other Legal Area",
//     description:
//       "Family law, criminal defense, immigration, real estate, and other areas",
//     icon: <OtherLegalIcon />,
//     route: "/not-available",
//   },
// ];

export function LegalAreaSelection() {
  // const navigate = useNavigate();

  return (
    <div className=" overflow-y-auto p-4">
      Dear user, <br />
      we are unable to identify your current requirements. please answer the
      questions as mentioned in the following message.
      <br />
      <br />
      Once you have provided the necessary information, tag @inhouselegal
      seeking legal assistance, and we will promptly connect you with a
      qualified attorney who can help address your needs.
      {/* <div className="bg-background-secondary rounded-xl p-6 shadow-sm border-[0.5px] border-[#0D0D0D26]">
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
      </div> */}
    </div>
  );
}
