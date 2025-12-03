import React from "react";

type FullScreenLoadingProps = {
  message?: string;
};

const FullScreenLoading: React.FC<FullScreenLoadingProps> = ({
  message = "読み込み中...",
}) => {
  return (
    <div className="fixed inset-0 bg-gray-100/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 flex flex-col items-center shadow-lg border border-gray-200">
        {/* ドットアニメーション */}
        <div className="flex space-x-2">
          <div className="h-3 w-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.32s]"></div>
          <div className="h-3 w-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.16s]"></div>
          <div className="h-3 w-3 bg-blue-600 rounded-full animate-bounce"></div>
        </div>

        <span className="text-gray-700 text-base font-medium mt-4">
          {message}
        </span>
      </div>
    </div>
  );
};

export default FullScreenLoading;
