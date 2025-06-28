import { useState, useEffect } from 'react';
import { Official, OfficialService } from '../lib/localStorage';

export function useOfficials() {
  const [officials, setOfficials] = useState<Official[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOfficials = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await OfficialService.getAll();
      setOfficials(data);
    } catch (err) {
      console.error('Error fetching officials:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch officials');
    } finally {
      setLoading(false);
    }
  };

  const createOfficial = async (officialData: Omit<Official, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      const newOfficial = await OfficialService.create(officialData);
      setOfficials(prev => [newOfficial, ...prev]);
      return newOfficial;
    } catch (err) {
      console.error('Error creating official:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create official';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateOfficial = async (id: string, officialData: Partial<Official>) => {
    try {
      setError(null);
      const updatedOfficial = await OfficialService.update(id, officialData);
      setOfficials(prev => prev.map(official => 
        official.id === id ? updatedOfficial : official
      ));
      return updatedOfficial;
    } catch (err) {
      console.error('Error updating official:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update official';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteOfficial = async (id: string) => {
    try {
      setError(null);
      await OfficialService.delete(id);
      setOfficials(prev => prev.filter(official => official.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting official:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete official';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getOfficialById = async (id: string) => {
    try {
      setError(null);
      return await OfficialService.getById(id);
    } catch (err) {
      console.error('Error fetching official:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch official';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchOfficials();
  }, []);

  return {
    officials,
    loading,
    error,
    fetchOfficials,
    createOfficial,
    updateOfficial,
    deleteOfficial,
    getOfficialById,
  };
}