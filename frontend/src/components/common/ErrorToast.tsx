import { useEffect } from "react";
import { useErrorContext } from "@/context/error";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const ErrorToast = () => {
  const { error, clearError } = useErrorContext();

  useEffect(() => {
    if (error) {
      // 前のトーストを消して重複防止
      toast.dismiss();

      toast.error(error, {
        duration: 5000, // 5秒で自動消滅
        action: {
          label: "閉じる",
          onClick: clearError,
        },
        description: " ", // 空文字でもOK
      });
    }
  }, [error, clearError]);

  return (
    <>
      {/* グローバル Toaster は一度だけ置く */}
      <Toaster
        position="top-right"
        richColors
        className="max-w-xs p-2" // 幅とパディング調整
      />
    </>
  );
};

export default ErrorToast;
