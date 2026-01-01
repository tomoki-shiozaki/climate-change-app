import React from "react";

type PageLayoutProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8 space-y-8">
      <header>
        <h1 className="text-2xl font-semibold mb-6 text-gray-900">{title}</h1>
        {description && (
          <p className="text-base font-normal leading-relaxed text-gray-800">
            {description}
          </p>
        )}
      </header>

      {children}
    </div>
  );
};
