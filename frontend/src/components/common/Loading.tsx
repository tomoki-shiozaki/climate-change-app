import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type LoadingProps = {
  message?: string;
  className?: string;
};

export function Loading({
  message = "読み込み中...",
  className = "text-center mt-5",
}: LoadingProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Spinner className="w-6 h-6 text-blue-500" />
      <span className="text-gray-800 text-base">{message}</span>
    </div>
  );
}
