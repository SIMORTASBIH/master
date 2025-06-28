import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { FinancialRecord } from '../../lib/localStorage';

interface FinanceFormProps {
  record?: FinancialRecord | null;
  branches: Array<{ id: string; nama_cabang: string }>;
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
  loading: boolean;
}

export default function FinanceForm({ record, branches, onSubmit, onClose, loading }: FinanceFormProps) {
  const [formData, setFormData] = useState({
    transaction_type: 'pemasukan' as 'pemasukan' | 'pengeluaran',
    amount: '',
    description: '',
    category: '',
    transaction_date: new Date().toISOString().split('T')[0],
    branch_id: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (record) {
      setFormData({
        transaction_type: record.transaction_type,
        amount: record.amount.toString(),
        description: record.description,
        category: record.category || '',
        transaction_date: record.transaction_date,
        branch_id: record.branch_id || '',
      });
    }
  }, [record]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.transaction_type) {
      newErrors.transaction_type = 'Jenis transaksi harus dipilih';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Jumlah harus lebih dari 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi harus diisi';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Kategori harus diisi';
    }

    if (!formData.transaction_date) {
      newErrors.transaction_date = 'Tanggal transaksi harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      amount: parseFloat(formData.amount),
      branch_id: formData.branch_id || null,
    };

    await onSubmit(submitData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const commonCategories = {
    pemasukan: [
      'Iuran Anggota',
      'Donasi',
      'Kegiatan',
      'Sponsor',
      'Penjualan',
      'Lainnya'
    ],
    pengeluaran: [
      'Operasional',
      'Kegiatan',
      'Konsumsi',
      'Transport',
      'ATK',
      'Sewa',
      'Utilitas',
      'Lainnya'
    ]
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {record ? 'Edit Transaksi' : 'Tambah Transaksi'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Transaksi *
            </label>
            <select
              value={formData.transaction_type}
              onChange={(e) => handleChange('transaction_type', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                errors.transaction_type ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="pemasukan">Pemasukan</option>
              <option value="pengeluaran">Pengeluaran</option>
            </select>
            {errors.transaction_type && (
              <p className="mt-1 text-sm text-red-600">{errors.transaction_type}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah (Rp) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Pilih Kategori</option>
              {commonCategories[formData.transaction_type].map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan deskripsi transaksi..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Transaksi *
            </label>
            <input
              type="date"
              value={formData.transaction_date}
              onChange={(e) => handleChange('transaction_date', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                errors.transaction_date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.transaction_date && (
              <p className="mt-1 text-sm text-red-600">{errors.transaction_date}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cabang
            </label>
            <select
              value={formData.branch_id}
              onChange={(e) => handleChange('branch_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">Semua Cabang</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>
                  {branch.nama_cabang}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <Save className="h-4 w-4" />
              <span>{record ? 'Update' : 'Simpan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}