import { Icon } from "@iconify/react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export default function JobFair() {
  return (
    <div className="flex items-center justify-center w-full h-30 gap-2">
      <Alert className="bg-warning-50 text-warning-950 border-warning-200 w-fit mb-4">
        <Icon icon="material-symbols:info-outline-rounded" />
        <AlertTitle>Beta Access:</AlertTitle>
        <AlertDescription>
          Some features are still under development. Full launch coming in
          March.
        </AlertDescription>
      </Alert>
    </div>
  );
}
