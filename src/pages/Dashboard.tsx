
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Wallet, ArrowDown, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useExpense } from '@/contexts/ExpenseContext';
import BottomNav from '@/components/BottomNav';
import BudgetCard from '@/components/BudgetCard';
import TransactionItem from '@/components/TransactionItem';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { state, totalExpenses, totalIncome } = useExpense();
  const [activeTab, setActiveTab] = useState('all');
  
  // Get currency symbol based on locale
  const currencySymbol = new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'symbol',
  }).format(0).replace(/\d/g, '').trim();
  
  // Filter transactions based on active tab
  const filteredTransactions = state.transactions.filter(transaction => {
    if (activeTab === 'all') return true;
    return transaction.type === activeTab;
  });
  
  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 dark:bg-secondary">
        <h1 className="text-2xl font-bold mb-4">PocketWise</h1>
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-primary-foreground/80 dark:text-white/80 text-sm">Total Balance</p>
            <p className="text-2xl font-bold dark:text-white">
              {currencySymbol}{(totalIncome - totalExpenses).toFixed(2)}
            </p>
          </div>
          <Button 
            variant="outline" 
            className="bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/20 dark:bg-white/10 dark:border-white/20 dark:hover:bg-white/20 dark:text-white"
            onClick={() => navigate('/statistics')}
          >
            <Wallet className="h-4 w-4 mr-2" />
            Statistics
          </Button>
        </div>
        
        <div className="flex space-x-4 mt-4">
          <div className="bg-primary-foreground/10 dark:bg-white/10 rounded-lg p-3 flex-1">
            <div className="flex items-center">
              <div className="bg-green-500/20 rounded-full p-2 mr-2">
                <ArrowUp className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-primary-foreground/80 dark:text-white/80 text-sm">Income</p>
            </div>
            <p className="text-lg font-bold mt-1 dark:text-white">
              {currencySymbol}{totalIncome.toFixed(2)}
            </p>
          </div>
          
          <div className="bg-primary-foreground/10 dark:bg-white/10 rounded-lg p-3 flex-1">
            <div className="flex items-center">
              <div className="bg-red-500/20 rounded-full p-2 mr-2">
                <ArrowDown className="h-4 w-4 text-red-500" />
              </div>
              <p className="text-primary-foreground/80 dark:text-white/80 text-sm">Expenses</p>
            </div>
            <p className="text-lg font-bold mt-1 dark:text-white">
              {currencySymbol}{totalExpenses.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      
      {/* Budget Card */}
      <div className="px-4 -mt-4">
        <BudgetCard />
      </div>
      
      {/* Transactions List */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Transactions</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/add-expense')}
              className="text-expense"
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Expense
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/add-income')}
              className="text-income"
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Income
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="expense">Expenses</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            <ScrollArea className="h-[calc(100vh-430px)] rounded-md border">
              {sortedTransactions.length > 0 ? (
                sortedTransactions.map((transaction) => (
                  <TransactionItem 
                    key={transaction.id} 
                    transaction={transaction} 
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center p-4">
                  <p className="text-muted-foreground mb-2">No transactions found</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/add-${activeTab === 'income' ? 'income' : 'expense'}`)}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" /> 
                    Add {activeTab === 'income' ? 'Income' : 'Expense'}
                  </Button>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Dashboard;
