import type { ReactNode } from "react";

type CenteredBoxProps = {
  children: ReactNode;
};

export function CenteredBox({ children }: CenteredBoxProps) {
  return <div className="mt-4 flex justify-center">{children}</div>;
}
