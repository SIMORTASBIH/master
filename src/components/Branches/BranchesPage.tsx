import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Download, Upload, RefreshCw, Building2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useBranches } from '../../hooks/useBranches';
import { Cabang } from '../../lib/localStorage';
import BranchForm from './BranchForm';
import BranchTable from './BranchTable';
import BranchDetail from './BranchDetail';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function BranchesPage() {
  const { profile } = useAuth();
  const { 
    branches, 
    loading: branchesLoading, 
    error: branchesError,
    createBranch, 
    updateBranch, 
    deleteBranch,
    fetchBranches
  } = useBranches();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [provinceFilter, setProvinceFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Cabang | null>(null);
  const [viewingBranch, setViewingBranch] = useState<Cabang | null>(null);
  const [deletingBranch, setDeletingBranch] = useState<Cabang | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Check user permissions
  const canModify = profile?.role === 'admin' || 
                   profile?.role === 'super_admin' || 
                   profile?.role === 'pengurus';

  // Get unique provinces for filter
  const provinces = useMemo(() => {
    const uniqueProvinces = [...new Set(branches.map(b => b.provinsi))];
    return uniqueProvinces.sort();
  }, [branches]);

  // Filter branches based on search and filters
  const filteredBranches = useMemo(() => {
    return branches.filter(branch => {
      const matchesSearch = branch.nama_cabang.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           branch.kode_cabang.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           branch.kota.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           branch.provinsi.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && branch.status !== false) ||
                           (statusFilter === 'inactive' && branch.status === false);
      
      const matchesProvince = provinceFilter === 'all' || branch.provinsi === provinceFilter;
      
      return matchesSearch && matchesStatus && matchesProvince;
    });
  }, [branches, searchTerm, statusFilter, provinceFilter]);

  const handleSubmit = async (branchData: any) => {
    setFormLoading(true);
    try {
      const dataToSubmit = {
        ...branchData,
        status: branchData.status !== false,
      };

      if (editingBranch) {
        await updateBranch(editingBranch.id, dataToSubmit);
      } else {
        await createBranch(dataToSubmit);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving branch:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleView = (branch: Cabang) => {
    setViewingBranch(branch);
    setShowDetailModal(true);
  };

  const handleEdit = (branch: Cabang) => {
    setEditingBranch(branch);
    setShowModal(true);
  };

  const handleEditFromDetail = (branch: Cabang) => {
    setShowDetailModal(false);
    setEditingBranch(branch);
    setShowModal(true);
  };

  const handleDelete = (branch: Cabang) => {
    setDeletingBranch(branch);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingBranch) return;

    setDeleteLoading(true);
    try {
      await deleteBranch(deletingBranch.id);
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error deleting branch:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBranch(null);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setViewingBranch(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingBranch(null);
  };

  const handleAddNew = () => {
    setEditingBranch(null);
    setShowModal(true);
  };

  const handleRefresh = () => {
    fetchBranches();
  };

  const loading = branchesLoading;

  if (loading && branches.length === 0) {
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
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Cabang</h2>
          <p className="text-gray-600">Kelola data cabang organisasi dengan mudah</p>
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
                <span>Tambah Cabang</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {branchesError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>{branchesError}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">{branches.length}</div>
              <div className="text-sm text-gray-600">Total Cabang</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {branches.filter(b => b.status !== false).length}
              </div>
              <div className="text-sm text-gray-600">Cabang Aktif</div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600">{provinces.length}</div>
              <div className="text-sm text-gray-600">Provinsi</div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {branches.reduce((sum, b) => sum + (b.jumlah_anggota || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Anggota</div>
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
                placeholder="Cari nama cabang, kode, kota, atau provinsi..."
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
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </select>
            <select
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-w-[140px]"
            >
              <option value="all">Semua Provinsi</option>
              {provinces.map(province => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Filter Summary */}
        {(searchTerm || statusFilter !== 'all' || provinceFilter !== 'all') && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Menampilkan {filteredBranches.length} dari {branches.length} cabang
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setProvinceFilter('all');
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Reset Filter
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Branches Table */}
      <BranchTable
        branches={filteredBranches}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        canModify={canModify}
        loading={loading}
      />

      {/* Add/Edit Modal */}
      {showModal && (
        <BranchForm
          branch={editingBranch}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
          loading={formLoading}
        />
      )}

      {/* Detail Modal */}
      {showDetailModal && viewingBranch && (
        <BranchDetail
          branch={viewingBranch}
          onClose={handleCloseDetailModal}
          onEdit={handleEditFromDetail}
          canModify={canModify}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingBranch && (
        <DeleteConfirmModal
          branch={deletingBranch}
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseDeleteModal}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}