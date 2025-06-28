import { useState, useEffect } from 'react';
import { Member, MemberService } from '../lib/localStorage';

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await MemberService.getAll();
      setMembers(data);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  const createMember = async (memberData: Omit<Member, 'id' | 'member_number' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      const newMember = await MemberService.create(memberData);
      setMembers(prev => [newMember, ...prev]);
      return newMember;
    } catch (err) {
      console.error('Error creating member:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create member';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateMember = async (id: string, memberData: Partial<Member>) => {
    try {
      setError(null);
      const updatedMember = await MemberService.update(id, memberData);
      setMembers(prev => prev.map(member => 
        member.id === id ? updatedMember : member
      ));
      return updatedMember;
    } catch (err) {
      console.error('Error updating member:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update member';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteMember = async (id: string) => {
    try {
      setError(null);
      await MemberService.delete(id);
      setMembers(prev => prev.filter(member => member.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting member:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete member';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getMemberById = async (id: string) => {
    try {
      setError(null);
      return await MemberService.getById(id);
    } catch (err) {
      console.error('Error fetching member:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch member';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return {
    members,
    loading,
    error,
    fetchMembers,
    createMember,
    updateMember,
    deleteMember,
    getMemberById,
  };
}