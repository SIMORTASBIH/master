import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  UserCheck, 
  CreditCard, 
  TrendingUp,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  FileText,
  Database,
  BarChart3,
  Tag,
  Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

interface NavigationItem {
  name: string;
  key: string;
  icon: React.ComponentType<any>;
  children?: NavigationItem[];
}

const navigation: NavigationItem[] = [
  { 
    name: 'Dashboard', 
    key: 'dashboard', 
    icon: LayoutDashboard 
  },
  {
    name: 'Master Data',
    key: 'master-data',
    icon: Database,
    children: [
      { name: 'Anggota', key: 'members', icon: Users },
      { name: 'Cabang', key: 'branches', icon: Building2 },
      { name: 'Pengurus', key: 'officials', icon: UserCheck },
    ]
  },
  {
    name: 'Transaksi',
    key: 'transaksi',
    icon: CreditCard,
    children: [
      { name: 'Pembayaran', key: 'payments', icon: CreditCard },
      { name: 'Keuangan', key: 'finance', icon: TrendingUp },
    ]
  },
  {
    name: 'Laporan',
    key: 'laporan',
    icon: BarChart3,
    children: [
      { name: 'Laporan Anggota', key: 'reports-members', icon: FileText },
      { name: 'Laporan Keuangan', key: 'reports-finance', icon: TrendingUp },
      { name: 'Laporan Kegiatan', key: 'reports-activities', icon: BarChart3 },
    ]
  },
  {
    name: 'Pengaturan',
    key: 'pengaturan',
    icon: Settings,
    children: [
      { name: 'Kategori', key: 'categories', icon: Tag },
      { name: 'Pengguna dan Peran Akses', key: 'users-roles', icon: Shield },
      { name: 'Pengaturan Sistem', key: 'system-settings', icon: Settings },
    ]
  },
];

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const { profile, signOut } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>(['master-data', 'transaksi']);

  const toggleExpanded = (key: string) => {
    setExpandedItems(prev => 
      prev.includes(key) 
        ? prev.filter(item => item !== key)
        : [...prev, key]
    );
  };

  const isItemActive = (item: NavigationItem): boolean => {
    if (item.key === currentPage) return true;
    if (item.children) {
      return item.children.some(child => child.key === currentPage);
    }
    return false;
  };

  const isChildActive = (childKey: string): boolean => {
    return currentPage === childKey;
  };

  const handleItemClick = (item: NavigationItem) => {
    if (item.children) {
      toggleExpanded(item.key);
    } else {
      onPageChange(item.key);
    }
  };

  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.key);
    const isActive = isItemActive(item);
    const isChild = level > 0;

    return (
      <div key={item.key}>
        <button
          onClick={() => handleItemClick(item)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
            isChild ? 'ml-4 pl-8' : ''
          } ${
            isActive && !hasChildren
              ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
              : isActive && hasChildren
              ? 'bg-gray-50 text-gray-900'
              : isChild && isChildActive(item.key)
              ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-3">
            <item.icon className={`h-5 w-5 ${
              isActive && !hasChildren
                ? 'text-blue-700'
                : isChild && isChildActive(item.key)
                ? 'text-blue-700'
                : isActive && hasChildren
                ? 'text-gray-700'
                : 'text-gray-400 group-hover:text-gray-600'
            }`} />
            <span className={`font-medium ${
              isChild ? 'text-sm' : ''
            }`}>
              {item.name}
            </span>
          </div>
          {hasChildren && (
            <div className="flex-shrink-0">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
            </div>
          )}
        </button>
        
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderNavigationItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white shadow-lg h-full flex flex-col">
      {/* Logo and Title */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">SIMOR</h1>
            <p className="text-sm text-gray-500">MDTI Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation.map(item => renderNavigationItem(item))}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {profile?.nama_lengkap?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {profile?.nama_lengkap}
            </p>
            <p className="text-xs text-gray-500 capitalize">{profile?.role}</p>
          </div>
        </div>
        
        <div className="space-y-1">
          <button
            onClick={() => onPageChange('profile-settings')}
            className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span className="text-sm">Profil Saya</span>
          </button>
          
          <button
            onClick={signOut}
            className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}