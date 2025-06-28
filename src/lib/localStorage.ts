// Local Storage Service - Complete replacement for Supabase
import { v4 as uuidv4 } from 'uuid';

// Types
export interface Profile {
  id: string;
  email: string;
  nama_lengkap: string;
  foto_profil?: string;
  role: 'super_admin' | 'admin' | 'pengurus' | 'anggota';
  created_at: string;
  updated_at: string;
}

export interface Cabang {
  id: string;
  nama_cabang: string;
  kode_cabang: string;
  alamat?: string;
  kota: string;
  provinsi: string;
  koordinator_id?: string;
  jumlah_anggota?: number;
  tanggal_berdiri?: string;
  status?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: string;
  member_number: string;
  full_name: string;
  email?: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  join_date: string;
  branch_id?: string;
  status: 'aktif' | 'non_aktif' | 'alumni';
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  branch?: Cabang;
}

export interface Official {
  id: string;
  profile_id?: string;
  branch_id?: string;
  position: 'ketua_umum' | 'wakil_ketua' | 'sekretaris' | 'bendahara' | 'koordinator_cabang' | 'anggota_pengurus';
  start_date: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  profile?: Profile;
  branch?: Cabang;
}

export interface Payment {
  id: string;
  payment_number: string;
  member_id?: string;
  branch_id?: string;
  amount: number;
  payment_type: 'iuran_bulanan' | 'iuran_tahunan' | 'donasi' | 'kegiatan' | 'lainnya';
  payment_date: string;
  status: 'pending' | 'berhasil' | 'gagal';
  description?: string;
  receipt_url?: string;
  processed_by?: string;
  created_at: string;
  updated_at: string;
  member?: Member;
  branch?: Cabang;
  processor?: Profile;
}

export interface FinancialRecord {
  id: string;
  branch_id?: string;
  transaction_type: 'pemasukan' | 'pengeluaran';
  amount: number;
  description: string;
  category?: string;
  transaction_date: string;
  reference_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  branch?: Cabang;
  creator?: Profile;
}

// Local Storage Keys
const STORAGE_KEYS = {
  PROFILES: 'simor_profiles',
  BRANCHES: 'simor_branches',
  MEMBERS: 'simor_members',
  OFFICIALS: 'simor_officials',
  PAYMENTS: 'simor_payments',
  FINANCIAL_RECORDS: 'simor_financial_records',
  CURRENT_USER: 'simor_current_user',
  MEMBER_COUNTER: 'simor_member_counter',
  PAYMENT_COUNTER: 'simor_payment_counter',
  OFFICIAL_COUNTER: 'simor_official_counter',
  FINANCIAL_COUNTER: 'simor_financial_counter',
  INITIALIZED: 'simor_initialized'
};

// Utility functions
function generateId(): string {
  return uuidv4();
}

function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

function getFromStorage<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading from localStorage key ${key}:`, error);
    return [];
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage key ${key}:`, error);
  }
}

function getCounter(key: string): number {
  try {
    const counter = localStorage.getItem(key);
    return counter ? parseInt(counter, 10) : 0;
  } catch (error) {
    return 0;
  }
}

function incrementCounter(key: string): number {
  const current = getCounter(key);
  const next = current + 1;
  localStorage.setItem(key, next.toString());
  return next;
}

