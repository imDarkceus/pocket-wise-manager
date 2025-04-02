
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeftRight, 
  Trash2, 
  Moon, 
  Download, 
  Send, 
  Info,
  FileText
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useExpense } from '@/contexts/ExpenseContext';
import { exportToPDF } from '@/utils/pdfExport';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state, totalExpenses, totalIncome } = useExpense();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  
  useEffect(() => {
    // Update class on document when dark mode changes
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);
  
  const exportData = () => {
    try {
      const dataStr = JSON.stringify(state, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `pocketwise-export-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: 'Export successful',
        description: 'Your data has been exported successfully',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'There was an error exporting your data',
        variant: 'destructive',
      });
    }
  };
  
  const exportPDF = () => {
    try {
      exportToPDF(
        state.transactions,
        totalIncome,
        totalExpenses,
        state.monthlyBudget
      );
      
      toast({
        title: 'PDF Export successful',
        description: 'Your financial report has been exported as PDF',
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: 'PDF Export failed',
        description: 'There was an error generating your PDF report',
        variant: 'destructive',
      });
    }
  };
  
  const clearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('expenseData');
      toast({
        title: 'Data cleared',
        description: 'All your data has been removed',
      });
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your app preferences</p>
      </div>
      
      <div className="p-4 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">App Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Moon className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
              <Switch 
                id="dark-mode" 
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ArrowLeftRight className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="currency">Currency</Label>
              </div>
              <span className="text-sm text-muted-foreground">USD</span>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h2 className="text-lg font-semibold mb-3">Data Management</h2>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export Data (JSON)
            </Button>
            
            <Button variant="outline" className="w-full justify-start" onClick={exportPDF}>
              <FileText className="h-4 w-4 mr-2" />
              Export Financial Report (PDF)
            </Button>
            
            <Button variant="outline" className="w-full justify-start" disabled>
              <Send className="h-4 w-4 mr-2" />
              Share Report
            </Button>
            
            <Button 
              variant="destructive" 
              className="w-full justify-start" 
              onClick={clearData}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h2 className="text-lg font-semibold mb-3">About</h2>
          
          <div className="bg-card rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Info className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">PocketWise</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              A simple and intuitive expense manager to help you track your finances.
            </p>
            <p className="text-xs text-muted-foreground">Version 1.0.0</p>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Settings;
