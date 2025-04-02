
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useExpense } from '@/contexts/ExpenseContext';

interface ChartProps {
  type: 'expense' | 'income';
}

const COLORS = ['#6366F1', '#8B5CF6', '#D946EF', '#EC4899', '#F43F5E', '#F97316', '#FBBF24', '#84CC16', '#22C55E', '#10B981'];

const ExpensePieChart: React.FC<ChartProps> = ({ type }) => {
  const { getCategoryTotals } = useExpense();
  
  const chartData = useMemo(() => {
    const categoryTotals = getCategoryTotals(type);
    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
    })).sort((a, b) => b.value - a.value);
  }, [getCategoryTotals, type]);
  
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-card rounded-lg">
        <p className="text-muted-foreground">No {type} data available</p>
      </div>
    );
  }
  
  return (
    <div className="bg-card rounded-lg p-4 w-full">
      <h3 className="text-lg font-semibold mb-4 text-center">
        {type === 'expense' ? 'Expense' : 'Income'} Breakdown
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
            contentStyle={{ borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpensePieChart;
