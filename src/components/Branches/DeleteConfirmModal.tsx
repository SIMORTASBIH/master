import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { Cabang } from '../../lib/localStorage';

interface DeleteConfirmModalProps {
  branch: Cabang;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function DeleteConfirmModal({ 
  branch, 
  onConfirm, 
  onCancel, 
  loading = false 
}: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Konfirmasi Hapus</h3>
            </div>
            <button
              onClick={onCancel}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Apakah Anda yakin ingin menghapus cabang berikut?
            </p>
            
            {/* Branch Info Card */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {branch.nama_cabang.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{branch.nama_cabang}</p>
                  <p className="text-sm text-gray-600 font-mono">{branch.kode_cabang}</p>
                  <p className="text-sm text-gray-500">{branch.kota}, {branch.provinsi}</p>
                </div>
              </div>
            </div>
            
            {/* Warning */}
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-red-800 font-medium mb-1">
                    Peringatan: Tindakan ini tidak dapat dibatalkan!
                  </p>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Data cabang akan dihapus secara permanen</li>
                    <li>• Anggota terkait akan kehilangan referensi cabang</li>
                    <li>• Data tidak dapat dipulihkan setelah dihapus</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={loading}
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <Trash2 className="h-4 w-4" />
              <span>Hapus Cabang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}