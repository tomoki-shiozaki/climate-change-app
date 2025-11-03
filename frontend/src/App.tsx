import { AuthProvider } from "./context/AuthContext";
import { ErrorProvider } from "./context/ErrorContext";
import { AppContent } from "./components/layout";

function App() {
  return (
    <div className="App d-flex flex-column min-vh-100">
      <ErrorProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ErrorProvider>
    </div>
  );
}

export default App;