// Initialize default data
function initializeDefaultData(): void {
  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (isInitialized) return;

  console.log('🔄 Initializing default data...');

  // Default branches
  const defaultBranches: Cabang[] = [
    {
      id: generateId(),
      nama_cabang: 'Jakarta Pusat',
      kode_cabang: 'JKT-01',
      alamat: 'Jl. Sudirman No. 123, Menteng',
      kota: 'Jakarta',
      provinsi: 'DKI Jakarta',
      jumlah_anggota: 45,
      status: true,
      tanggal_berdiri: '2020-01-15',
      created_at: '2020-01-15T00:00:00Z',
      updated_at: getCurrentTimestamp(),
    },
    {
      id: generateId(),
      nama_cabang: 'Bandung',
      kode_cabang: 'BDG-01',
      alamat: 'Jl. Asia Afrika No. 456, Bandung Wetan',
      kota: 'Bandung',
      provinsi: 'Jawa Barat',
      jumlah_anggota: 32,
      status: true,
      tanggal_berdiri: '2020-03-10',
      created_at: '2020-03-10T00:00:00Z',
      updated_at: getCurrentTimestamp(),
    },
    {
      id: generateId(),
      nama_cabang: 'Surabaya',
      kode_cabang: 'SBY-01',
      alamat: 'Jl. Pemuda No. 789, Gubeng',
      kota: 'Surabaya',
      provinsi: 'Jawa Timur',
      jumlah_anggota: 28,
      status: true,
      tanggal_berdiri: '2020-06-20',
      created_at: '2020-06-20T00:00:00Z',
      updated_at: getCurrentTimestamp(),
    },
    {
      id: generateId(),
      nama_cabang: 'Medan',
      kode_cabang: 'MDN-01',
      alamat: 'Jl. Gatot Subroto No. 321, Medan Baru',
      kota: 'Medan',
      provinsi: 'Sumatera Utara',
      jumlah_anggota: 22,
      status: true,
      tanggal_berdiri: '2021-02-14',
      created_at: '2021-02-14T00:00:00Z',
      updated_at: getCurrentTimestamp(),
    },
  ];

  saveToStorage(STORAGE_KEYS.BRANCHES, defaultBranches);

  // Default admin profile
  const adminProfile: Profile = {
    id: 'admin-user-id',
    email: 'admin@simor.com',
    nama_lengkap: 'Administrator SIMOR',
    role: 'admin',
    created_at: getCurrentTimestamp(),
    updated_at: getCurrentTimestamp(),
  };

  saveToStorage(STORAGE_KEYS.PROFILES, [adminProfile]);

  // Default members
  const defaultMembers: Member[] = [
    {
      id: generateId(),
      member_number: 'MBR000001',
      full_name: 'Ahmad Rizki Pratama',
      email: 'ahmad.rizki@email.com',
      phone: '08123456789',
      address: 'Jl. Merdeka No. 123, Menteng, Jakarta Pusat',
      birth_date: '1990-05-15',
      join_date: '2024-01-15',
      branch_id: defaultBranches[0].id,
      status: 'aktif',
      notes: 'Anggota aktif sejak 2024, background IT',
      created_at: '2024-01-15T00:00:00Z',
      updated_at: getCurrentTimestamp(),
    },
    {
      id: generateId(),
      member_number: 'MBR000002',
      full_name: 'Siti Nurhaliza',
      email: 'siti.nur@email.com',
      phone: '08234567890',
      address: 'Jl. Pahlawan No. 456, Bandung Wetan, Bandung',
      birth_date: '1988-08-22',
      join_date: '2024-02-01',
      branch_id: defaultBranches[1].id,
      status: 'aktif',
      notes: 'Pengurus cabang Bandung, koordinator kegiatan',
      created_at: '2024-02-01T00:00:00Z',
      updated_at: getCurrentTimestamp(),
    },
    {
      id: generateId(),
      member_number: 'MBR000003',
      full_name: 'Budi Santoso',
      email: 'budi.santoso@email.com',
      phone: '08345678901',
      address: 'Jl. Kemerdekaan No. 789, Menteng, Jakarta Pusat',
      birth_date: '1985-12-10',
      join_date: '2023-06-15',
      branch_id: defaultBranches[0].id,
      status: 'alumni',
      notes: 'Alumni aktif, mentor untuk anggota baru',
      created_at: '2023-06-15T00:00:00Z',
      updated_at: getCurrentTimestamp(),
    },
    {
      id: generateId(),
      member_number: 'MBR000004',
      full_name: 'Dewi Sartika',
      email: 'dewi.sartika@email.com',
      phone: '08456789012',
      address: 'Jl. Diponegoro No. 234, Gubeng, Surabaya',
      birth_date: '1992-03-18',
      join_date: '2024-03-10',
      branch_id: defaultBranches[2].id,
      status: 'aktif',
      notes: 'Spesialis bidang keuangan',
      created_at: '2024-03-10T00:00:00Z',
      updated_at: getCurrentTimestamp(),
    },
    {
      id: generateId(),
      member_number: 'MBR000005',
      full_name: 'Andi Wijaya',
      email: 'andi.wijaya@email.com',
      phone: '08567890123',
      address: 'Jl. Imam Bonjol No. 567, Medan Baru, Medan',
      birth_date: '1987-11-25',
      join_date: '2024-01-20',
      branch_id: defaultBranches[3].id,
      status: 'aktif',
      notes: 'Koordinator wilayah Sumatera',
      created_at: '2024-01-20T00:00:00Z',
      updated_at: getCurrentTimestamp(),
    },
    {
      id: generateId(),
      member_number: 'MBR000006',
      full_name: 'Maya Sari',
      email: 'maya.sari@email.com',
      phone: '08678901234',
      address: 'Jl. Cihampelas No. 890, Bandung Wetan, Bandung',
      birth_date: '1991-07-08',
      join_date: '2023-11-05',
      branch_id: defaultBranches[1].id,
      status: 'non_aktif',
      notes: 'Sedang cuti karena tugas luar negeri',
      created_at: '2023-11-05T00:00:00Z',
      updated_at: getCurrentTimestamp(),
    },
  ];

  saveToStorage(STORAGE_KEYS.MEMBERS, defaultMembers);

  // Default payments
  const defaultPayments: Payment[] = [
    {
      id: generateId(),
      payment_number: 'PAY000001',
      member_id: defaultMembers[0].id,
      branch_id: defaultBranches[0].id,
      amount: 100000,
      payment_type: 'iuran_bulanan',
      payment_date: '2024-12-01',
      status: 'berhasil',
      description: 'Iuran bulan Desember 2024',
      processed_by: adminProfile.id,
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp(),
    },
    {
      id: generateId(),
      payment_number: 'PAY000002',
      member_id: defaultMembers[1].id,
      branch_id: defaultBranches[1].id,
      amount: 100000,
      payment_type: 'iuran_bulanan',
      payment_date: '2024-12-02',
      status: 'pending',
      description: 'Iuran bulan Desember 2024',
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp(),
    },
  ];

  saveToStorage(STORAGE_KEYS.PAYMENTS, defaultPayments);

  // Default financial records
  const defaultFinancialRecords: FinancialRecord[] = [
    {
      id: generateId(),
      branch_id: defaultBranches[0].id,
      transaction_type: 'pemasukan',
      amount: 100000,
      description: 'Iuran bulanan anggota',
      category: 'Iuran',
      transaction_date: '2024-12-01',
      reference_id: defaultPayments[0].id,
      created_by: adminProfile.id,
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp(),
    },
    {
      id: generateId(),
      branch_id: defaultBranches[0].id,
      transaction_type: 'pengeluaran',
      amount: 50000,
      description: 'Pembelian alat tulis kantor',
      category: 'Operasional',
      transaction_date: '2024-12-03',
      created_by: adminProfile.id,
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp(),
    },
  ];

  saveToStorage(STORAGE_KEYS.FINANCIAL_RECORDS, defaultFinancialRecords);

  // Default officials
  const defaultOfficials: Official[] = [
    {
      id: generateId(),
      profile_id: adminProfile.id,
      branch_id: defaultBranches[0].id,
      position: 'ketua_umum',
      start_date: '2024-01-01',
      is_active: true,
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp(),
    },
  ];

  saveToStorage(STORAGE_KEYS.OFFICIALS, defaultOfficials);

  // Set counters
  localStorage.setItem(STORAGE_KEYS.MEMBER_COUNTER, defaultMembers.length.toString());
  localStorage.setItem(STORAGE_KEYS.PAYMENT_COUNTER, defaultPayments.length.toString());
  localStorage.setItem(STORAGE_KEYS.OFFICIAL_COUNTER, defaultOfficials.length.toString());
  localStorage.setItem(STORAGE_KEYS.FINANCIAL_COUNTER, defaultFinancialRecords.length.toString());

  // Mark as initialized
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');

  console.log('✅ Default data initialized successfully');
}

