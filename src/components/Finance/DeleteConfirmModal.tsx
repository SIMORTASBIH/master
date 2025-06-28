import React from 'react';
import { X, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { FinancialRecord } from '../../lib/localStorage';

interface DeleteConfirmModalProps {
  record: FinancialRecord;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function DeleteConfirmModal({ record, onConfirm, onCancel, loading }: DeleteConfirmModalProps) {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Konfirmasi Hapus</h3>
          <button
            onClick={onCancel}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">
                Hapus Transaksi?
              </h4>
              <p className="text-sm text-gray-600">
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Tanggal:</span>
              <span className="text-sm text-gray-900">{formatDate(record.transaction_date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Jenis:</span>
              <span className={`text-sm font-medium ${
                record.transaction_type === 'pemasukan' ? 'text-green-600' : 'text-red-600'
              }`}>
                {record.transaction_type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Kategori:</span>
              <span className="text-sm text-gray-900">{record.category || 'Tidak ada kategori'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Jumlah:</span>
              <span className={`text-sm font-semibold ${
                record.transaction_type === 'pemasukan' ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(record.amount)}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-500">Deskripsi:</span>
              <p className="text-sm text-gray-900 mt-1">{record.description}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            <Trash2 className="h-4 w-4" />
            <span>Hapus</span>
          </button>
        </div>
      </div>
    </div>
  );
}