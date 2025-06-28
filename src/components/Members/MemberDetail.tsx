import React from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, Building2, FileText, Edit } from 'lucide-react';
import { Member } from '../../lib/supabase';

interface MemberDetailProps {
  member: Member;
  onClose: () => void;
  onEdit: (member: Member) => void;
  canModify: boolean;
}

export default function MemberDetail({ member, onClose, onEdit, canModify }: MemberDetailProps) {
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

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{member.full_name}</h3>
                <p className="text-gray-600 font-mono text-sm">{member.member_number}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {canModify && (
                <button
                  onClick={() => onEdit(member)}
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
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(member.status)}`}>
              {getStatusText(member.status)}
            </span>
          </div>

          {/* Member Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Informasi Kontak
              </h4>
              
              {member.email && (
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-gray-900">{member.email}</p>
                  </div>
                </div>
              )}

              {member.phone && (
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Telepon</p>
                    <p className="text-gray-900">{member.phone}</p>
                  </div>
                </div>
              )}

              {member.address && (
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Alamat</p>
                    <p className="text-gray-900 leading-relaxed">{member.address}</p>
                  </div>
                </div>
              )}

              {!member.email && !member.phone && !member.address && (
                <div className="text-gray-500 italic">
                  Informasi kontak belum lengkap
                </div>
              )}
            </div>

            {/* Membership Information */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Informasi Keanggotaan
              </h4>

              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Tanggal Bergabung</p>
                  <p className="text-gray-900">
                    {new Date(member.join_date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {member.birth_date && (
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Tanggal Lahir</p>
                    <p className="text-gray-900">
                      {new Date(member.birth_date).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                      <span className="text-gray-500 ml-2">
                        ({calculateAge(member.birth_date)} tahun)
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {member.branch && (
                <div className="flex items-start space-x-3">
                  <Building2 className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Cabang</p>
                    <p className="text-gray-900 font-medium">
                      {member.branch.nama_cabang}
                    </p>
                    <p className="text-sm text-gray-500">
                      {member.branch.kode_cabang} • {member.branch.kota}, {member.branch.provinsi}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {member.notes && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                Catatan
              </h4>
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-gray-400 mt-1" />
                <div className="bg-gray-50 rounded-lg p-4 flex-1">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{member.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Membership Duration */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Durasi Keanggotaan</h4>
            <p className="text-blue-700">
              {(() => {
                const joinDate = new Date(member.join_date);
                const today = new Date();
                const diffTime = Math.abs(today.getTime() - joinDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const years = Math.floor(diffDays / 365);
                const months = Math.floor((diffDays % 365) / 30);
                const days = diffDays % 30;

                if (years > 0) {
                  return `${years} tahun ${months} bulan`;
                } else if (months > 0) {
                  return `${months} bulan ${days} hari`;
                } else {
                  return `${days} hari`;
                }
              })()}
            </p>
          </div>

          {/* Metadata */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <p><span className="font-medium">Dibuat:</span> {new Date(member.created_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
              <div>
                <p><span className="font-medium">Diperbarui:</span> {new Date(member.updated_at).toLocaleDateString('id-ID', {
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