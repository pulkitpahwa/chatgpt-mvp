interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="mb-6">
      {/* Progress bar */}
      <div className="flex gap-2 mb-2">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div
              key={stepNumber}
              className={`
                h-1 flex-1 rounded-full transition-colors
                ${isCompleted || isCurrent
                  ? 'bg-primary'
                  : 'bg-gray-200 dark:bg-gray-700'
                }
              `}
            />
          );
        })}
      </div>

      {/* Step label */}
      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark text-center">
        Step {currentStep} of {totalSteps}
      </p>
    </div>
  );
}
