import { AuthProvider } from "@/features/auth/context/AuthProvider";
import { ErrorProvider, useErrorContext } from "./context/error";
import { AppLayout } from "@/components/layout";

import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "./queryClient";

function App() {
  return (
    <div className="App d-flex flex-column min-vh-100">
      <ErrorProvider>
        <AppWithQueryClient />
      </ErrorProvider>
    </div>
  );
}

// ErrorContext の setError を使って QueryClient を作る
const AppWithQueryClient = () => {
  const { setError } = useErrorContext();
  const queryClient = createQueryClient(setError);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