// Authentication Service
export class AuthService {
  static getCurrentUser(): Profile | null {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  static async signIn(email: string, password: string): Promise<{ data: { user: Profile } | null; error: any }> {
    try {
      // Simple authentication - in real app, you'd validate against stored credentials
      if (email === 'admin@simor.com' && password === 'admin123') {
        const profiles = getFromStorage<Profile>(STORAGE_KEYS.PROFILES);
        let adminProfile = profiles.find(p => p.email === email);
        
        if (!adminProfile) {
          adminProfile = {
            id: 'admin-user-id',
            email: 'admin@simor.com',
            nama_lengkap: 'Administrator SIMOR',
            role: 'admin',
            created_at: getCurrentTimestamp(),
            updated_at: getCurrentTimestamp(),
          };
          profiles.push(adminProfile);
          saveToStorage(STORAGE_KEYS.PROFILES, profiles);
        }

        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(adminProfile));
        return { data: { user: adminProfile }, error: null };
      }

      return { data: null, error: { message: 'Invalid credentials' } };
    } catch (error) {
      return { data: null, error: { message: 'Sign in failed' } };
    }
  }

  static async signUp(email: string, password: string, fullName: string): Promise<{ data: { user: Profile } | null; error: any }> {
    try {
      const profiles = getFromStorage<Profile>(STORAGE_KEYS.PROFILES);
      
      // Check if user already exists
      if (profiles.find(p => p.email === email)) {
        return { data: null, error: { message: 'User already exists' } };
      }

      const newProfile: Profile = {
        id: generateId(),
        email,
        nama_lengkap: fullName,
        role: 'anggota',
        created_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
      };

      profiles.push(newProfile);
      saveToStorage(STORAGE_KEYS.PROFILES, profiles);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newProfile));

