
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ExpenseProvider } from "./contexts/ExpenseContext";
import { useState } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import AddIncome from "./pages/AddIncome";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const App = () => {
  // Create a new QueryClient instance and maintain it with useState
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ExpenseProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-expense" element={<AddExpense />} />
              <Route path="/add-income" element={<AddIncome />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ExpenseProvider>
    </QueryClientProvider>
  );
};

export default App;
