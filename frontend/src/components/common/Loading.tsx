import Spinner from "react-bootstrap/Spinner";

type LoadingProps = {
  message?: string;
  className?: string;
};

export default function Loading({
  message = "読み込み中...",
  className = "text-center mt-5",
}: LoadingProps) {
  return (
    <div className={className}>
      <Spinner animation="border" role="status" className="me-2">
        <span className="visually-hidden">{message}</span>
      </Spinner>
      {message}
    </div>
  );
}