      return { data: { user: newProfile }, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Sign up failed' } };
    }
  }

  static async signOut(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  static async updateProfile(updates: Partial<Profile>): Promise<{ data: Profile | null; error: any }> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return { data: null, error: { message: 'No user logged in' } };
      }

      const profiles = getFromStorage<Profile>(STORAGE_KEYS.PROFILES);
      const index = profiles.findIndex(p => p.id === currentUser.id);
      
      if (index === -1) {
        return { data: null, error: { message: 'User not found' } };
      }

      const updatedProfile = {
        ...profiles[index],
        ...updates,
        updated_at: getCurrentTimestamp(),
      };

      profiles[index] = updatedProfile;
      saveToStorage(STORAGE_KEYS.PROFILES, profiles);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedProfile));

      return { data: updatedProfile, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Update profile failed' } };
    }
  }
}

// Member Service
export class MemberService {
  static async getAll(): Promise<Member[]> {
    try {
      initializeDefaultData();
      const members = getFromStorage<Member>(STORAGE_KEYS.MEMBERS);
      const branches = getFromStorage<Cabang>(STORAGE_KEYS.BRANCHES);
      
      // Attach branch data
      return members.map(member => ({
        ...member,
        branch: member.branch_id ? branches.find(b => b.id === member.branch_id) : undefined
      }));
    } catch (error) {
      console.error('Error fetching members:', error);
      return [];
    }
  }

  static async getById(id: string): Promise<Member> {
    const members = await this.getAll();
    const member = members.find(m => m.id === id);
    if (!member) throw new Error('Member not found');
    return member;
  }

  static async create(memberData: Omit<Member, 'id' | 'member_number' | 'created_at' | 'updated_at'>): Promise<Member> {
    try {
      const members = getFromStorage<Member>(STORAGE_KEYS.MEMBERS);
      const memberNumber = incrementCounter(STORAGE_KEYS.MEMBER_COUNTER);
      
      const newMember: Member = {
        id: generateId(),
        member_number: `MBR${String(memberNumber).padStart(6, '0')}`,
        ...memberData,
        created_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
      };

      members.push(newMember);
      saveToStorage(STORAGE_KEYS.MEMBERS, members);

      // Get with branch data
      const branches = getFromStorage<Cabang>(STORAGE_KEYS.BRANCHES);
      return {
        ...newMember,
        branch: newMember.branch_id ? branches.find(b => b.id === newMember.branch_id) : undefined
      };
    } catch (error) {
      console.error('Error creating member:', error);
      throw new Error('Failed to create member');
    }
  }

