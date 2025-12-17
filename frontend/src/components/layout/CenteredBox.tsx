import type { ReactNode } from "react";

type CenteredBoxProps = {
  children: ReactNode;
};

export function CenteredBox({ children }: CenteredBoxProps) {
  return (
    <div className="mt-5 mx-auto" style={{ maxWidth: "500px" }}>
      {children}
    </div>
  );
}
