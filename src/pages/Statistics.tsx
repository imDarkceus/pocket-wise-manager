
import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useExpense } from '@/contexts/ExpenseContext';
import BottomNav from '@/components/BottomNav';
import ExpensePieChart from '@/components/ExpensePieChart';

const Statistics: React.FC = () => {
  const { getTransactionsByMonth, totalExpenses, totalIncome } = useExpense();
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  
  // Format month display
  const currentMonthDisplay = format(new Date(year, month, 1), 'MMMM yyyy');
  
  // Get transactions for the selected month
  const monthTransactions = useMemo(() => {
    return getTransactionsByMonth(month, year);
  }, [getTransactionsByMonth, month, year]);
  
  // Calculate monthly totals
  const monthlyExpenses = useMemo(() => {
    return monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, [monthTransactions]);
  
  const monthlyIncome = useMemo(() => {
    return monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, [monthTransactions]);
  
  // Handle month navigation
  const goToPreviousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };
  
  const goToNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };
  
  // Get currency symbol based on locale
  const currencySymbol = new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'symbol',
  }).format(0).replace(/\d/g, '').trim();
  
  // Generate years for the selector (5 years back and 5 years forward)
  const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i);
  
  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="bg-primary text-primary-foreground p-6">
        <h1 className="text-2xl font-bold mb-4">Statistics</h1>
        
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goToPreviousMonth}
            className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="text-center">
            <div className="text-primary-foreground/80 text-sm">Monthly Overview</div>
            <div className="text-xl font-semibold">{currentMonthDisplay}</div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goToNextMonth}
            className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex space-x-4 mt-4">
          <div className="bg-primary-foreground/10 rounded-lg p-3 flex-1">
            <p className="text-primary-foreground/80 text-sm">Income</p>
            <p className="text-lg font-bold mt-1">
              {currencySymbol}{monthlyIncome.toFixed(2)}
            </p>
          </div>
          
          <div className="bg-primary-foreground/10 rounded-lg p-3 flex-1">
            <p className="text-primary-foreground/80 text-sm">Expenses</p>
            <p className="text-lg font-bold mt-1">
              {currencySymbol}{monthlyExpenses.toFixed(2)}
            </p>
          </div>
          
          <div className="bg-primary-foreground/10 rounded-lg p-3 flex-1">
            <p className="text-primary-foreground/80 text-sm">Balance</p>
            <p className="text-lg font-bold mt-1">
              {currencySymbol}{(monthlyIncome - monthlyExpenses).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-6">
        <div className="flex flex-col space-y-4">
          <ExpensePieChart type="expense" />
          <ExpensePieChart type="income" />
        </div>
        
        <div className="bg-card rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Select Year</h3>
          <Select value={year.toString()} onValueChange={(value) => setYear(parseInt(value, 10))}>
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Statistics;