  static async update(id: string, memberData: Partial<Member>): Promise<Member> {
    try {
      const members = getFromStorage<Member>(STORAGE_KEYS.MEMBERS);
      const index = members.findIndex(m => m.id === id);
      
      if (index === -1) throw new Error('Member not found');

      const updatedMember = {
        ...members[index],
        ...memberData,
        updated_at: getCurrentTimestamp(),
      };

      members[index] = updatedMember;
      saveToStorage(STORAGE_KEYS.MEMBERS, members);

      // Get with branch data
      const branches = getFromStorage<Cabang>(STORAGE_KEYS.BRANCHES);
      return {
        ...updatedMember,
        branch: updatedMember.branch_id ? branches.find(b => b.id === updatedMember.branch_id) : undefined
      };
    } catch (error) {
      console.error('Error updating member:', error);
      throw new Error('Failed to update member');
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const members = getFromStorage<Member>(STORAGE_KEYS.MEMBERS);
      const filteredMembers = members.filter(m => m.id !== id);
      
      if (filteredMembers.length === members.length) {
        throw new Error('Member not found');
      }

      saveToStorage(STORAGE_KEYS.MEMBERS, filteredMembers);
      return true;
    } catch (error) {
      console.error('Error deleting member:', error);
      throw new Error('Failed to delete member');
    }
  }

  static async getByBranch(branchId: string): Promise<Member[]> {
    const members = await this.getAll();
    return members.filter(m => m.branch_id === branchId);
  }

  static async getByStatus(status: string): Promise<Member[]> {
    const members = await this.getAll();
    return members.filter(m => m.status === status);
  }
}

// Branch Service
export class BranchService {
  static async getAll(): Promise<Cabang[]> {
    try {
      initializeDefaultData();
      return getFromStorage<Cabang>(STORAGE_KEYS.BRANCHES).filter(b => b.status !== false);
    } catch (error) {
      console.error('Error fetching branches:', error);
      return [];
    }
  }

  static async getById(id: string): Promise<Cabang> {
    const branches = await this.getAll();
    const branch = branches.find(b => b.id === id);
    if (!branch) throw new Error('Branch not found');
    return branch;
  }

  static async create(branchData: Omit<Cabang, 'id' | 'created_at' | 'updated_at'>): Promise<Cabang> {
    try {
      const branches = getFromStorage<Cabang>(STORAGE_KEYS.BRANCHES);
      
      const newBranch: Cabang = {
        id: generateId(),
        ...branchData,
        created_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
      };

      branches.push(newBranch);
      saveToStorage(STORAGE_KEYS.BRANCHES, branches);
      return newBranch;
    } catch (error) {
      console.error('Error creating branch:', error);
      throw new Error('Failed to create branch');
    }
  }

  static async update(id: string, branchData: Partial<Cabang>): Promise<Cabang> {
    try {
      const branches = getFromStorage<Cabang>(STORAGE_KEYS.BRANCHES);
      const index = branches.findIndex(b => b.id === id);
      
      if (index === -1) throw new Error('Branch not found');

      const updatedBranch = {
        ...branches[index],
        ...branchData,
        updated_at: getCurrentTimestamp(),
      };

      branches[index] = updatedBranch;
      saveToStorage(STORAGE_KEYS.BRANCHES, branches);
      return updatedBranch;
    } catch (error) {
      console.error('Error updating branch:', error);
      throw new Error('Failed to update branch');
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const branches = getFromStorage<Cabang>(STORAGE_KEYS.BRANCHES);
      const index = branches.findIndex(b => b.id === id);
      
      if (index === -1) throw new Error('Branch not found');

      // Soft delete
      branches[index] = {
        ...branches[index],
        status: false,
        updated_at: getCurrentTimestamp(),
      };

      saveToStorage(STORAGE_KEYS.BRANCHES, branches);
      return true;
    } catch (error) {
      console.error('Error deleting branch:', error);
      throw new Error('Failed to delete branch');
    }
  }
}

