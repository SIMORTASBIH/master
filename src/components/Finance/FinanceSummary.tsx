import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, FileText } from 'lucide-react';

interface FinanceSummaryProps {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  recordCount: number;
}

export default function FinanceSummary({ 
  totalIncome, 
  totalExpense, 
  netBalance, 
  recordCount 
}: FinanceSummaryProps) {
  const getBalanceColor = (balance: number) => {
    if (balance > 0) return 'text-green-600';
    if (balance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getBalanceIcon = (balance: number) => {
    if (balance > 0) return <TrendingUp className="h-6 w-6 text-green-600" />;
    if (balance < 0) return <TrendingDown className="h-6 w-6 text-red-600" />;
    return <DollarSign className="h-6 w-6 text-gray-600" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Income */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-green-600">
              Rp {totalIncome.toLocaleString('id-ID')}
            </div>
            <div className="text-sm text-gray-600">Total Pemasukan</div>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>
      
      {/* Total Expense */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-red-600">
              Rp {totalExpense.toLocaleString('id-ID')}
            </div>
            <div className="text-sm text-gray-600">Total Pengeluaran</div>
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <TrendingDown className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>
      
      {/* Net Balance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-lg font-bold ${getBalanceColor(netBalance)}`}>
              Rp {netBalance.toLocaleString('id-ID')}
            </div>
            <div className="text-sm text-gray-600">Saldo Bersih</div>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            {getBalanceIcon(netBalance)}
          </div>
        </div>
      </div>
      
      {/* Total Records */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-blue-600">{recordCount}</div>
            <div className="text-sm text-gray-600">Total Transaksi</div>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
}