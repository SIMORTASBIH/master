import React from 'react';
import { Edit2, Trash2, Eye, UserCheck, Calendar, Building2 } from 'lucide-react';
import { Official } from '../../lib/localStorage';

interface OfficialTableProps {
  officials: Official[];
  onView: (official: Official) => void;
  onEdit: (official: Official) => void;
  onDelete: (official: Official) => void;
  canModify: boolean;
  loading?: boolean;
}

export default function OfficialTable({ 
  officials, 
  onView,
  onEdit, 
  onDelete, 
  canModify,
  loading = false 
}: OfficialTableProps) {
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

  const getPositionColor = (position: string) => {
    const colors: Record<string, string> = {
      'ketua_umum': 'bg-purple-100 text-purple-800',
      'wakil_ketua': 'bg-indigo-100 text-indigo-800',
      'sekretaris': 'bg-blue-100 text-blue-800',
      'bendahara': 'bg-green-100 text-green-800',
      'koordinator_cabang': 'bg-orange-100 text-orange-800',
      'anggota_pengurus': 'bg-gray-100 text-gray-800',
    };
    return colors[position] || 'bg-gray-100 text-gray-800';
  };

  if (loading && officials.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 border-t border-gray-200"></div>
          ))}
        </div>
      </div>
    );
  }

  if (officials.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <UserCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum ada pengurus</h3>
        <p className="text-gray-500 mb-4">
          Mulai dengan menambahkan pengurus pertama ke dalam sistem
        </p>
        {canModify && (
          <button
            onClick={() => {/* This would trigger add new official */}}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tambah Pengurus Pertama
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pengurus
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jabatan
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cabang
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Periode
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {officials.map((official) => (
              <tr key={official.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {official.profile?.nama_lengkap?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {official.profile?.nama_lengkap || 'Unknown User'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {official.profile?.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPositionColor(official.position)}`}>
                    {getPositionLabel(official.position)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {official.branch ? (
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Building2 className="h-3 w-3" />
                      <div>
                        <div className="font-medium text-gray-900">{official.branch.nama_cabang}</div>
                        <div className="text-xs text-gray-500">{official.branch.kode_cabang}</div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">Pusat</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Calendar className="h-3 w-3" />
                    <div>
                      <div className="text-gray-900">
                        {new Date(official.start_date).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      {official.end_date && (
                        <div className="text-xs text-gray-500">
                          s/d {new Date(official.end_date).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(official.is_active)}`}>
                    {getStatusText(official.is_active)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2 justify-end">
                    <button
                      onClick={() => onView(official)}
                      className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Lihat Detail"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {canModify && (
                      <>
                        <button
                          onClick={() => onEdit(official)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Edit Pengurus"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(official)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Hapus Pengurus"
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
      
      {/* Table Footer */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Menampilkan <span className="font-medium">{officials.length}</span> pengurus
          </div>
          <div className="text-sm text-gray-500">
            {loading && (
              <span className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Memuat...</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}