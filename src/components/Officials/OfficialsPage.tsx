import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Download, Upload, RefreshCw, UserCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useOfficials } from '../../hooks/useOfficials';
import { useBranches } from '../../hooks/useBranches';
import { useProfiles } from '../../hooks/useProfiles';
import { Official } from '../../lib/localStorage';
import OfficialForm from './OfficialForm';
import OfficialTable from './OfficialTable';
import OfficialDetail from './OfficialDetail';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function OfficialsPage() {
  const { profile } = useAuth();
  const { 
    officials, 
    loading: officialsLoading, 
    error: officialsError,
    createOfficial, 
    updateOfficial, 
    deleteOfficial,
    fetchOfficials
  } = useOfficials();
  const { branches, loading: branchesLoading } = useBranches();
  const { profiles, loading: profilesLoading } = useProfiles();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingOfficial, setEditingOfficial] = useState<Official | null>(null);
  const [viewingOfficial, setViewingOfficial] = useState<Official | null>(null);
  const [deletingOfficial, setDeletingOfficial] = useState<Official | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Check user permissions
  const canModify = profile?.role === 'admin' || 
                   profile?.role === 'super_admin';

  // Get unique positions for filter
  const positions = [
    { value: 'ketua_umum', label: 'Ketua Umum' },
    { value: 'wakil_ketua', label: 'Wakil Ketua' },
    { value: 'sekretaris', label: 'Sekretaris' },
    { value: 'bendahara', label: 'Bendahara' },
    { value: 'koordinator_cabang', label: 'Koordinator Cabang' },
    { value: 'anggota_pengurus', label: 'Anggota Pengurus' },
  ];

  // Filter officials based on search and filters
  const filteredOfficials = useMemo(() => {
    return officials.filter(official => {
      const matchesSearch = official.profile?.nama_lengkap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           official.branch?.nama_cabang?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           official.position.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && official.is_active) ||
                           (statusFilter === 'inactive' && !official.is_active);
      
      const matchesPosition = positionFilter === 'all' || official.position === positionFilter;
      const matchesBranch = branchFilter === 'all' || official.branch_id === branchFilter;
      
      return matchesSearch && matchesStatus && matchesPosition && matchesBranch;
    });
  }, [officials, searchTerm, statusFilter, positionFilter, branchFilter]);

  const handleSubmit = async (officialData: any) => {
    setFormLoading(true);
    try {
      if (editingOfficial) {
        await updateOfficial(editingOfficial.id, officialData);
      } else {
        await createOfficial(officialData);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving official:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleView = (official: Official) => {
    setViewingOfficial(official);
    setShowDetailModal(true);
  };

  const handleEdit = (official: Official) => {
    setEditingOfficial(official);
    setShowModal(true);
  };

  const handleEditFromDetail = (official: Official) => {
    setShowDetailModal(false);
    setEditingOfficial(official);
    setShowModal(true);
  };

  const handleDelete = (official: Official) => {
    setDeletingOfficial(official);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingOfficial) return;

    setDeleteLoading(true);
    try {
      await deleteOfficial(deletingOfficial.id);
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error deleting official:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingOfficial(null);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setViewingOfficial(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingOfficial(null);
  };

  const handleAddNew = () => {
    setEditingOfficial(null);
    setShowModal(true);
  };

  const handleRefresh = () => {
    fetchOfficials();
  };

  const loading = officialsLoading || branchesLoading || profilesLoading;

  if (loading && officials.length === 0) {
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
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Pengurus</h2>
          <p className="text-gray-600">Kelola data pengurus organisasi dengan mudah</p>
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
                <span>Tambah Pengurus</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {officialsError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>{officialsError}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">{officials.length}</div>
              <div className="text-sm text-gray-600">Total Pengurus</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {officials.filter(o => o.is_active).length}
              </div>
              <div className="text-sm text-gray-600">Pengurus Aktif</div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {officials.filter(o => !o.is_active).length}
              </div>
              <div className="text-sm text-gray-600">Tidak Aktif</div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">{branches.length}</div>
              <div className="text-sm text-gray-600">Cabang Terdaftar</div>
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
                placeholder="Cari nama pengurus, jabatan, atau cabang..."
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
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-w-[140px]"
            >
              <option value="all">Semua Jabatan</option>
              {positions.map(position => (
                <option key={position.value} value={position.value}>
                  {position.label}
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
        {(searchTerm || statusFilter !== 'all' || positionFilter !== 'all' || branchFilter !== 'all') && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Menampilkan {filteredOfficials.length} dari {officials.length} pengurus
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setPositionFilter('all');
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

      {/* Officials Table */}
      <OfficialTable
        officials={filteredOfficials}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        canModify={canModify}
        loading={loading}
      />

      {/* Add/Edit Modal */}
      {showModal && (
        <OfficialForm
          official={editingOfficial}
          branches={branches}
          profiles={profiles}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
          loading={formLoading}
        />
      )}

      {/* Detail Modal */}
      {showDetailModal && viewingOfficial && (
        <OfficialDetail
          official={viewingOfficial}
          onClose={handleCloseDetailModal}
          onEdit={handleEditFromDetail}
          canModify={canModify}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingOfficial && (
        <DeleteConfirmModal
          official={deletingOfficial}
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseDeleteModal}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}