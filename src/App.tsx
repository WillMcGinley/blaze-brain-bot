import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DispensaryLocations from "./pages/DispensaryLocations";
import AICompanion from "./pages/AICompanion";
import PersonalCompanion from "./pages/PersonalCompanion";
import Subscriptions from "./pages/Subscriptions";
import RealTimeInventory from "./pages/RealTimeInventory";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dispensaries" element={<DispensaryLocations />} />
          <Route path="/ai-companion" element={<AICompanion />} />
          <Route path="/personal-companion" element={<PersonalCompanion />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/real-time-inventory" element={<RealTimeInventory />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
