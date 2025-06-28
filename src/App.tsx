import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import DashboardPage from './components/Dashboard/DashboardPage';
import MembersPage from './components/Members/MembersPage';
import BranchesPage from './components/Branches/BranchesPage';
import OfficialsPage from './components/Officials/OfficialsPage';
import PaymentsPage from './components/Payments/PaymentsPage';
import FinancePage from './components/Finance/FinancePage';
import ErrorBoundary from './components/ErrorBoundary';

function AppContent() {
  const { user, loading, error } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Show loading spinner for a short time
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form if no user
  if (!user) {
    return <LoginForm />;
  }

  const pageConfig = {
    dashboard: { title: 'Dashboard', subtitle: 'Ringkasan aktivitas organisasi', component: DashboardPage },
    members: { title: 'Anggota', subtitle: 'Kelola data anggota organisasi', component: MembersPage },
    branches: { title: 'Cabang', subtitle: 'Kelola cabang organisasi', component: BranchesPage },
    officials: { title: 'Pengurus', subtitle: 'Kelola pengurus organisasi', component: OfficialsPage },
    payments: { title: 'Pembayaran', subtitle: 'Kelola pembayaran dan transaksi', component: PaymentsPage },
    finance: { title: 'Keuangan', subtitle: 'Laporan keuangan dan budget', component: FinancePage },
    'reports-members': { title: 'Laporan Anggota', subtitle: 'Laporan data anggota organisasi', component: () => <div className="p-6">Laporan Anggota coming soon...</div> },
    'reports-finance': { title: 'Laporan Keuangan', subtitle: 'Laporan keuangan dan transaksi', component: () => <div className="p-6">Laporan Keuangan coming soon...</div> },
    'reports-activities': { title: 'Laporan Kegiatan', subtitle: 'Laporan kegiatan organisasi', component: () => <div className="p-6">Laporan Kegiatan coming soon...</div> },
    'categories': { title: 'Kategori', subtitle: 'Kelola kategori pembayaran dan keuangan', component: () => <div className="p-6">Kategori coming soon...</div> },
    'users-roles': { title: 'Pengguna dan Peran Akses', subtitle: 'Kelola pengguna dan hak akses sistem', component: () => <div className="p-6">Pengguna dan Peran Akses coming soon...</div> },
    'system-settings': { title: 'Pengaturan Sistem', subtitle: 'Konfigurasi sistem dan aplikasi', component: () => <div className="p-6">Pengaturan Sistem coming soon...</div> },
    'profile-settings': { title: 'Profil Saya', subtitle: 'Kelola profil dan pengaturan akun', component: () => <div className="p-6">Profil Saya coming soon...</div> },
  };

  const config = pageConfig[currentPage as keyof typeof pageConfig] || pageConfig.dashboard;
  const PageComponent = config.component;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header title={config.title} subtitle={config.subtitle} />
        <main className="flex-1 overflow-auto">
          <ErrorBoundary>
            <PageComponent />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;