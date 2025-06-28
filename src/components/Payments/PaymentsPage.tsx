import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Download, Upload, RefreshCw, CreditCard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePayments } from '../../hooks/usePayments';
import { useMembers } from '../../hooks/useMembers';
import { useBranches } from '../../hooks/useBranches';
import { Payment } from '../../lib/localStorage';
import PaymentForm from './PaymentForm';
import PaymentTable from './PaymentTable';
import PaymentDetail from './PaymentDetail';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function PaymentsPage() {
  const { profile } = useAuth();
  const { 
    payments, 
    loading: paymentsLoading, 
    error: paymentsError,
    createPayment, 
    updatePayment, 
    deletePayment,
    fetchPayments
  } = usePayments();
  const { members, loading: membersLoading } = useMembers();
  const { branches, loading: branchesLoading } = useBranches();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [viewingPayment, setViewingPayment] = useState<Payment | null>(null);
  const [deletingPayment, setDeletingPayment] = useState<Payment | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Check user permissions
  const canModify = profile?.role === 'admin' || 
                   profile?.role === 'super_admin' || 
                   profile?.role === 'pengurus';

  // Payment types
  const paymentTypes = [
    { value: 'iuran_bulanan', label: 'Iuran Bulanan' },
    { value: 'iuran_tahunan', label: 'Iuran Tahunan' },
    { value: 'donasi', label: 'Donasi' },
    { value: 'kegiatan', label: 'Kegiatan' },
    { value: 'lainnya', label: 'Lainnya' },
  ];

  // Filter payments based on search and filters
  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const matchesSearch = payment.payment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           payment.member?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           payment.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      const matchesType = typeFilter === 'all' || payment.payment_type === typeFilter;
      const matchesBranch = branchFilter === 'all' || payment.branch_id === branchFilter;
      
      return matchesSearch && matchesStatus && matchesType && matchesBranch;
    });
  }, [payments, searchTerm, statusFilter, typeFilter, branchFilter]);

  const handleSubmit = async (paymentData: any) => {
    setFormLoading(true);
    try {
      const dataToSubmit = {
        ...paymentData,
        processed_by: profile?.id,
      };

      if (editingPayment) {
        await updatePayment(editingPayment.id, dataToSubmit);
      } else {
        await createPayment(dataToSubmit);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving payment:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleView = (payment: Payment) => {
    setViewingPayment(payment);
    setShowDetailModal(true);
  };

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setShowModal(true);
  };

  const handleEditFromDetail = (payment: Payment) => {
    setShowDetailModal(false);
    setEditingPayment(payment);
    setShowModal(true);
  };

  const handleDelete = (payment: Payment) => {
    setDeletingPayment(payment);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingPayment) return;

    setDeleteLoading(true);
    try {
      await deletePayment(deletingPayment.id);
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error deleting payment:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPayment(null);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setViewingPayment(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingPayment(null);
  };

  const handleAddNew = () => {
    setEditingPayment(null);
    setShowModal(true);
  };

  const handleRefresh = () => {
    fetchPayments();
  };

  const loading = paymentsLoading || membersLoading || branchesLoading;

  // Calculate statistics
  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const successfulPayments = filteredPayments.filter(p => p.status === 'berhasil');
  const pendingPayments = filteredPayments.filter(p => p.status === 'pending');
  const failedPayments = filteredPayments.filter(p => p.status === 'gagal');

  if (loading && payments.length === 0) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Pembayaran</h2>
          <p className="text-gray-600">Kelola pembayaran dan transaksi organisasi</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          {canModify && (
            <>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-200 transition-colors">
                <Upload className="h-4 w-4" />
                <span>Import</span>
              </button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-200 transition-colors">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button
                onClick={handleAddNew}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus className="h-5 w-5" />
                <span>Tambah Pembayaran</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {paymentsError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>{paymentsError}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">{filteredPayments.length}</div>
              <div className="text-sm text-gray-600">Total Pembayaran</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{successfulPayments.length}</div>
              <div className="text-sm text-gray-600">Berhasil</div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600">{pendingPayments.length}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-purple-600">
                Rp {totalAmount.toLocaleString('id-ID')}
              </div>
              <div className="text-sm text-gray-600">Total Nilai</div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nomor pembayaran, nama anggota, atau deskripsi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-w-[120px]"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="berhasil">Berhasil</option>
              <option value="gagal">Gagal</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-w-[140px]"
            >
              <option value="all">Semua Jenis</option>
              {paymentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-w-[140px]"
            >
              <option value="all">Semua Cabang</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>
                  {branch.nama_cabang}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Filter Summary */}
        {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || branchFilter !== 'all') && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Menampilkan {filteredPayments.length} dari {payments.length} pembayaran
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setTypeFilter('all');
                  setBranchFilter('all');
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Reset Filter
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payments Table */}
      <PaymentTable
        payments={filteredPayments}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        canModify={canModify}
        loading={loading}
      />

      {/* Add/Edit Modal */}
      {showModal && (
        <PaymentForm
          payment={editingPayment}
          members={members}
          branches={branches}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
          loading={formLoading}
        />
      )}

      {/* Detail Modal */}
      {showDetailModal && viewingPayment && (
        <PaymentDetail
          payment={viewingPayment}
          onClose={handleCloseDetailModal}
          onEdit={handleEditFromDetail}
          canModify={canModify}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingPayment && (
        <DeleteConfirmModal
          payment={deletingPayment}
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseDeleteModal}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}