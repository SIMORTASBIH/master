import React from 'react';
import { Edit2, Trash2, Eye, Building2, MapPin, Users } from 'lucide-react';
import { Cabang } from '../../lib/localStorage';

interface BranchTableProps {
  branches: Cabang[];
  onView: (branch: Cabang) => void;
  onEdit: (branch: Cabang) => void;
  onDelete: (branch: Cabang) => void;
  canModify: boolean;
  loading?: boolean;
}

export default function BranchTable({ 
  branches, 
  onView,
  onEdit, 
  onDelete, 
  canModify,
  loading = false 
}: BranchTableProps) {
  const getStatusColor = (status?: boolean) => {
    return status !== false
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusText = (status?: boolean) => {
    return status !== false ? 'Aktif' : 'Tidak Aktif';
  };

  if (loading && branches.length === 0) {
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

  if (branches.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum ada cabang</h3>
        <p className="text-gray-500 mb-4">
          Mulai dengan menambahkan cabang pertama ke dalam sistem
        </p>
        {canModify && (
          <button
            onClick={() => {/* This would trigger add new branch */}}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tambah Cabang Pertama
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
                Cabang
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kode
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lokasi
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Anggota
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal Berdiri
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {branches.map((branch) => (
              <tr key={branch.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {branch.nama_cabang}
                      </div>
                      {branch.alamat && (
                        <div className="text-xs text-gray-500 max-w-[200px] truncate">
                          {branch.alamat}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                    {branch.kode_cabang}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <div>
                      <div className="font-medium text-gray-900">{branch.kota}</div>
                      <div className="text-xs text-gray-500">{branch.provinsi}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Users className="h-3 w-3" />
                    <span className="font-medium">{branch.jumlah_anggota || 0}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(branch.status)}`}>
                    {getStatusText(branch.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {branch.tanggal_berdiri ? (
                    new Date(branch.tanggal_berdiri).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2 justify-end">
                    <button
                      onClick={() => onView(branch)}
                      className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Lihat Detail"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {canModify && (
                      <>
                        <button
                          onClick={() => onEdit(branch)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Edit Cabang"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(branch)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Hapus Cabang"
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
            Menampilkan <span className="font-medium">{branches.length}</span> cabang
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