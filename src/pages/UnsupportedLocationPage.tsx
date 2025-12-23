import { Button } from "@openai/apps-sdk-ui/components/Button";

const LocationIcon = () => (
  <svg
    className="w-6 h-6 text-amber-600 dark:text-amber-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

export function UnsupportedLocationPage() {
  return (
    <div className="max-h-[400px] overflow-y-auto">
      <div className="bg-background-secondary rounded-xl p-6 shadow-sm border-[0.5px] border-[#0D0D0D26]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <LocationIcon />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground-primary">
              Location Not Supported
            </h2>
            <p className="text-sm text-foreground-secondary">
              We're working to expand our coverage
            </p>
          </div>
        </div>

        <div className="p-4 bg-background-tertiary rounded-lg mb-6">
          <p className="text-sm text-foreground-secondary mb-4">
            We're sorry, but our legal matching services are not currently
            available in your location.
          </p>
          <p className="text-sm text-foreground-secondary mb-4">
            Our services are currently available in:
          </p>
          <ul className="text-sm text-foreground-secondary space-y-2 mb-4">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-medium shrink-0">•</span>
              <span>United States (all 50 states)</span>
            </li>
          </ul>
          <p className="text-sm text-foreground-secondary">
            We're actively working to bring our services to more regions. Please
            check back soon!
          </p>
        </div>

        <div className="space-y-3">
          <a
            href="https://www.forthepeople.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button color="primary" className="text-white rounded-lg" block>
              Visit Morgan & Morgan
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
