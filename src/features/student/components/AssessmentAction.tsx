import { SimulatedButton } from "../../shared";

export function AssessmentAction() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <SimulatedButton
        label="Start New Screening Assessment"
        toastMessage="Simulated action: Starting adaptive screening module..."
        variant="primary"
        size="md"
      />
      <SimulatedButton
        label="Download Indicator Summary"
        toastMessage="Simulated action: Generating PDF summary..."
        variant="outline"
        size="md"
      />
      <SimulatedButton
        label="Request Disability Unit Consultation"
        toastMessage="Simulated action: Opening appointment scheduler..."
        variant="outline"
        size="md"
      />
    </div>
  );
}
