import { useState, useEffect } from 'react';
import { Cabang, BranchService } from '../lib/localStorage';

export function useBranches() {
  const [branches, setBranches] = useState<Cabang[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await BranchService.getAll();
      setBranches(data);
    } catch (err) {
      console.error('Error fetching branches:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch branches');
    } finally {
      setLoading(false);
    }
  };

  const createBranch = async (branchData: Omit<Cabang, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      const newBranch = await BranchService.create(branchData);
      setBranches(prev => [newBranch, ...prev]);
      return newBranch;
    } catch (err) {
      console.error('Error creating branch:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create branch';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateBranch = async (id: string, branchData: Partial<Cabang>) => {
    try {
      setError(null);
      const updatedBranch = await BranchService.update(id, branchData);
      setBranches(prev => prev.map(branch => 
        branch.id === id ? updatedBranch : branch
      ));
      return updatedBranch;
    } catch (err) {
      console.error('Error updating branch:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update branch';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteBranch = async (id: string) => {
    try {
      setError(null);
      await BranchService.delete(id);
      setBranches(prev => prev.filter(branch => branch.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting branch:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete branch';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getBranchById = async (id: string) => {
    try {
      setError(null);
      return await BranchService.getById(id);
    } catch (err) {
      console.error('Error fetching branch:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch branch';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  return {
    branches,
    loading,
    error,
    fetchBranches,
    createBranch,
    updateBranch,
    deleteBranch,
    getBranchById,
  };
}