// Dashboard Service
export class DashboardService {
  static async getStats() {
    try {
      initializeDefaultData();
      const members = getFromStorage<Member>(STORAGE_KEYS.MEMBERS);
      const branches = getFromStorage<Cabang>(STORAGE_KEYS.BRANCHES);
      const payments = getFromStorage<Payment>(STORAGE_KEYS.PAYMENTS);
      const officials = getFromStorage<Official>(STORAGE_KEYS.OFFICIALS);
      
      const activeBranches = branches.filter(b => b.status !== false).length;
      const activeMembers = members.filter(m => m.status === 'aktif').length;
      const inactiveMembers = members.filter(m => m.status === 'non_aktif').length;
      const alumniMembers = members.filter(m => m.status === 'alumni').length;
      const activeOfficials = officials.filter(o => o.is_active).length;
      
      // Calculate monthly revenue from payments
      const currentMonth = new Date().toISOString().substring(0, 7);
      const monthlyPayments = payments.filter(p => 
        p.payment_date.startsWith(currentMonth) && p.status === 'berhasil'
      );
      const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);
      const pendingPayments = payments.filter(p => p.status === 'pending').length;

      return {
        totalMembers: members.length,
        activeBranches,
        totalPayments: payments.length,
        monthlyRevenue,
        activeOfficials,
        pendingPayments,
        activeMembers,
        inactiveMembers,
        alumniMembers,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default stats on error
      return {
        totalMembers: 6,
        activeBranches: 4,
        totalPayments: 0,
        monthlyRevenue: 0,
        activeOfficials: 1,
        pendingPayments: 0,
        activeMembers: 4,
        inactiveMembers: 1,
        alumniMembers: 1,
      };
    }
  }
}

// Payment Service
export class PaymentService {
  static async getAll(): Promise<Payment[]> {
    try {
      initializeDefaultData();
      const payments = getFromStorage<Payment>(STORAGE_KEYS.PAYMENTS);
      const members = getFromStorage<Member>(STORAGE_KEYS.MEMBERS);
      const branches = getFromStorage<Cabang>(STORAGE_KEYS.BRANCHES);
      const profiles = getFromStorage<Profile>(STORAGE_KEYS.PROFILES);
      
      // Attach related data
      return payments.map(payment => ({
        ...payment,
        member: payment.member_id ? members.find(m => m.id === payment.member_id) : undefined,
        branch: payment.branch_id ? branches.find(b => b.id === payment.branch_id) : undefined,
        processor: payment.processed_by ? profiles.find(p => p.id === payment.processed_by) : undefined,
      }));
    } catch (error) {
      console.error('Error fetching payments:', error);
      return [];
    }
  }

  static async getById(id: string): Promise<Payment> {
    const payments = await this.getAll();
    const payment = payments.find(p => p.id === id);
    if (!payment) throw new Error('Payment not found');
    return payment;
  }

  static async create(paymentData: Omit<Payment, 'id' | 'payment_number' | 'created_at' | 'updated_at'>): Promise<Payment> {
    try {
      const payments = getFromStorage<Payment>(STORAGE_KEYS.PAYMENTS);
      const paymentNumber = incrementCounter(STORAGE_KEYS.PAYMENT_COUNTER);
      
      const newPayment: Payment = {
        id: generateId(),
        payment_number: `PAY${String(paymentNumber).padStart(6, '0')}`,
        ...paymentData,
        created_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
      };

      payments.push(newPayment);
      saveToStorage(STORAGE_KEYS.PAYMENTS, payments);

      // Get with related data
      const members = getFromStorage<Member>(STORAGE_KEYS.MEMBERS);
      const branches = getFromStorage<Cabang>(STORAGE_KEYS.BRANCHES);
      const profiles = getFromStorage<Profile>(STORAGE_KEYS.PROFILES);

      return {
        ...newPayment,
        member: newPayment.member_id ? members.find(m => m.id === newPayment.member_id) : undefined,
        branch: newPayment.branch_id ? branches.find(b => b.id === newPayment.branch_id) : undefined,
        processor: newPayment.processed_by ? profiles.find(p => p.id === newPayment.processed_by) : undefined,
      };
    } catch (error) {
      console.error('Error creating payment:', error);
      throw new Error('Failed to create payment');
    }
  }

