import React from 'react';
import { X, UserCheck, Calendar, Building2, Edit, Mail, User } from 'lucide-react';
import { Official } from '../../lib/localStorage';

interface OfficialDetailProps {
  official: Official;
  onClose: () => void;
  onEdit: (official: Official) => void;
  canModify: boolean;
}

export default function OfficialDetail({ official, onClose, onEdit, canModify }: OfficialDetailProps) {
  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Aktif' : 'Tidak Aktif';
  };

  const getPositionLabel = (position: string) => {
    const positions: Record<string, string> = {
      'ketua_umum': 'Ketua Umum',
      'wakil_ketua': 'Wakil Ketua',
      'sekretaris': 'Sekretaris',
      'bendahara': 'Bendahara',
      'koordinator_cabang': 'Koordinator Cabang',
      'anggota_pengurus': 'Anggota Pengurus',
    };
    return positions[position] || position;
  };

  const calculateDuration = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return `${years} tahun ${months} bulan`;
    } else if (months > 0) {
      return `${months} bulan`;
    } else {
      return `${diffDays} hari`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <UserCheck className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {official.profile?.nama_lengkap || 'Unknown User'}
                </h3>
                <p className="text-gray-600 text-lg">{getPositionLabel(official.position)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {canModify && (
                <button
                  onClick={() => onEdit(official)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mb-6">
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(official.is_active)}`}>
              {getStatusText(official.is_active)}
            </span>
          </div>

          {/* Official Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Informasi Personal
              </h4>
              
              <div className="flex items-start space-x-3">
                <User className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Nama Lengkap</p>
                  <p className="text-gray-900 font-medium">
                    {official.profile?.nama_lengkap || 'Unknown User'}
                  </p>
                </div>
              </div>

              {official.profile?.email && (
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-gray-900">{official.profile.email}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <UserCheck className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Role Sistem</p>
                  <p className="text-gray-900 capitalize">
                    {official.profile?.role || 'anggota'}
                  </p>
                </div>
              </div>
            </div>

            {/* Position Information */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Informasi Jabatan
              </h4>

              <div className="flex items-start space-x-3">
                <UserCheck className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Jabatan</p>
                  <p className="text-gray-900 font-medium text-lg">
                    {getPositionLabel(official.position)}
                  </p>
                </div>
              </div>

              {official.branch ? (
                <div className="flex items-start space-x-3">
                  <Building2 className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Cabang</p>
                    <p className="text-gray-900 font-medium">
                      {official.branch.nama_cabang}
                    </p>
                    <p className="text-sm text-gray-500">
                      {official.branch.kode_cabang} • {official.branch.kota}, {official.branch.provinsi}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start space-x-3">
                  <Building2 className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Cabang</p>
                    <p className="text-gray-900 font-medium">Pusat</p>
                    <p className="text-sm text-gray-500">Pengurus tingkat pusat</p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Periode Jabatan</p>
                  <p className="text-gray-900">
                    {new Date(official.start_date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  {official.end_date ? (
                    <p className="text-sm text-gray-500 mt-1">
                      s/d {new Date(official.end_date).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  ) : (
                    <p className="text-sm text-green-600 mt-1">Masih aktif</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Duration Summary */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-3">Durasi Jabatan</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {calculateDuration(official.start_date, official.end_date).split(' ')[0]}
                </div>
                <div className="text-xs text-blue-600">
                  {calculateDuration(official.start_date, official.end_date).includes('tahun') ? 'Tahun' : 'Bulan'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {official.is_active ? '✓' : '✗'}
                </div>
                <div className="text-xs text-blue-600">Status Aktif</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {official.branch ? '1' : '0'}
                </div>
                <div className="text-xs text-blue-600">Cabang Terkait</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">1</div>
                <div className="text-xs text-blue-600">Jabatan Aktif</div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <p><span className="font-medium">Dibuat:</span> {new Date(official.created_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
              <div>
                <p><span className="font-medium">Diperbarui:</span> {new Date(official.updated_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}