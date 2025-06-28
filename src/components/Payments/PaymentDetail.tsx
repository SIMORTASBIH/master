import React from 'react';
import { X, CreditCard, Calendar, User, Building2, Edit, ExternalLink, FileText } from 'lucide-react';
import { Payment } from '../../lib/localStorage';

interface PaymentDetailProps {
  payment: Payment;
  onClose: () => void;
  onEdit: (payment: Payment) => void;
  canModify: boolean;
}

export default function PaymentDetail({ payment, onClose, onEdit, canModify }: PaymentDetailProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'berhasil':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'gagal':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'berhasil':
        return 'Berhasil';
      case 'pending':
        return 'Pending';
      case 'gagal':
        return 'Gagal';
      default:
        return status;
    }
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'iuran_bulanan': 'Iuran Bulanan',
      'iuran_tahunan': 'Iuran Tahunan',
      'donasi': 'Donasi',
      'kegiatan': 'Kegiatan',
      'lainnya': 'Lainnya',
    };
    return types[type] || type;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 font-mono">{payment.payment_number}</h3>
                <p className="text-gray-600">{getTypeLabel(payment.payment_type)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {canModify && (
                <button
                  onClick={() => onEdit(payment)}
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
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(payment.status)}`}>
              {getStatusText(payment.status)}
            </span>
          </div>

          {/* Payment Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Payment Details */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Detail Pembayaran
              </h4>
              
              <div className="flex items-start space-x-3">
                <CreditCard className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Jumlah Pembayaran</p>
                  <p className="text-2xl font-bold text-gray-900">
                    Rp {payment.amount.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Tanggal Pembayaran</p>
                  <p className="text-gray-900">
                    {new Date(payment.payment_date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {payment.description && (
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Deskripsi</p>
                    <p className="text-gray-900 leading-relaxed">{payment.description}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Member & Branch Information */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Informasi Terkait
              </h4>

              {payment.member ? (
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Anggota</p>
                    <p className="text-gray-900 font-medium">{payment.member.full_name}</p>
                    <p className="text-sm text-gray-500 font-mono">{payment.member.member_number}</p>
                    {payment.member.email && (
                      <p className="text-sm text-gray-500">{payment.member.email}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Anggota</p>
                    <p className="text-gray-500 italic">Tidak terkait dengan anggota tertentu</p>
                  </div>
                </div>
              )}

              {payment.branch ? (
                <div className="flex items-start space-x-3">
                  <Building2 className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Cabang</p>
                    <p className="text-gray-900 font-medium">{payment.branch.nama_cabang}</p>
                    <p className="text-sm text-gray-500">
                      {payment.branch.kode_cabang} • {payment.branch.kota}, {payment.branch.provinsi}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start space-x-3">
                  <Building2 className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Cabang</p>
                    <p className="text-gray-500 italic">Tidak terkait dengan cabang tertentu</p>
                  </div>
                </div>
              )}

              {payment.processor && (
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Diproses oleh</p>
                    <p className="text-gray-900">{payment.processor.nama_lengkap}</p>
                    <p className="text-sm text-gray-500">{payment.processor.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Receipt */}
          {payment.receipt_url && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                Bukti Pembayaran
              </h4>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ExternalLink className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900">Bukti Pembayaran Tersedia</p>
                      <p className="text-xs text-blue-700">Klik untuk melihat dokumen</p>
                    </div>
                  </div>
                  <a
                    href={payment.receipt_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Lihat Bukti</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Ringkasan Pembayaran</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">
                  Rp {(payment.amount / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-blue-600">Nilai Pembayaran</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {payment.status === 'berhasil' ? '✓' : payment.status === 'pending' ? '⏳' : '✗'}
                </div>
                <div className="text-xs text-blue-600">Status</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {payment.member ? '1' : '0'}
                </div>
                <div className="text-xs text-blue-600">Anggota Terkait</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {payment.receipt_url ? '📄' : '📝'}
                </div>
                <div className="text-xs text-blue-600">Bukti</div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <p><span className="font-medium">Dibuat:</span> {new Date(payment.created_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
              <div>
                <p><span className="font-medium">Diperbarui:</span> {new Date(payment.updated_at).toLocaleDateString('id-ID', {
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