import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Wizard from "./pages/Wizard";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Assets from "./pages/Assets";
import AssetDetail from "./pages/AssetDetail";
import AssetCreate from "./pages/AssetCreate";
import NotFound from "./pages/NotFound";
import WorkOrders from "./pages/WorkOrders";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/wizard" element={<Wizard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/activos" element={<Assets />} />
          <Route path="/activos/nuevo" element={<AssetCreate />} />
          <Route path="/activos/:id" element={<AssetDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
