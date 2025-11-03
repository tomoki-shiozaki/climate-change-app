import Toast from "react-bootstrap/Toast";
import { useErrorContext } from "../../context/ErrorContext";

const ErrorToast = () => {
  const { error, clearError } = useErrorContext();

  if (!error) return null;

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
      <Toast bg="danger" show autohide delay={5000} onClose={clearError}>
        <Toast.Body className="text-white">{error}</Toast.Body>
      </Toast>
    </div>
  );
};

export default ErrorToast;
