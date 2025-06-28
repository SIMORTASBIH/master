import React from 'react';
import { X, Building2, MapPin, Calendar, Users, Edit, Phone, Mail } from 'lucide-react';
import { Cabang } from '../../lib/localStorage';

interface BranchDetailProps {
  branch: Cabang;
  onClose: () => void;
  onEdit: (branch: Cabang) => void;
  canModify: boolean;
}

export default function BranchDetail({ branch, onClose, onEdit, canModify }: BranchDetailProps) {
  const getStatusColor = (status?: boolean) => {
    return status !== false
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusText = (status?: boolean) => {
    return status !== false ? 'Aktif' : 'Tidak Aktif';
  };

  const calculateAge = (foundingDate: string) => {
    const today = new Date();
    const founding = new Date(foundingDate);
    const diffTime = Math.abs(today.getTime() - founding.getTime());
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
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{branch.nama_cabang}</h3>
                <p className="text-gray-600 font-mono text-sm">{branch.kode_cabang}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {canModify && (
                <button
                  onClick={() => onEdit(branch)}
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
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(branch.status)}`}>
              {getStatusText(branch.status)}
            </span>
          </div>

          {/* Branch Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Location Information */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Informasi Lokasi
              </h4>
              
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Kota</p>
                  <p className="text-gray-900 font-medium">{branch.kota}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Provinsi</p>
                  <p className="text-gray-900 font-medium">{branch.provinsi}</p>
                </div>
              </div>

              {branch.alamat && (
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Alamat Lengkap</p>
                    <p className="text-gray-900 leading-relaxed">{branch.alamat}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Branch Information */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Informasi Cabang
              </h4>

              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Jumlah Anggota</p>
                  <p className="text-gray-900 font-medium text-2xl">{branch.jumlah_anggota || 0}</p>
                </div>
              </div>

              {branch.tanggal_berdiri && (
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Tanggal Berdiri</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(branch.tanggal_berdiri).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      ({calculateAge(branch.tanggal_berdiri)} yang lalu)
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Dibuat</p>
                  <p className="text-gray-900">
                    {new Date(branch.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-3">Statistik Cabang</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">{branch.jumlah_anggota || 0}</div>
                <div className="text-xs text-blue-600">Total Anggota</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {branch.tanggal_berdiri ? calculateAge(branch.tanggal_berdiri).split(' ')[0] : '0'}
                </div>
                <div className="text-xs text-blue-600">Tahun Beroperasi</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {branch.status !== false ? '✓' : '✗'}
                </div>
                <div className="text-xs text-blue-600">Status Operasional</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">1</div>
                <div className="text-xs text-blue-600">Cabang Regional</div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <p><span className="font-medium">Dibuat:</span> {new Date(branch.created_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
              <div>
                <p><span className="font-medium">Diperbarui:</span> {new Date(branch.updated_at).toLocaleDateString('id-ID', {
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