import type { ReactNode } from "react";
import { ErrorProvider } from "../ErrorProvider";

interface Props {
  children?: ReactNode;
}

export const TestErrorProvider = ({ children }: Props) => {
  return <ErrorProvider>{children}</ErrorProvider>;
};
