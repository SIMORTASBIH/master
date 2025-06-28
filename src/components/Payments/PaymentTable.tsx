import React from 'react';
import { Edit2, Trash2, Eye, CreditCard, Calendar, User, ExternalLink } from 'lucide-react';
import { Payment } from '../../lib/localStorage';

interface PaymentTableProps {
  payments: Payment[];
  onView: (payment: Payment) => void;
  onEdit: (payment: Payment) => void;
  onDelete: (payment: Payment) => void;
  canModify: boolean;
  loading?: boolean;
}

export default function PaymentTable({ 
  payments, 
  onView,
  onEdit, 
  onDelete, 
  canModify,
  loading = false 
}: PaymentTableProps) {
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

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'iuran_bulanan': 'bg-blue-100 text-blue-800',
      'iuran_tahunan': 'bg-purple-100 text-purple-800',
      'donasi': 'bg-green-100 text-green-800',
      'kegiatan': 'bg-orange-100 text-orange-800',
      'lainnya': 'bg-gray-100 text-gray-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading && payments.length === 0) {
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

  if (payments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum ada pembayaran</h3>
        <p className="text-gray-500 mb-4">
          Mulai dengan menambahkan pembayaran pertama ke dalam sistem
        </p>
        {canModify && (
          <button
            onClick={() => {/* This would trigger add new payment */}}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tambah Pembayaran Pertama
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
                Pembayaran
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Anggota
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jenis & Jumlah
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
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
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 font-mono">
                        {payment.payment_number}
                      </div>
                      <div className="text-xs text-gray-500 max-w-[200px] truncate">
                        {payment.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {payment.member ? (
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <User className="h-3 w-3" />
                      <div>
                        <div className="font-medium text-gray-900">{payment.member.full_name}</div>
                        <div className="text-xs text-gray-500 font-mono">{payment.member.member_number}</div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(payment.payment_type)}`}>
                      {getTypeLabel(payment.payment_type)}
                    </span>
                    <div className="text-sm font-medium text-gray-900">
                      Rp {payment.amount.toLocaleString('id-ID')}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(payment.payment_date).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(payment.status)}`}>
                    {getStatusText(payment.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2 justify-end">
                    {payment.receipt_url && (
                      <a
                        href={payment.receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-900 p-2 rounded-lg hover:bg-purple-50 transition-colors"
                        title="Lihat Bukti"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    <button
                      onClick={() => onView(payment)}
                      className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Lihat Detail"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {canModify && (
                      <>
                        <button
                          onClick={() => onEdit(payment)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Edit Pembayaran"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(payment)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Hapus Pembayaran"
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
            Menampilkan <span className="font-medium">{payments.length}</span> pembayaran
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