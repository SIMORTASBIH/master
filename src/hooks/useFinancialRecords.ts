import { useState, useEffect } from 'react';
import { FinancialRecord, FinancialRecordService } from '../lib/localStorage';

export function useFinancialRecords() {
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFinancialRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await FinancialRecordService.getAll();
      setFinancialRecords(data);
    } catch (err) {
      console.error('Error fetching financial records:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch financial records');
    } finally {
      setLoading(false);
    }
  };

  const createFinancialRecord = async (recordData: Omit<FinancialRecord, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      const newRecord = await FinancialRecordService.create(recordData);
      setFinancialRecords(prev => [newRecord, ...prev]);
      return newRecord;
    } catch (err) {
      console.error('Error creating financial record:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create financial record';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateFinancialRecord = async (id: string, recordData: Partial<FinancialRecord>) => {
    try {
      setError(null);
      const updatedRecord = await FinancialRecordService.update(id, recordData);
      setFinancialRecords(prev => prev.map(record => 
        record.id === id ? updatedRecord : record
      ));
      return updatedRecord;
    } catch (err) {
      console.error('Error updating financial record:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update financial record';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteFinancialRecord = async (id: string) => {
    try {
      setError(null);
      await FinancialRecordService.delete(id);
      setFinancialRecords(prev => prev.filter(record => record.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting financial record:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete financial record';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getFinancialRecordById = async (id: string) => {
    try {
      setError(null);
      return await FinancialRecordService.getById(id);
    } catch (err) {
      console.error('Error fetching financial record:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch financial record';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchFinancialRecords();
  }, []);

  return {
    financialRecords,
    loading,
    error,
    fetchFinancialRecords,
    createFinancialRecord,
    updateFinancialRecord,
    deleteFinancialRecord,
    getFinancialRecordById,
  };
}