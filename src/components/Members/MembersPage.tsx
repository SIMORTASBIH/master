import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Download, Upload, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useMembers } from '../../hooks/useMembers';
import { useBranches } from '../../hooks/useBranches';
import { Member } from '../../lib/supabase';
import MemberForm from './MemberForm';
import MemberTable from './MemberTable';
import MemberDetail from './MemberDetail';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function MembersPage() {
  const { profile } = useAuth();
  const { 
    members, 
    loading: membersLoading, 
    error: membersError,
    createMember, 
    updateMember, 
    deleteMember,
    fetchMembers
  } = useMembers();
  const { branches, loading: branchesLoading } = useBranches();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [deletingMember, setDeletingMember] = useState<Member | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Check user permissions
  const canModify = profile?.role === 'admin' || 
                   profile?.role === 'super_admin' || 
                   profile?.role === 'pengurus';

  // Filter members based on search and filters
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesSearch = member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.member_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.phone?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
      const matchesBranch = branchFilter === 'all' || member.branch_id === branchFilter;
      
      return matchesSearch && matchesStatus && matchesBranch;
    });
  }, [members, searchTerm, statusFilter, branchFilter]);

  const handleSubmit = async (memberData: any) => {
    setFormLoading(true);
    try {
      const dataToSubmit = {
        ...memberData,
        created_by: profile?.id,
      };

      if (editingMember) {
        await updateMember(editingMember.id, dataToSubmit);
      } else {
        await createMember(dataToSubmit);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving member:', error);
      // Error is handled by the hook and will show in UI
    } finally {
      setFormLoading(false);
    }
  };

  const handleView = (member: Member) => {
    setViewingMember(member);
    setShowDetailModal(true);
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setShowModal(true);
  };

  const handleEditFromDetail = (member: Member) => {
    setShowDetailModal(false);
    setEditingMember(member);
    setShowModal(true);
  };

  const handleDelete = (member: Member) => {
    setDeletingMember(member);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingMember) return;

    setDeleteLoading(true);
    try {
      await deleteMember(deletingMember.id);
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error deleting member:', error);
      // Error is handled by the hook
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMember(null);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setViewingMember(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingMember(null);
  };

  const handleAddNew = () => {
    setEditingMember(null);
    setShowModal(true);
  };

  const handleRefresh = () => {
    fetchMembers();
  };

  const loading = membersLoading || branchesLoading;

  if (loading && members.length === 0) {
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
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Anggota</h2>
          <p className="text-gray-600">Kelola data anggota organisasi dengan mudah</p>
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
                <span>Tambah Anggota</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {membersError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>{membersError}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">{members.length}</div>
              <div className="text-sm text-gray-600">Total Anggota</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {members.filter(m => m.status === 'aktif').length}
              </div>
              <div className="text-sm text-gray-600">Anggota Aktif</div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-600">
                {members.filter(m => m.status === 'non_aktif').length}
              </div>
              <div className="text-sm text-gray-600">Tidak Aktif</div>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {members.filter(m => m.status === 'alumni').length}
              </div>
              <div className="text-sm text-gray-600">Alumni</div>
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
                placeholder="Cari nama, nomor anggota, email, atau telepon..."
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
              <option value="aktif">Aktif</option>
              <option value="non_aktif">Tidak Aktif</option>
              <option value="alumni">Alumni</option>
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
        {(searchTerm || statusFilter !== 'all' || branchFilter !== 'all') && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Menampilkan {filteredMembers.length} dari {members.length} anggota
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
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

      {/* Members Table */}
      <MemberTable
        members={filteredMembers}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        canModify={canModify}
        loading={loading}
      />

      {/* Add/Edit Modal */}
      {showModal && (
        <MemberForm
          member={editingMember}
          branches={branches}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
          loading={formLoading}
        />
      )}

      {/* Detail Modal */}
      {showDetailModal && viewingMember && (
        <MemberDetail
          member={viewingMember}
          onClose={handleCloseDetailModal}
          onEdit={handleEditFromDetail}
          canModify={canModify}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingMember && (
        <DeleteConfirmModal
          member={deletingMember}
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseDeleteModal}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}