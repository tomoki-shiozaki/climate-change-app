import { AuthProvider } from "./context/AuthContext";
import { ErrorProvider } from "./context/ErrorContext";
import { AppContent } from "./components/layout";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <div className="App d-flex flex-column min-vh-100">
      <QueryClientProvider client={queryClient}>
        <ErrorProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ErrorProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