  static async update(id: string, paymentData: Partial<Payment>): Promise<Payment> {
    try {
      const payments = getFromStorage<Payment>(STORAGE_KEYS.PAYMENTS);
      const index = payments.findIndex(p => p.id === id);
      
      if (index === -1) throw new Error('Payment not found');

      const updatedPayment = {
        ...payments[index],
        ...paymentData,
        updated_at: getCurrentTimestamp(),
      };

      payments[index] = updatedPayment;
      saveToStorage(STORAGE_KEYS.PAYMENTS, payments);

      // Get with related data
      const members = getFromStorage<Member>(STORAGE_KEYS.MEMBERS);
      const branches = getFromStorage<Cabang>(STORAGE_KEYS.BRANCHES);
      const profiles = getFromStorage<Profile>(STORAGE_KEYS.PROFILES);

      return {
        ...updatedPayment,
        member: updatedPayment.member_id ? members.find(m => m.id === updatedPayment.member_id) : undefined,
        branch: updatedPayment.branch_id ? branches.find(b => b.id === updatedPayment.branch_id) : undefined,
        processor: updatedPayment.processed_by ? profiles.find(p => p.id === updatedPayment.processed_by) : undefined,
      };
    } catch (error) {
      console.error('Error updating payment:', error);
      throw new Error('Failed to update payment');
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const payments = getFromStorage<Payment>(STORAGE_KEYS.PAYMENTS);
      const filteredPayments = payments.filter(p => p.id !== id);
      
      if (filteredPayments.length === payments.length) {
        throw new Error('Payment not found');
      }

      saveToStorage(STORAGE_KEYS.PAYMENTS, filteredPayments);
      return true;
    } catch (error) {
      console.error('Error deleting payment:', error);
      throw new Error('Failed to delete payment');
    }
  }
}

// Official Service
export class OfficialService {
  static async getAll(): Promise<Official[]> {
    try {
      initializeDefaultData();
      const officials = getFromStorage<Official>(STORAGE_KEYS.OFFICIALS);
      const profiles = getFromStorage<Profile>(STORAGE_KEYS.PROFILES);
      const branches = getFromStorage<Cabang>(STORAGE_KEYS.BRANCHES);
      
      // Attach related data
      return officials.map(official => ({
        ...official,
        profile: official.profile_id ? profiles.find(p => p.id === official.profile_id) : undefined,
        branch: official.branch_id ? branches.find(b => b.id === official.branch_id) : undefined,
      }));
    } catch (error) {
      console.error('Error fetching officials:', error);
      return [];
    }
  }

  static async getById(id: string): Promise<Official> {
    const officials = await this.getAll();
    const official = officials.find(o => o.id === id);
    if (!official) throw new Error('Official not found');
    return official;
  }

  static async create(officialData: Omit<Official, 'id' | 'created_at' | 'updated_at'>): Promise<Official> {
    try {
      const officials = getFromStorage<Official>(STORAGE_KEYS.OFFICIALS);
      
      const newOfficial: Official = {
        id: generateId(),
        ...officialData,
        created_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
      };

      officials.push(newOfficial);
      saveToStorage(STORAGE_KEYS.OFFICIALS, officials);

      // Get with related data
      const profiles = getFromStorage<Profile>(STORAGE_KEYS.PROFILES);
      const branches = getFromStorage<Cabang>(STORAGE_KEYS.BRANCHES);

      return {
        ...newOfficial,
        profile: newOfficial.profile_id ? profiles.find(p => p.id === newOfficial.profile_id) : undefined,
        branch: newOfficial.branch_id ? branches.find(b => b.id === newOfficial.branch_id) : undefined,
      };
    } catch (error) {
      console.error('Error creating official:', error);
      throw new Error('Failed to create official');
    }
  }

  static async update(id: string, officialData: Partial<Official>): Promise<Official> {
    try {
      const officials = getFromStorage<Official>(STORAGE_KEYS.OFFICIALS);
      const index = officials.findIndex(o => o.id === id);
      
      if (index === -1) throw new Error('Official not found');

      const updatedOfficial = {
        ...officials[index],
        ...officialData,
        updated_at: getCurrentTimestamp(),
      };

      officials[index] = updatedOfficial;
      saveToStorage(STORAGE_KEYS.OFFICIALS, officials);

      // Get with related data
      const profiles = getFromStorage<Profile>(STORAGE_KEYS.PROFILES);
      const branches = getFromStorage<Cabang>(STORAGE_KEYS.BRANCHES);

      return {
        ...updatedOfficial,
        profile: updatedOfficial.profile_id ? profiles.find(p => p.id === updatedOfficial.profile_id) : undefined,
        branch: updatedOfficial.branch_id ? branches.find(b => b.id === updatedOfficial.branch_id) : undefined,
      };
    } catch (error) {
      console.error('Error updating official:', error);
      throw new Error('Failed to update official');
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const officials = getFromStorage<Official>(STORAGE_KEYS.OFFICIALS);
      const filteredOfficials = officials.filter(o => o.id !== id);
      
      if (filteredOfficials.length === officials.length) {
        throw new Error('Official not found');
      }

      saveToStorage(STORAGE_KEYS.OFFICIALS, filteredOfficials);
      return true;
    } catch (error) {
      console.error('Error deleting official:', error);
      throw new Error('Failed to delete official');
    }
  }
}

