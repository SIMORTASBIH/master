import React, { useState, useEffect } from 'react';
import { X, Save, Building2 } from 'lucide-react';
import { Cabang } from '../../lib/localStorage';

interface BranchFormProps {
  branch?: Cabang | null;
  onSubmit: (branchData: any) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export default function BranchForm({ 
  branch, 
  onSubmit, 
  onClose, 
  loading = false 
}: BranchFormProps) {
  const [formData, setFormData] = useState({
    nama_cabang: '',
    kode_cabang: '',
    alamat: '',
    kota: '',
    provinsi: '',
    koordinator_id: '',
    jumlah_anggota: 0,
    tanggal_berdiri: '',
    status: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (branch) {
      setFormData({
        nama_cabang: branch.nama_cabang || '',
        kode_cabang: branch.kode_cabang || '',
        alamat: branch.alamat || '',
        kota: branch.kota || '',
        provinsi: branch.provinsi || '',
        koordinator_id: branch.koordinator_id || '',
        jumlah_anggota: branch.jumlah_anggota || 0,
        tanggal_berdiri: branch.tanggal_berdiri || '',
        status: branch.status !== false,
      });
    }
  }, [branch]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nama_cabang.trim()) {
      newErrors.nama_cabang = 'Nama cabang wajib diisi';
    } else if (formData.nama_cabang.trim().length < 3) {
      newErrors.nama_cabang = 'Nama cabang minimal 3 karakter';
    }

    if (!formData.kode_cabang.trim()) {
      newErrors.kode_cabang = 'Kode cabang wajib diisi';
    } else if (!/^[A-Z]{3}-\d{2}$/.test(formData.kode_cabang)) {
      newErrors.kode_cabang = 'Format kode cabang: XXX-XX (contoh: JKT-01)';
    }

    if (!formData.kota.trim()) {
      newErrors.kota = 'Kota wajib diisi';
    }

    if (!formData.provinsi.trim()) {
      newErrors.provinsi = 'Provinsi wajib diisi';
    }

    if (formData.jumlah_anggota < 0) {
      newErrors.jumlah_anggota = 'Jumlah anggota tidak boleh negatif';
    }

    if (formData.tanggal_berdiri) {
      const foundingDate = new Date(formData.tanggal_berdiri);
      const today = new Date();
      if (foundingDate > today) {
        newErrors.tanggal_berdiri = 'Tanggal berdiri tidak boleh di masa depan';
      }
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

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const provinces = [
    'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 'Jambi',
    'Sumatera Selatan', 'Bangka Belitung', 'Bengkulu', 'Lampung', 'DKI Jakarta',
    'Jawa Barat', 'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur', 'Banten',
    'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Kalimantan Barat',
    'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara',
    'Sulawesi Utara', 'Sulawesi Tengah', 'Sulawesi Selatan', 'Sulawesi Tenggara',
    'Gorontalo', 'Sulawesi Barat', 'Maluku', 'Maluku Utara', 'Papua', 'Papua Barat'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {branch ? 'Edit Cabang' : 'Tambah Cabang Baru'}
                </h3>
                <p className="text-sm text-gray-600">
                  {branch ? 'Perbarui informasi cabang' : 'Lengkapi form untuk menambah cabang baru'}
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
              {/* Nama Cabang */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Cabang *
                </label>
                <input
                  type="text"
                  value={formData.nama_cabang}
                  onChange={(e) => handleInputChange('nama_cabang', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.nama_cabang ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Masukkan nama cabang"
                  disabled={loading}
                />
                {errors.nama_cabang && (
                  <p className="text-red-500 text-sm mt-1">{errors.nama_cabang}</p>
                )}
              </div>
              
              {/* Kode Cabang */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kode Cabang *
                </label>
                <input
                  type="text"
                  value={formData.kode_cabang}
                  onChange={(e) => handleInputChange('kode_cabang', e.target.value.toUpperCase())}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.kode_cabang ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="JKT-01"
                  disabled={loading}
                />
                {errors.kode_cabang && (
                  <p className="text-red-500 text-sm mt-1">{errors.kode_cabang}</p>
                )}
              </div>
              
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status ? 'active' : 'inactive'}
                  onChange={(e) => handleInputChange('status', e.target.value === 'active')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  disabled={loading}
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                </select>
              </div>
              
              {/* Kota */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kota *
                </label>
                <input
                  type="text"
                  value={formData.kota}
                  onChange={(e) => handleInputChange('kota', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.kota ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Masukkan nama kota"
                  disabled={loading}
                />
                {errors.kota && (
                  <p className="text-red-500 text-sm mt-1">{errors.kota}</p>
                )}
              </div>
              
              {/* Provinsi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provinsi *
                </label>
                <select
                  value={formData.provinsi}
                  onChange={(e) => handleInputChange('provinsi', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.provinsi ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <option value="">Pilih Provinsi</option>
                  {provinces.map(province => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
                {errors.provinsi && (
                  <p className="text-red-500 text-sm mt-1">{errors.provinsi}</p>
                )}
              </div>
              
              {/* Jumlah Anggota */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Anggota
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.jumlah_anggota}
                  onChange={(e) => handleInputChange('jumlah_anggota', parseInt(e.target.value) || 0)}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.jumlah_anggota ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.jumlah_anggota && (
                  <p className="text-red-500 text-sm mt-1">{errors.jumlah_anggota}</p>
                )}
              </div>
              
              {/* Tanggal Berdiri */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Berdiri
                </label>
                <input
                  type="date"
                  value={formData.tanggal_berdiri}
                  onChange={(e) => handleInputChange('tanggal_berdiri', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.tanggal_berdiri ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.tanggal_berdiri && (
                  <p className="text-red-500 text-sm mt-1">{errors.tanggal_berdiri}</p>
                )}
              </div>
            </div>
            
            {/* Alamat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat
              </label>
              <textarea
                value={formData.alamat}
                onChange={(e) => handleInputChange('alamat', e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Masukkan alamat lengkap cabang"
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
                <span>{branch ? 'Update' : 'Simpan'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}