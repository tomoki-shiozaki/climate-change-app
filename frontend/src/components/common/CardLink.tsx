import { Link } from "react-router-dom";

type CardLinkProps = {
  to: string;
  children: React.ReactNode;
};

export const CardLink = ({ to, children }: CardLinkProps) => {
  return (
    <Link
      to={to}
      className="
        block p-6 rounded-2xl bg-white shadow-md
        transition cursor-pointer
        hover:shadow-lg hover:-translate-y-1
      "
    >
      {children}
    </Link>
  );
};
