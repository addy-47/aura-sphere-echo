
import * as React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import ChatPage from "./pages/ChatPage";
import CustomizePage from "./pages/CustomizePage";
import DashboardPage from "./pages/DashboardPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import { MoodProvider } from "./contexts/MoodContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import LoaderPage from "./components/LoaderPage";

// Create a client
const queryClient = new QueryClient();

// PageTransitionWrapper for handling transitions between pages
const PageTransitionWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = React.useState(false);
  const [prevPath, setPrevPath] = React.useState("");

  React.useEffect(() => {
    if (prevPath !== location.pathname) {
      setIsLoading(true);
      setPrevPath(location.pathname);
      
      // Simulate page loading time - adjust duration as needed
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [location.pathname, prevPath]);

  return (
    <>
      <LoaderPage isLoading={isLoading} />
      {children}
    </>
  );
};

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MoodProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <PageTransitionWrapper>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/customize" element={<CustomizePage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/signin" element={<SignInPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </PageTransitionWrapper>
            </BrowserRouter>
          </TooltipProvider>
        </MoodProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
