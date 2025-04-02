
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ExpenseForm from '@/components/ExpenseForm';
import BottomNav from '@/components/BottomNav';

const AddIncome: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="p-4 border-b">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Add Income</h1>
        </div>
        
        <ExpenseForm type="income" />
      </div>
      
      <BottomNav />
    </div>
  );
};

export default AddIncome;
