import { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BlogRoutes from './blog-routes';
import Index from './pages/Index';
import Catalogue from './pages/Catalogue';
import Admin from './pages/Admin';
import AuthError from './pages/AuthError';
import AdminLogin from './pages/AdminLogin';
import { initSiteContentFromBackend } from '@/data/siteContent';
import { initProductsFromBackend, initCategoriesFromBackend } from '@/data/productsStore';
import { authApi } from './lib/auth';
// MODULE_IMPORTS_START
// MODULE_IMPORTS_END

const queryClient = new QueryClient();

// Redirect to admin login if no token is present
const AuthCallbackHandler = () => {
  return <Navigate to="/admin/login" replace />;
};

const AppRoutes = () => {
  useEffect(() => {
    initSiteContentFromBackend();
    initProductsFromBackend();
    initCategoriesFromBackend();
  }, []);

  return (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/catalogue" element={<Catalogue />} />
    <Route path="/admin" element={<Admin />} />
    {/* <Route path="/blog/*" element={<BlogRoutes />} /> */}
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/auth/callback" element={<AuthCallbackHandler />} />
    <Route path="/auth/error" element={<AuthError />} />
    {/* MODULE_ROUTES_START */}
    {/* MODULE_ROUTES_END */}
  </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* MODULE_PROVIDERS_START */}
    {/* MODULE_PROVIDERS_END */}
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
    {/* MODULE_PROVIDERS_CLOSE */}
  </QueryClientProvider>
);

export default App;
export { AppRoutes };