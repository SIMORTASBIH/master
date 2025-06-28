import React from 'react';
import { X, Edit, TrendingUp, TrendingDown, Calendar, Tag, Building, User } from 'lucide-react';
import { FinancialRecord } from '../../lib/localStorage';

interface FinanceDetailProps {
  record: FinancialRecord;
  onClose: () => void;
  onEdit: (record: FinancialRecord) => void;
  canModify: boolean;
}

export default function FinanceDetail({ record, onClose, onEdit, canModify }: FinanceDetailProps) {
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
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Detail Transaksi</h3>
          <div className="flex items-center space-x-2">
            {canModify && (
              <button
                onClick={() => onEdit(record)}
                className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                title="Edit Transaksi"
              >
                <Edit className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Transaction Type and Amount */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              {record.transaction_type === 'pemasukan' ? (
                <TrendingUp className="h-6 w-6 text-green-500" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-500" />
              )}
              <span className={`text-lg font-medium ${
                record.transaction_type === 'pemasukan' 
                  ? 'text-green-700' 
                  : 'text-red-700'
              }`}>
                {record.transaction_type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
              </span>
            </div>
            <div className={`text-3xl font-bold ${
              record.transaction_type === 'pemasukan' 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {record.transaction_type === 'pemasukan' ? '+' : '-'}
              {formatCurrency(record.amount)}
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Tag className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Kategori</p>
                <p className="text-gray-900">{record.category || 'Tidak ada kategori'}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Tanggal Transaksi</p>
                <p className="text-gray-900">{formatDate(record.transaction_date)}</p>
              </div>
            </div>

            {record.branch_id && (
              <div className="flex items-start space-x-3">
                <Building className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Cabang</p>
                  <p className="text-gray-900">Cabang ID: {record.branch_id}</p>
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Deskripsi</p>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-900 whitespace-pre-wrap">{record.description}</p>
              </div>
            </div>

            {record.reference_id && (
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 text-gray-400 mt-0.5">
                  <div className="w-full h-full bg-gray-400 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Referensi ID</p>
                  <p className="text-gray-900 font-mono text-sm">{record.reference_id}</p>
                </div>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Dibuat pada:</span>
              <span className="text-gray-900">{formatDateTime(record.created_at)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Terakhir diupdate:</span>
              <span className="text-gray-900">{formatDateTime(record.updated_at)}</span>
            </div>
            {record.created_by && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Dibuat oleh:</span>
                <span className="text-gray-900">User ID: {record.created_by}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Tutup
          </button>
          {canModify && (
            <button
              onClick={() => onEdit(record)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Transaksi</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}