import React, { useState, useEffect } from 'react';
import { X, Save, UserCheck } from 'lucide-react';
import { Official, Cabang, Profile } from '../../lib/localStorage';

interface OfficialFormProps {
  official?: Official | null;
  branches: Cabang[];
  profiles: Profile[];
  onSubmit: (officialData: any) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export default function OfficialForm({ 
  official, 
  branches, 
  profiles,
  onSubmit, 
  onClose, 
  loading = false 
}: OfficialFormProps) {
  const [formData, setFormData] = useState({
    profile_id: '',
    branch_id: '',
    position: 'anggota_pengurus' as const,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (official) {
      setFormData({
        profile_id: official.profile_id || '',
        branch_id: official.branch_id || '',
        position: official.position,
        start_date: official.start_date || new Date().toISOString().split('T')[0],
        end_date: official.end_date || '',
        is_active: official.is_active,
      });
    }
  }, [official]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.profile_id) {
      newErrors.profile_id = 'Profil pengurus wajib dipilih';
    }

    if (!formData.position) {
      newErrors.position = 'Jabatan wajib dipilih';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Tanggal mulai wajib diisi';
    }

    if (formData.end_date && formData.start_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      if (endDate <= startDate) {
        newErrors.end_date = 'Tanggal selesai harus setelah tanggal mulai';
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const positions = [
    { value: 'ketua_umum', label: 'Ketua Umum' },
    { value: 'wakil_ketua', label: 'Wakil Ketua' },
    { value: 'sekretaris', label: 'Sekretaris' },
    { value: 'bendahara', label: 'Bendahara' },
    { value: 'koordinator_cabang', label: 'Koordinator Cabang' },
    { value: 'anggota_pengurus', label: 'Anggota Pengurus' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {official ? 'Edit Pengurus' : 'Tambah Pengurus Baru'}
                </h3>
                <p className="text-sm text-gray-600">
                  {official ? 'Perbarui informasi pengurus' : 'Lengkapi form untuk menambah pengurus baru'}
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
              {/* Profile */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profil Pengurus *
                </label>
                <select
                  value={formData.profile_id}
                  onChange={(e) => handleInputChange('profile_id', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.profile_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <option value="">Pilih Profil</option>
                  {profiles.map(profile => (
                    <option key={profile.id} value={profile.id}>
                      {profile.nama_lengkap} ({profile.email})
                    </option>
                  ))}
                </select>
                {errors.profile_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.profile_id}</p>
                )}
              </div>
              
              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jabatan *
                </label>
                <select
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.position ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                >
                  {positions.map(position => (
                    <option key={position.value} value={position.value}>
                      {position.label}
                    </option>
                  ))}
                </select>
                {errors.position && (
                  <p className="text-red-500 text-sm mt-1">{errors.position}</p>
                )}
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
              
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Mulai *
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.start_date ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.start_date && (
                  <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>
                )}
              </div>
              
              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Selesai
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    errors.end_date ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.end_date && (
                  <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Kosongkan jika masih aktif</p>
              </div>
            </div>
            
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={() => handleInputChange('is_active', true)}
                    className="mr-2"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-700">Aktif</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="is_active"
                    checked={!formData.is_active}
                    onChange={() => handleInputChange('is_active', false)}
                    className="mr-2"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-700">Tidak Aktif</span>
                </label>
              </div>
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
                <span>{official ? 'Update' : 'Simpan'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}