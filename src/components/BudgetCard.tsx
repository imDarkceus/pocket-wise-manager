
import React, { useState } from 'react';
import { Edit, Save } from 'lucide-react';
import { useExpense } from '@/contexts/ExpenseContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CustomProgress } from '@/components/ui/custom-progress';

const BudgetCard: React.FC = () => {
  const { state, setBudget, totalExpenses, remainingBudget } = useExpense();
  const [isEditing, setIsEditing] = useState(false);
  const [budgetInput, setBudgetInput] = useState(state.monthlyBudget.toString());
  
  // Get currency symbol based on locale
  const currencySymbol = new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'symbol',
  }).format(0).replace(/\d/g, '').trim();
  
  const handleSave = () => {
    const numericBudget = parseFloat(budgetInput);
    if (!isNaN(numericBudget) && numericBudget >= 0) {
      setBudget(numericBudget);
      setIsEditing(false);
    }
  };
  
  // Calculate progress percentage
  const progressPercentage = state.monthlyBudget > 0 
    ? Math.min(100, (totalExpenses / state.monthlyBudget) * 100)
    : 0;
  
  // Determine progress color based on percentage
  const getProgressColor = () => {
    if (progressPercentage >= 90) return 'bg-red-500';
    if (progressPercentage >= 75) return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-card shadow-sm rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Monthly Budget</h3>
        {isEditing ? (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSave}
            className="p-1 h-8 w-8"
          >
            <Save className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsEditing(true)}
            className="p-1 h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {isEditing ? (
        <div className="mb-3 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {currencySymbol}
          </span>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            className="pl-8"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
            }}
          />
        </div>
      ) : (
        <div className="text-2xl font-bold mb-3">
          {currencySymbol}{state.monthlyBudget.toFixed(2)}
        </div>
      )}
      
      <CustomProgress 
        value={progressPercentage} 
        className="h-2 mb-3" 
        indicatorClassName={getProgressColor()}
      />
      
      <div className="flex justify-between text-sm">
        <div>
          <p className="text-muted-foreground">Spent</p>
          <p className="font-medium">{currencySymbol}{totalExpenses.toFixed(2)}</p>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground">Remaining</p>
          <p className={`font-medium ${remainingBudget < 0 ? 'text-red-500' : ''}`}>
            {currencySymbol}{remainingBudget.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
