import React from 'react';
import { Eye, Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { FinancialRecord } from '../../lib/localStorage';

interface FinanceTableProps {
  records: FinancialRecord[];
  onView: (record: FinancialRecord) => void;
  onEdit: (record: FinancialRecord) => void;
  onDelete: (record: FinancialRecord) => void;
  canModify: boolean;
  loading: boolean;
}

export default function FinanceTable({ 
  records, 
  onView, 
  onEdit, 
  onDelete, 
  canModify, 
  loading 
}: FinanceTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading && records.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="animate-pulse p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-gray-400 mb-4">
          <TrendingUp className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada transaksi</h3>
        <p className="text-gray-600 mb-4">
          Mulai dengan menambahkan transaksi keuangan pertama Anda.
        </p>
        {canModify && (
          <button
            onClick={() => {/* This would trigger add new */}}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tambah Transaksi
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jenis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deskripsi
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jumlah
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(record.transaction_date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {record.transaction_type === 'pemasukan' ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      record.transaction_type === 'pemasukan' 
                        ? 'text-green-700' 
                        : 'text-red-700'
                    }`}>
                      {record.transaction_type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {record.category || 'Tidak ada kategori'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="max-w-xs truncate" title={record.description}>
                    {record.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className={`text-sm font-semibold ${
                    record.transaction_type === 'pemasukan' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {record.transaction_type === 'pemasukan' ? '+' : '-'}
                    {formatCurrency(record.amount)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => onView(record)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Lihat Detail"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {canModify && (
                      <>
                        <button
                          onClick={() => onEdit(record)}
                          className="text-yellow-600 hover:text-yellow-800 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(record)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}