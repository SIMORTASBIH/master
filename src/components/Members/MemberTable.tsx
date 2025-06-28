import React from 'react';
import { Edit2, Trash2, Eye, User, Phone, Mail } from 'lucide-react';
import { Member } from '../../lib/supabase';

interface MemberTableProps {
  members: Member[];
  onView: (member: Member) => void;
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
  canModify: boolean;
  loading?: boolean;
}

export default function MemberTable({ 
  members, 
  onView,
  onEdit, 
  onDelete, 
  canModify,
  loading = false 
}: MemberTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aktif':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'non_aktif':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'alumni':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'aktif':
        return 'Aktif';
      case 'non_aktif':
        return 'Tidak Aktif';
      case 'alumni':
        return 'Alumni';
      default:
        return status;
    }
  };

  if (loading && members.length === 0) {
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

  if (members.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum ada anggota</h3>
        <p className="text-gray-500 mb-4">
          Mulai dengan menambahkan anggota pertama ke dalam sistem
        </p>
        {canModify && (
          <button
            onClick={() => {/* This would trigger add new member */}}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tambah Anggota Pertama
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
                Anggota
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nomor Anggota
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kontak
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cabang
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal Bergabung
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {member.full_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {member.full_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {member.birth_date && (
                          <>Lahir: {new Date(member.birth_date).toLocaleDateString('id-ID')}</>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                    {member.member_number}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    {member.email && (
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Mail className="h-3 w-3" />
                        <span className="truncate max-w-[150px]">{member.email}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Phone className="h-3 w-3" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    {!member.email && !member.phone && (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {member.branch ? (
                    <div>
                      <div className="font-medium">{member.branch.nama_cabang}</div>
                      <div className="text-xs text-gray-500">{member.branch.kode_cabang}</div>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(member.status)}`}>
                    {getStatusText(member.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(member.join_date).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2 justify-end">
                    <button
                      onClick={() => onView(member)}
                      className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Lihat Detail"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {canModify && (
                      <>
                        <button
                          onClick={() => onEdit(member)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Edit Anggota"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(member)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Hapus Anggota"
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
            Menampilkan <span className="font-medium">{members.length}</span> anggota
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