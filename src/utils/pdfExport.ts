
import jsPDF from 'jspdf';
import { Transaction } from '@/contexts/ExpenseContext';

// Function to format date to a readable string
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

// Function to export expense data to PDF
export const exportToPDF = (
  transactions: Transaction[],
  totalIncome: number,
  totalExpenses: number,
  monthlyBudget: number
) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(22);
  doc.setTextColor(64, 64, 175);
  doc.text('PocketWise Finance Report', 20, 20);
  
  // Add summary section
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Financial Summary', 20, 35);
  
  doc.setFontSize(12);
  doc.text(`Total Income: $${totalIncome.toFixed(2)}`, 20, 45);
  doc.text(`Total Expenses: $${totalExpenses.toFixed(2)}`, 20, 52);
  doc.text(`Balance: $${(totalIncome - totalExpenses).toFixed(2)}`, 20, 59);
  
  if (monthlyBudget > 0) {
    doc.text(`Monthly Budget: $${monthlyBudget.toFixed(2)}`, 20, 66);
    doc.text(`Remaining Budget: $${(monthlyBudget - totalExpenses).toFixed(2)}`, 20, 73);
  }
  
  // Add transactions table
  if (transactions.length > 0) {
    doc.setFontSize(16);
    doc.text('Transaction History', 20, 90);
    
    // Table headers
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text('Date', 20, 100);
    doc.text('Category', 60, 100);
    doc.text('Description', 100, 100);
    doc.text('Amount', 170, 100);
    
    // Draw a line under the header
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 102, 190, 102);
    
    // Table content
    doc.setTextColor(0, 0, 0);
    let y = 110;
    
    // Slice and sort transactions to get the most recent ones first
    const sortedTransactions = [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 20); // Limit to 20 transactions for PDF readability
    
    sortedTransactions.forEach((transaction, index) => {
      // Add page if needed
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      
      doc.text(formatDate(transaction.date), 20, y);
      doc.text(transaction.category, 60, y);
      
      // Truncate description if too long
      const desc = transaction.description.length > 30 
        ? transaction.description.substring(0, 27) + '...' 
        : transaction.description;
      doc.text(desc, 100, y);
      
      // Format amount based on transaction type
      const amountText = transaction.type === 'expense' 
        ? `-$${transaction.amount.toFixed(2)}` 
        : `+$${transaction.amount.toFixed(2)}`;
      
      // Set color based on transaction type
      if (transaction.type === 'expense') {
        doc.setTextColor(220, 53, 69); // Red for expenses
      } else {
        doc.setTextColor(25, 135, 84); // Green for income
      }
      
      doc.text(amountText, 170, y);
      doc.setTextColor(0, 0, 0); // Reset text color
      
      // Add a light line after each entry
      if (index < sortedTransactions.length - 1) {
        doc.setDrawColor(240, 240, 240);
        doc.line(20, y + 2, 190, y + 2);
      }
      
      y += 10;
    });
  }
  
  // Add footer
  const currentDate = new Date().toLocaleDateString();
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on ${currentDate} with PocketWise`, 20, 280);
  
  // Save the PDF
  doc.save('pocketwise-financial-report.pdf');
};
