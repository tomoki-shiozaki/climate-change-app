import { useErrorContext } from "../../context/error";

const ErrorAlert = () => {
  const { error, clearError } = useErrorContext();

  if (!error) return null;

  return (
    <div
      className="alert alert-danger d-flex justify-content-between align-items-center"
      role="alert"
    >
      <span>{error}</span>
      <button onClick={clearError} className="btn-close" aria-label="Close" />
    </div>
  );
};

export default ErrorAlert;