// Financial Record Service
export class FinancialRecordService {
  static async getAll(): Promise<FinancialRecord[]> {
    try {
      initializeDefaultData();
      const records = getFromStorage<FinancialRecord>(STORAGE_KEYS.FINANCIAL_RECORDS);
      const branches = getFromStorage<Cabang>(STORAGE_KEYS.BRANCHES);
      const profiles = getFromStorage<Profile>(STORAGE_KEYS.PROFILES);
      
      // Attach related data
      return records.map(record => ({
        ...record,
        branch: record.branch_id ? branches.find(b => b.id === record.branch_id) : undefined,
        creator: record.created_by ? profiles.find(p => p.id === record.created_by) : undefined,
      }));
    } catch (error) {
      console.error('Error fetching financial records:', error);
      return [];
    }
  }

  static async getById(id: string): Promise<FinancialRecord> {
    const records = await this.getAll();
    const record = records.find(r => r.id === id);
    if (!record) throw new Error('Financial record not found');
    return record;
  }

  static async create(recordData: Omit<FinancialRecord, 'id' | 'created_at' | 'updated_at'>): Promise<FinancialRecord> {
    try {
      const records = getFromStorage<FinancialRecord>(STORAGE_KEYS.FINANCIAL_RECORDS);
      
      const newRecord: FinancialRecord = {
        id: generateId(),
        ...recordData,
        created_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp(),
      };

      records.push(newRecord);
      saveToStorage(STORAGE_KEYS.FINANCIAL_RECORDS, records);

      // Get with related data
      const branches = getFromStorage<Cabang>(STORAGE_KEYS.BRANCHES);
      const profiles = getFromStorage<Profile>(STORAGE_KEYS.PROFILES);

      return {
        ...newRecord,
        branch: newRecord.branch_id ? branches.find(b => b.id === newRecord.branch_id) : undefined,
        creator: newRecord.created_by ? profiles.find(p => p.id === newRecord.created_by) : undefined,
      };
    } catch (error) {
      console.error('Error creating financial record:', error);
      throw new Error('Failed to create financial record');
    }
  }

  static async update(id: string, recordData: Partial<FinancialRecord>): Promise<FinancialRecord> {
    try {
      const records = getFromStorage<FinancialRecord>(STORAGE_KEYS.FINANCIAL_RECORDS);
      const index = records.findIndex(r => r.id === id);
      
      if (index === -1) throw new Error('Financial record not found');

      const updatedRecord = {
        ...records[index],
        ...recordData,
        updated_at: getCurrentTimestamp(),
      };

      records[index] = updatedRecord;
      saveToStorage(STORAGE_KEYS.FINANCIAL_RECORDS, records);

      // Get with related data
      const branches = getFromStorage<Cabang>(STORAGE_KEYS.BRANCHES);
      const profiles = getFromStorage<Profile>(STORAGE_KEYS.PROFILES);

      return {
        ...updatedRecord,
        branch: updatedRecord.branch_id ? branches.find(b => b.id === updatedRecord.branch_id) : undefined,
        creator: updatedRecord.created_by ? profiles.find(p => p.id === updatedRecord.created_by) : undefined,
      };
    } catch (error) {
      console.error('Error updating financial record:', error);
      throw new Error('Failed to update financial record');
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const records = getFromStorage<FinancialRecord>(STORAGE_KEYS.FINANCIAL_RECORDS);
      const filteredRecords = records.filter(r => r.id !== id);
      
      if (filteredRecords.length === records.length) {
        throw new Error('Financial record not found');
      }

      saveToStorage(STORAGE_KEYS.FINANCIAL_RECORDS, filteredRecords);
      return true;
    } catch (error) {
      console.error('Error deleting financial record:', error);
      throw new Error('Failed to delete financial record');
    }
  }
}

// Initialize data on module load
initializeDefaultData();

console.log('✅ Local Storage service initialized');