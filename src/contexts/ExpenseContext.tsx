
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Define types for transactions
export type Transaction = {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'expense' | 'income';
};

// Define interface for expense state
interface ExpenseState {
  transactions: Transaction[];
  monthlyBudget: number;
}

// Define action types
type ExpenseAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_BUDGET'; payload: number }
  | { type: 'LOAD_DATA'; payload: ExpenseState };

// Create the context
const ExpenseContext = createContext<{
  state: ExpenseState;
  dispatch: React.Dispatch<ExpenseAction>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  setBudget: (amount: number) => void;
  totalExpenses: number;
  totalIncome: number;
  remainingBudget: number;
  getTransactionsByMonth: (month: number, year: number) => Transaction[];
  getCategoryTotals: (type: 'expense' | 'income') => Record<string, number>;
} | undefined>(undefined);

// Initial state
const initialState: ExpenseState = {
  transactions: [],
  monthlyBudget: 0,
};

// Expense reducer
function expenseReducer(state: ExpenseState, action: ExpenseAction): ExpenseState {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(
          (transaction) => transaction.id !== action.payload
        ),
      };
    case 'SET_BUDGET':
      return {
        ...state,
        monthlyBudget: action.payload,
      };
    case 'LOAD_DATA':
      return action.payload;
    default:
      return state;
  }
}

// Create the provider component
export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem('expenseData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', payload: parsedData });
      } catch (error) {
        console.error('Error parsing saved expense data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('expenseData', JSON.stringify(state));
  }, [state]);

  // Helper function to add a transaction
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
  };

  // Helper function to delete a transaction
  const deleteTransaction = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  // Helper function to set the budget
  const setBudget = (amount: number) => {
    dispatch({ type: 'SET_BUDGET', payload: amount });
  };

  // Calculate total expenses
  const totalExpenses = state.transactions
    .filter((t) => t.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);

  // Calculate total income
  const totalIncome = state.transactions
    .filter((t) => t.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0);

  // Calculate remaining budget
  const remainingBudget = state.monthlyBudget - totalExpenses;

  // Get transactions for a specific month
  const getTransactionsByMonth = (month: number, year: number) => {
    return state.transactions.filter((transaction) => {
      const date = new Date(transaction.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  };

  // Get category totals
  const getCategoryTotals = (type: 'expense' | 'income') => {
    const categoryTotals: Record<string, number> = {};
    state.transactions
      .filter((t) => t.type === type)
      .forEach((transaction) => {
        if (!categoryTotals[transaction.category]) {
          categoryTotals[transaction.category] = 0;
        }
        categoryTotals[transaction.category] += transaction.amount;
      });
    return categoryTotals;
  };

  const value = {
    state,
    dispatch,
    addTransaction,
    deleteTransaction,
    setBudget,
    totalExpenses,
    totalIncome,
    remainingBudget,
    getTransactionsByMonth,
    getCategoryTotals,
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};

// Custom hook to use the expense context
export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
