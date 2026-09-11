import { SimulatedButton } from "../../shared";

export function CaseActionButtons() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <SimulatedButton
        label="Schedule Follow-up Intake"
        toastMessage="Simulated action: Booking calendar appointment..."
        variant="primary"
        size="md"
      />
      <SimulatedButton
        label="Batch Mark as Referred"
        toastMessage="Simulated action: 4 students marked as referred."
        variant="outline"
        size="md"
      />
      <SimulatedButton
        label="Generate Disability Unit Monthly Summary"
        toastMessage="Simulated action: Report compiled for DUT administration."
        variant="outline"
        size="md"
      />
    </div>
  );
}
