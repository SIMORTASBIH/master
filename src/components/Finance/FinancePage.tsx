import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Download, Upload, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useFinancialRecords } from '../../hooks/useFinancialRecords';
import { useBranches } from '../../hooks/useBranches';
import { FinancialRecord } from '../../lib/localStorage';
import FinanceForm from './FinanceForm';
import FinanceTable from './FinanceTable';
import FinanceDetail from './FinanceDetail';
import DeleteConfirmModal from './DeleteConfirmModal';
import FinanceSummary from './FinanceSummary';

export default function FinancePage() {
  const { profile } = useAuth();
  const { 
    financialRecords, 
    loading: recordsLoading, 
    error: recordsError,
    createFinancialRecord, 
    updateFinancialRecord, 
    deleteFinancialRecord,
    fetchFinancialRecords
  } = useFinancialRecords();
  const { branches, loading: branchesLoading } = useBranches();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FinancialRecord | null>(null);
  const [viewingRecord, setViewingRecord] = useState<FinancialRecord | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<FinancialRecord | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Check user permissions
  const canModify = profile?.role === 'admin' || 
                   profile?.role === 'super_admin' || 
                   profile?.role === 'pengurus';

  // Get unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(financialRecords.map(r => r.category).filter(Boolean))];
    return uniqueCategories.sort();
  }, [financialRecords]);

  // Filter records based on search and filters
  const filteredRecords = useMemo(() => {
    return financialRecords.filter(record => {
      const matchesSearch = record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           record.category?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'all' || record.transaction_type === typeFilter;
      const matchesCategory = categoryFilter === 'all' || record.category === categoryFilter;
      const matchesBranch = branchFilter === 'all' || record.branch_id === branchFilter;
      
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const recordDate = new Date(record.transaction_date);
        const today = new Date();
        
        switch (dateFilter) {
          case 'today':
            matchesDate = recordDate.toDateString() === today.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = recordDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = recordDate >= monthAgo;
            break;
          case 'year':
            const yearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
            matchesDate = recordDate >= yearAgo;
            break;
        }
      }
      
      return matchesSearch && matchesType && matchesCategory && matchesBranch && matchesDate;
    });
  }, [financialRecords, searchTerm, typeFilter, categoryFilter, branchFilter, dateFilter]);

  const handleSubmit = async (recordData: any) => {
    setFormLoading(true);
    try {
      const dataToSubmit = {
        ...recordData,
        created_by: profile?.id,
      };

      if (editingRecord) {
        await updateFinancialRecord(editingRecord.id, dataToSubmit);
      } else {
        await createFinancialRecord(dataToSubmit);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving financial record:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleView = (record: FinancialRecord) => {
    setViewingRecord(record);
    setShowDetailModal(true);
  };

  const handleEdit = (record: FinancialRecord) => {
    setEditingRecord(record);
    setShowModal(true);
  };

  const handleEditFromDetail = (record: FinancialRecord) => {
    setShowDetailModal(false);
    setEditingRecord(record);
    setShowModal(true);
  };

  const handleDelete = (record: FinancialRecord) => {
    setDeletingRecord(record);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingRecord) return;

    setDeleteLoading(true);
    try {
      await deleteFinancialRecord(deletingRecord.id);
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error deleting financial record:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRecord(null);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setViewingRecord(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingRecord(null);
  };

  const handleAddNew = () => {
    setEditingRecord(null);
    setShowModal(true);
  };

  const handleRefresh = () => {
    fetchFinancialRecords();
  };

  const loading = recordsLoading || branchesLoading;

  // Calculate statistics
  const totalIncome = filteredRecords
    .filter(r => r.transaction_type === 'pemasukan')
    .reduce((sum, r) => sum + r.amount, 0);
  
  const totalExpense = filteredRecords
    .filter(r => r.transaction_type === 'pengeluaran')
    .reduce((sum, r) => sum + r.amount, 0);
  
  const netBalance = totalIncome - totalExpense;

  if (loading && financialRecords.length === 0) {
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
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Keuangan</h2>
          <p className="text-gray-600">Kelola catatan keuangan dan laporan organisasi</p>
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
                <span>Tambah Transaksi</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {recordsError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>{recordsError}</span>
        </div>
      )}

      {/* Financial Summary */}
      <FinanceSummary
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        netBalance={netBalance}
        recordCount={filteredRecords.length}
      />

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari deskripsi atau kategori transaksi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-w-[120px]"
            >
              <option value="all">Semua Jenis</option>
              <option value="pemasukan">Pemasukan</option>
              <option value="pengeluaran">Pengeluaran</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-w-[140px]"
            >
              <option value="all">Semua Kategori</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
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
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-w-[120px]"
            >
              <option value="all">Semua Waktu</option>
              <option value="today">Hari Ini</option>
              <option value="week">7 Hari Terakhir</option>
              <option value="month">30 Hari Terakhir</option>
              <option value="year">1 Tahun Terakhir</option>
            </select>
          </div>
        </div>
        
        {/* Filter Summary */}
        {(searchTerm || typeFilter !== 'all' || categoryFilter !== 'all' || branchFilter !== 'all' || dateFilter !== 'all') && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Menampilkan {filteredRecords.length} dari {financialRecords.length} transaksi
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('all');
                  setCategoryFilter('all');
                  setBranchFilter('all');
                  setDateFilter('all');
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Reset Filter
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Financial Records Table */}
      <FinanceTable
        records={filteredRecords}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        canModify={canModify}
        loading={loading}
      />

      {/* Add/Edit Modal */}
      {showModal && (
        <FinanceForm
          record={editingRecord}
          branches={branches}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
          loading={formLoading}
        />
      )}

      {/* Detail Modal */}
      {showDetailModal && viewingRecord && (
        <FinanceDetail
          record={viewingRecord}
          onClose={handleCloseDetailModal}
          onEdit={handleEditFromDetail}
          canModify={canModify}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingRecord && (
        <DeleteConfirmModal
          record={deletingRecord}
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseDeleteModal}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}