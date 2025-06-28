import React, { useState, useEffect } from 'react';
import { Users, Building2, CreditCard, TrendingUp, UserCheck, Calendar, Database, RefreshCw, CheckCircle } from 'lucide-react';
import { DashboardService } from '../../lib/localStorage';
import StatsCard from './StatsCard';

interface DashboardStats {
  totalMembers: number;
  activeBranches: number;
  totalPayments: number;
  monthlyRevenue: number;
  activeOfficials: number;
  pendingPayments: number;
  activeMembers: number;
  inactiveMembers: number;
  alumniMembers: number;
}

const DEMO_ACTIVITIES = [
  { action: 'Anggota baru terdaftar', name: 'Ahmad Rizki Pratama', time: '2 jam yang lalu', type: 'member' },
  { action: 'Pembayaran diterima', name: 'Cabang Jakarta Pusat', time: '4 jam yang lalu', type: 'payment' },
  { action: 'Pengurus baru diangkat', name: 'Siti Nurhaliza', time: '1 hari yang lalu', type: 'official' },
  { action: 'Data cabang diperbarui', name: 'Cabang Bandung', time: '2 hari yang lalu', type: 'branch' },
  { action: 'Pembayaran iuran bulanan', name: 'Budi Santoso', time: '2 hari yang lalu', type: 'payment' },
  { action: 'Kegiatan baru dijadwalkan', name: 'Workshop IT', time: '3 hari yang lalu', type: 'activity' },
  { action: 'Member baru bergabung', name: 'Dewi Sartika', time: '4 hari yang lalu', type: 'member' },
  { action: 'Laporan keuangan disubmit', name: 'Cabang Surabaya', time: '5 hari yang lalu', type: 'finance' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  async function fetchDashboardStats() {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching dashboard stats from Local Storage...');
      const statsData = await DashboardService.getStats();
      console.log('📊 Dashboard stats received:', statsData);
      
      setStats(statsData);
    } catch (error) {
      console.error('❌ Error fetching dashboard stats:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-xl"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
          <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-600">Unable to load dashboard statistics</p>
          <button
            onClick={fetchDashboardStats}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Local Storage Status */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-green-800 font-semibold">Local Storage Active</p>
              <p className="text-green-700 text-sm">
                Data tersimpan secara lokal di browser Anda - Tidak memerlukan koneksi internet
              </p>
            </div>
          </div>
          <button
            onClick={fetchDashboardStats}
            disabled={loading}
            className="bg-green-100 text-green-800 px-3 py-1 rounded-lg hover:bg-green-200 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div>
                <p className="text-red-800 font-semibold">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
            <button
              onClick={fetchDashboardStats}
              disabled={loading}
              className="bg-red-100 text-red-800 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Retry</span>
            </button>
          </div>
        </div>
      )}

      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Selamat Datang di SIMOR MDTI</h2>
          <p className="text-blue-100 text-lg">
            Sistem Manajemen Organisasi yang Komprehensif dan Modern
          </p>
          <div className="mt-4 flex items-center space-x-4 text-sm text-blue-100">
            <span>📊 Dashboard Analytics</span>
            <span>👥 Member Management</span>
            <span>💰 Financial Tracking</span>
            <span>💾 Local Storage</span>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Anggota"
          value={stats.totalMembers}
          change="+12% dari bulan lalu"
          changeType="increase"
          icon={Users}
          color="blue"
        />
        
        <StatsCard
          title="Cabang Aktif"
          value={stats.activeBranches}
          change="Stabil"
          changeType="neutral"
          icon={Building2}
          color="green"
        />
        
        <StatsCard
          title="Pengurus Aktif"
          value={stats.activeOfficials}
          change="+2 baru bulan ini"
          changeType="increase"
          icon={UserCheck}
          color="purple"
        />
        
        <StatsCard
          title="Pembayaran Bulan Ini"
          value={stats.totalPayments}
          change={`${stats.pendingPayments} pending`}
          changeType="neutral"
          icon={CreditCard}
          color="orange"
        />
        
        <StatsCard
          title="Pendapatan Bulan Ini"
          value={`Rp ${stats.monthlyRevenue.toLocaleString('id-ID')}`}
          change="+8% dari bulan lalu"
          changeType="increase"
          icon={TrendingUp}
          color="green"
        />
        
        <StatsCard
          title="Pembayaran Tertunda"
          value={stats.pendingPayments}
          change="Perlu tindak lanjut"
          changeType="decrease"
          icon={Calendar}
          color="red"
        />
      </div>

      {/* Member Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Anggota Aktif</p>
              <p className="text-3xl font-bold text-green-600">{stats.activeMembers}</p>
              <p className="text-sm text-green-600 mt-1">
                {stats.totalMembers > 0 
                  ? ((stats.activeMembers / stats.totalMembers) * 100).toFixed(1)
                  : 0}% dari total
              </p>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Tidak Aktif</p>
              <p className="text-3xl font-bold text-gray-600">{stats.inactiveMembers}</p>
              <p className="text-sm text-gray-600 mt-1">
                {stats.totalMembers > 0 
                  ? ((stats.inactiveMembers / stats.totalMembers) * 100).toFixed(1)
                  : 0}% dari total
              </p>
            </div>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Alumni</p>
              <p className="text-3xl font-bold text-blue-600">{stats.alumniMembers}</p>
              <p className="text-sm text-blue-600 mt-1">
                {stats.totalMembers > 0 
                  ? ((stats.alumniMembers / stats.totalMembers) * 100).toFixed(1)
                  : 0}% dari total
              </p>
            </div>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Aktivitas Terbaru</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Lihat Semua
          </button>
        </div>
        <div className="space-y-4">
          {DEMO_ACTIVITIES.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className={`w-3 h-3 rounded-full ${
                activity.type === 'member' ? 'bg-blue-500' :
                activity.type === 'payment' ? 'bg-green-500' :
                activity.type === 'official' ? 'bg-purple-500' : 
                activity.type === 'branch' ? 'bg-orange-500' : 
                activity.type === 'finance' ? 'bg-indigo-500' : 'bg-gray-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.action}</span> - {activity.name}
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                activity.type === 'member' ? 'bg-blue-100 text-blue-700' :
                activity.type === 'payment' ? 'bg-green-100 text-green-700' :
                activity.type === 'official' ? 'bg-purple-100 text-purple-700' : 
                activity.type === 'branch' ? 'bg-orange-100 text-orange-700' : 
                activity.type === 'finance' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {activity.type}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Aksi Cepat</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-6 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-blue-300 transition-all text-left group">
            <Users className="h-10 w-10 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold text-gray-900 mb-1">Tambah Anggota</h4>
            <p className="text-sm text-gray-500">Daftarkan anggota baru ke sistem</p>
          </button>
          
          <button className="p-6 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-green-300 transition-all text-left group">
            <CreditCard className="h-10 w-10 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold text-gray-900 mb-1">Catat Pembayaran</h4>
            <p className="text-sm text-gray-500">Input pembayaran iuran anggota</p>
          </button>
          
          <button className="p-6 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-orange-300 transition-all text-left group">
            <Building2 className="h-10 w-10 text-orange-600 mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold text-gray-900 mb-1">Kelola Cabang</h4>
            <p className="text-sm text-gray-500">Atur data cabang organisasi</p>
          </button>
          
          <button className="p-6 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-purple-300 transition-all text-left group">
            <TrendingUp className="h-10 w-10 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold text-gray-900 mb-1">Laporan Keuangan</h4>
            <p className="text-sm text-gray-500">Lihat laporan keuangan bulanan</p>
          </button>
        </div>
      </div>

      {/* Local Storage Info */}
      <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
        <h4 className="font-semibold mb-2">💾 Local Storage Mode</h4>
        <div className="space-y-1">
          <p>✅ Data tersimpan di browser lokal</p>
          <p>✅ Tidak memerlukan koneksi internet</p>
          <p>✅ Performa cepat dan responsif</p>
          <p>⚠️ Data akan hilang jika browser cache dibersihkan</p>
          <p>💡 Backup data secara berkala untuk keamanan</p>
        </div>
      </div>
    </div>
  );
}