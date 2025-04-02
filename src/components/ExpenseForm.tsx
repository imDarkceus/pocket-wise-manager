
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useExpense } from '@/contexts/ExpenseContext';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ExpenseFormProps {
  type: 'expense' | 'income';
}

const categoryOptions = {
  expense: [
    'Food', 'Groceries', 'Transportation', 'Entertainment', 'Shopping', 
    'Health', 'Utilities', 'Housing', 'Education', 'Other'
  ],
  income: ['Salary', 'Investment', 'Gift', 'Other']
};

const ExpenseForm: React.FC<ExpenseFormProps> = ({ type }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addTransaction } = useExpense();
  
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return;
    }
    
    if (!category) {
      toast({
        title: 'Category required',
        description: 'Please select a category',
        variant: 'destructive',
      });
      return;
    }
    
    if (!description) {
      toast({
        title: 'Description required',
        description: 'Please enter a description',
        variant: 'destructive',
      });
      return;
    }
    
    addTransaction({
      amount: parseFloat(amount),
      category,
      description,
      date,
      type,
    });
    
    toast({
      title: `${type === 'expense' ? 'Expense' : 'Income'} added`,
      description: `Your ${type} has been recorded successfully`,
    });
    
    navigate('/dashboard');
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            className="pl-8"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="category">
            <SelectValue placeholder={`Select ${type} category`} />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions[type].map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder={`Enter ${type} description`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          required
        />
      </div>
      
      <Button type="submit" className="w-full" variant={type === 'expense' ? 'destructive' : 'default'}>
        Add {type === 'expense' ? 'Expense' : 'Income'}
      </Button>
    </form>
  );
};

export default ExpenseForm;
