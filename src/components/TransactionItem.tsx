
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ArrowDownRight, ArrowUpRight, Trash2 } from 'lucide-react';
import { Transaction, useExpense } from '@/contexts/ExpenseContext';
import { cn } from '@/lib/utils';

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const { deleteTransaction } = useExpense();
  const isExpense = transaction.type === 'expense';
  
  // Get currency symbol based on locale
  const currencySymbol = new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'symbol',
  }).format(0).replace(/\d/g, '').trim();
  
  // Format date to relative time
  const timeAgo = formatDistanceToNow(new Date(transaction.date), { addSuffix: true });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(transaction.id);
    }
  };

  const categoryIcons: Record<string, string> = {
    food: '🍔',
    groceries: '🛒',
    transportation: '🚗',
    entertainment: '🎬',
    shopping: '🛍️',
    health: '🏥',
    utilities: '📱',
    housing: '🏠',
    education: '🎓',
    salary: '💰',
    investment: '📈',
    gift: '🎁',
    other: '📝',
  };

  const icon = categoryIcons[transaction.category.toLowerCase()] || '📝';

  return (
    <div className="flex items-center justify-between p-4 border-b border-border">
      <div className="flex items-center">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted mr-3">
          <span className="text-lg">{icon}</span>
        </div>
        <div>
          <p className="font-medium">{transaction.description}</p>
          <p className="text-xs text-muted-foreground">
            {transaction.category} • {timeAgo}
          </p>
        </div>
      </div>
      
      <div className="flex items-center">
        <p
          className={cn(
            "font-semibold mr-3",
            isExpense ? "text-expense" : "text-income"
          )}
        >
          {isExpense ? '-' : '+'}
          {currencySymbol}
          {transaction.amount.toFixed(2)}
        </p>
        
        <button
          onClick={handleDelete}
          className="text-muted-foreground hover:text-destructive transition-colors"
          aria-label="Delete transaction"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TransactionItem;
