import React from "react";

type HomeLayoutProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export const HomeLayout: React.FC<HomeLayoutProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="px-6 py-16 text-center max-w-3xl mx-auto space-y-10">
      <header className="space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
        {description && (
          <p className="text-lg text-gray-600 leading-relaxed">{description}</p>
        )}
      </header>

      {children}
    </div>
  );
};
