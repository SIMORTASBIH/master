import React, { useState, useEffect } from 'react';
import { X, Save, User } from 'lucide-react';
import { Member, Cabang } from '../../lib/supabase';

interface MemberFormProps {
  member?: Member | null;
  branches: Cabang[];
  onSubmit: (memberData: any) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export default function MemberForm({ 
  member, 
  branches, 
  onSubmit, 
  onClose, 
  loading = false 
}: MemberFormProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    birth_date: '',
    join_date: new Date().toISOString().split('T')[0],
    branch_id: '',
    status: 'aktif' as const,
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (member) {
      setFormData({
        full_name: member.full_name || '',
        email: member.email || '',
        phone: member.phone || '',
        address: member.address || '',
        birth_date: member.birth_date || '',
        join_date: member.join_date || new Date().toISOString().split('T')[0],
        branch_id: member.branch_id || '',
        status: member.status || 'aktif',
        notes: member.notes || '',
      });
    }
  }, [member]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Nama lengkap wajib diisi';
    } else if (formData.full_name.trim().length < 2) {
      newErrors.full_name = 'Nama lengkap minimal 2 karakter';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = 'Format nomor telepon tidak valid';
    }

    if (formData.birth_date) {
      const birthDate = new Date(formData.birth_date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 10 || age > 100) {
        newErrors.birth_date = 'Tanggal lahir tidak valid';
      }
    }

    if (!formData.join_date) {
      newErrors.join_date = 'Tanggal bergabung wajib diisi';
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
      await onSubmit(formData);
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {member ? 'Edit Anggota' : 'Tambah Anggota Baru'}
                </h3>
                <p className="text-sm text-gray-600">
                  {member ? 'Perbarui informasi anggota' : 'Lengkapi form untuk menambah anggota baru'}
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
              {/* Nama Lengkap */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.full_name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Masukkan nama lengkap"
                  disabled={loading}
                />
                {errors.full_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
                )}
              </div>
              
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="contoh@email.com"
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              
              {/* Telepon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="08xxxxxxxxxx"
                  disabled={loading}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
              
              {/* Tanggal Lahir */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => handleInputChange('birth_date', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.birth_date ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.birth_date && (
                  <p className="text-red-500 text-sm mt-1">{errors.birth_date}</p>
                )}
              </div>
              
              {/* Tanggal Bergabung */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Bergabung *
                </label>
                <input
                  type="date"
                  value={formData.join_date}
                  onChange={(e) => handleInputChange('join_date', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.join_date ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.join_date && (
                  <p className="text-red-500 text-sm mt-1">{errors.join_date}</p>
                )}
              </div>
              
              {/* Cabang */}
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
                  <option value="">Pilih Cabang</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.nama_cabang} ({branch.kode_cabang})
                    </option>
                  ))}
                </select>
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
                  <option value="aktif">Aktif</option>
                  <option value="non_aktif">Tidak Aktif</option>
                  <option value="alumni">Alumni</option>
                </select>
              </div>
            </div>
            
            {/* Alamat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Masukkan alamat lengkap"
                disabled={loading}
              />
            </div>
            
            {/* Catatan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Catatan tambahan (opsional)"
                disabled={loading}
              />
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
                <span>{member ? 'Update' : 'Simpan'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}