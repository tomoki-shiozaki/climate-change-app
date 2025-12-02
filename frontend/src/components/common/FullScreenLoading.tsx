import React from "react";

type FullScreenLoadingProps = {
  message?: string;
};

const FullScreenLoading: React.FC<FullScreenLoadingProps> = ({
  message = "読み込み中...",
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center shadow-lg">
        {/* TailwindでSpinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <span className="text-gray-700 text-lg">{message}</span>
      </div>
    </div>
  );
};

export default FullScreenLoading;
