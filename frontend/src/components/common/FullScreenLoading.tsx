import React from "react";

type FullScreenLoadingProps = {
  message?: string;
};

const FullScreenLoading: React.FC<FullScreenLoadingProps> = ({
  message = "読み込み中...",
}) => {
  return (
    <div className="fixed inset-0 bg-blue-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center shadow-lg">
        {/* メインカラーの青を基調にしたスピナー */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <span className="text-blue-600 text-lg font-medium">{message}</span>
      </div>
    </div>
  );
};

export default FullScreenLoading;
