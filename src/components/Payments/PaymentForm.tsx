import React, { useState, useEffect } from 'react';
import { X, Save, CreditCard } from 'lucide-react';
import { Payment, Member, Cabang } from '../../lib/localStorage';

interface PaymentFormProps {
  payment?: Payment | null;
  members: Member[];
  branches: Cabang[];
  onSubmit: (paymentData: any) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export default function PaymentForm({ 
  payment, 
  members, 
  branches,
  onSubmit, 
  onClose, 
  loading = false 
}: PaymentFormProps) {
  const [formData, setFormData] = useState({
    member_id: '',
    branch_id: '',
    amount: '',
    payment_type: 'iuran_bulanan' as const,
    payment_date: new Date().toISOString().split('T')[0],
    status: 'pending' as const,
    description: '',
    receipt_url: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (payment) {
      setFormData({
        member_id: payment.member_id || '',
        branch_id: payment.branch_id || '',
        amount: payment.amount.toString(),
        payment_type: payment.payment_type,
        payment_date: payment.payment_date || new Date().toISOString().split('T')[0],
        status: payment.status,
        description: payment.description || '',
        receipt_url: payment.receipt_url || '',
      });
    }
  }, [payment]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Jumlah pembayaran harus lebih dari 0';
    }

    if (!formData.payment_type) {
      newErrors.payment_type = 'Jenis pembayaran wajib dipilih';
    }

    if (!formData.payment_date) {
      newErrors.payment_date = 'Tanggal pembayaran wajib diisi';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi pembayaran wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        amount: parseFloat(formData.amount),
        member_id: formData.member_id || null,
        branch_id: formData.branch_id || null,
        receipt_url: formData.receipt_url || null,
      };
      await onSubmit(dataToSubmit);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const paymentTypes = [
    { value: 'iuran_bulanan', label: 'Iuran Bulanan' },
    { value: 'iuran_tahunan', label: 'Iuran Tahunan' },
    { value: 'donasi', label: 'Donasi' },
    { value: 'kegiatan', label: 'Kegiatan' },
    { value: 'lainnya', label: 'Lainnya' },
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'berhasil', label: 'Berhasil' },
    { value: 'gagal', label: 'Gagal' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {payment ? 'Edit Pembayaran' : 'Tambah Pembayaran Baru'}
                </h3>
                <p className="text-sm text-gray-600">
                  {payment ? 'Perbarui informasi pembayaran' : 'Lengkapi form untuk menambah pembayaran baru'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Member */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anggota
                </label>
                <select
                  value={formData.member_id}
                  onChange={(e) => handleInputChange('member_id', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  disabled={loading}
                >
                  <option value="">Pilih Anggota (Opsional)</option>
                  {members.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.full_name} ({member.member_number})
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Branch */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cabang
                </label>
                <select
                  value={formData.branch_id}
                  onChange={(e) => handleInputChange('branch_id', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  disabled={loading}
                >
                  <option value="">Pilih Cabang (Opsional)</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.nama_cabang} ({branch.kode_cabang})
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Pembayaran *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className={`w-full border rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      errors.amount ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    disabled={loading}
                  />
                </div>
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                )}
              </div>
              
              {/* Payment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Pembayaran *
                </label>
                <select
                  value={formData.payment_type}
                  onChange={(e) => handleInputChange('payment_type', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.payment_type ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                >
                  {paymentTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.payment_type && (
                  <p className="text-red-500 text-sm mt-1">{errors.payment_type}</p>
                )}
              </div>
              
              {/* Payment Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Pembayaran *
                </label>
                <input
                  type="date"
                  value={formData.payment_date}
                  onChange={(e) => handleInputChange('payment_date', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.payment_date ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.payment_date && (
                  <p className="text-red-500 text-sm mt-1">{errors.payment_date}</p>
                )}
              </div>
              
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  disabled={loading}
                >
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                  errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Masukkan deskripsi pembayaran"
                disabled={loading}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>
            
            {/* Receipt URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Bukti Pembayaran
              </label>
              <input
                type="url"
                value={formData.receipt_url}
                onChange={(e) => handleInputChange('receipt_url', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="https://example.com/receipt.pdf"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Link ke file bukti pembayaran (opsional)</p>
            </div>
            
            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={loading}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <Save className="h-4 w-4" />
                <span>{payment ? 'Update' : 'Simpan'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}