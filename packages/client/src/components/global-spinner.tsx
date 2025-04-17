import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type GlobalSpinnerProps = {
  className?: string;
};

export function GlobalSpinner({ className }: GlobalSpinnerProps) {
  return (
    <div
      role="status"
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/75 backdrop-blur-sm",
        className,
      )}
    >
      <Loader2 className="h-10 w-10 text-primary animate-spin" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
