import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/app-shell';
import { ToastProvider } from './hooks/use-toast';
import { HomePage } from './pages/home';
import { NotFoundPage } from './pages/not-found';
import { RedirectPage } from './pages/redirect';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <AppShell>
                  <HomePage />
                </AppShell>
              }
            />
            <Route path="/:shortPath" element={<RedirectPage />} />
            <Route
              path="*"
              element={
                <AppShell>
                  <NotFoundPage />
                </AppShell>
              }
            />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}
