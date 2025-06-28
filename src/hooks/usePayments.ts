import { useState, useEffect } from 'react';
import { Payment, PaymentService } from '../lib/localStorage';

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await PaymentService.getAll();
      setPayments(data);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (paymentData: Omit<Payment, 'id' | 'payment_number' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      const newPayment = await PaymentService.create(paymentData);
      setPayments(prev => [newPayment, ...prev]);
      return newPayment;
    } catch (err) {
      console.error('Error creating payment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create payment';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updatePayment = async (id: string, paymentData: Partial<Payment>) => {
    try {
      setError(null);
      const updatedPayment = await PaymentService.update(id, paymentData);
      setPayments(prev => prev.map(payment => 
        payment.id === id ? updatedPayment : payment
      ));
      return updatedPayment;
    } catch (err) {
      console.error('Error updating payment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update payment';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deletePayment = async (id: string) => {
    try {
      setError(null);
      await PaymentService.delete(id);
      setPayments(prev => prev.filter(payment => payment.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting payment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete payment';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getPaymentById = async (id: string) => {
    try {
      setError(null);
      return await PaymentService.getById(id);
    } catch (err) {
      console.error('Error fetching payment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch payment';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return {
    payments,
    loading,
    error,
    fetchPayments,
    createPayment,
    updatePayment,
    deletePayment,
    getPaymentById,
  };
}