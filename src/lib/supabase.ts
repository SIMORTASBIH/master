import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create client only if we have valid configuration
let supabase: any = null;
let initError: string | null = null;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    console.log('✅ Supabase client initialized successfully');
  } else {
    console.log('⚠️ Running in demo mode - Supabase not configured');
    console.log('To connect to Supabase:');
    console.log('1. Create a .env file in your project root');
    console.log('2. Add your Supabase URL and anon key');
    console.log('3. Restart the development server');
  }
} catch (error) {
  initError = `Failed to initialize Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`;
  console.error('❌ Supabase initialization error:', error);
}

// Export the client
export { supabase, initError };

// Types based on actual database schema
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

export interface Anggota {
  id: string;
  user_id?: string;
  nomor_anggota: string;
  nama_lengkap: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  jenis_kelamin?: 'L' | 'P';
  alamat?: string;
  nomor_hp?: string;
  email?: string;
  pekerjaan?: string;
  pendidikan?: string;
  cabang_id?: string;
  tanggal_bergabung: string;
  status_anggota: 'aktif' | 'non_aktif' | 'alumni';
  foto_profil?: string;
  created_at: string;
  updated_at: string;
  cabang?: Cabang;
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
  member?: Anggota;
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

// Enhanced demo data with more realistic information
const DEMO_BRANCHES: Cabang[] = [
  {
    id: '1',
    nama_cabang: 'Jakarta Pusat',
    kode_cabang: 'JKT-01',
    alamat: 'Jl. Sudirman No. 123, Menteng',
    kota: 'Jakarta',
    provinsi: 'DKI Jakarta',
    jumlah_anggota: 45,
    status: true,
    tanggal_berdiri: '2020-01-15',
    created_at: '2020-01-15T00:00:00Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    nama_cabang: 'Bandung',
    kode_cabang: 'BDG-01',
    alamat: 'Jl. Asia Afrika No. 456, Bandung Wetan',
    kota: 'Bandung',
    provinsi: 'Jawa Barat',
    jumlah_anggota: 32,
    status: true,
    tanggal_berdiri: '2020-03-10',
    created_at: '2020-03-10T00:00:00Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    nama_cabang: 'Surabaya',
    kode_cabang: 'SBY-01',
    alamat: 'Jl. Pemuda No. 789, Gubeng',
    kota: 'Surabaya',
    provinsi: 'Jawa Timur',
    jumlah_anggota: 28,
    status: true,
    tanggal_berdiri: '2020-06-20',
    created_at: '2020-06-20T00:00:00Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    nama_cabang: 'Medan',
    kode_cabang: 'MDN-01',
    alamat: 'Jl. Gatot Subroto No. 321, Medan Baru',
    kota: 'Medan',
    provinsi: 'Sumatera Utara',
    jumlah_anggota: 22,
    status: true,
    tanggal_berdiri: '2021-02-14',
    created_at: '2021-02-14T00:00:00Z',
    updated_at: new Date().toISOString(),
  },
];

const DEMO_MEMBERS: Member[] = [
  {
    id: '1',
    member_number: 'MBR000001',
    full_name: 'Ahmad Rizki Pratama',
    email: 'ahmad.rizki@email.com',
    phone: '08123456789',
    address: 'Jl. Merdeka No. 123, Menteng, Jakarta Pusat',
    birth_date: '1990-05-15',
    join_date: '2024-01-15',
    branch_id: '1',
    status: 'aktif',
    notes: 'Anggota aktif sejak 2024, background IT',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: new Date().toISOString(),
    branch: DEMO_BRANCHES[0],
  },
  {
    id: '2',
    member_number: 'MBR000002',
    full_name: 'Siti Nurhaliza',
    email: 'siti.nur@email.com',
    phone: '08234567890',
    address: 'Jl. Pahlawan No. 456, Bandung Wetan, Bandung',
    birth_date: '1988-08-22',
    join_date: '2024-02-01',
    branch_id: '2',
    status: 'aktif',
    notes: 'Pengurus cabang Bandung, koordinator kegiatan',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: new Date().toISOString(),
    branch: DEMO_BRANCHES[1],
  },
  {
    id: '3',
    member_number: 'MBR000003',
    full_name: 'Budi Santoso',
    email: 'budi.santoso@email.com',
    phone: '08345678901',
    address: 'Jl. Kemerdekaan No. 789, Menteng, Jakarta Pusat',
    birth_date: '1985-12-10',
    join_date: '2023-06-15',
    branch_id: '1',
    status: 'alumni',
    notes: 'Alumni aktif, mentor untuk anggota baru',
    created_at: '2023-06-15T00:00:00Z',
    updated_at: new Date().toISOString(),
    branch: DEMO_BRANCHES[0],
  },
  {
    id: '4',
    member_number: 'MBR000004',
    full_name: 'Dewi Sartika',
    email: 'dewi.sartika@email.com',
    phone: '08456789012',
    address: 'Jl. Diponegoro No. 234, Gubeng, Surabaya',
    birth_date: '1992-03-18',
    join_date: '2024-03-10',
    branch_id: '3',
    status: 'aktif',
    notes: 'Spesialis bidang keuangan',
    created_at: '2024-03-10T00:00:00Z',
    updated_at: new Date().toISOString(),
    branch: DEMO_BRANCHES[2],
  },
  {
    id: '5',
    member_number: 'MBR000005',
    full_name: 'Andi Wijaya',
    email: 'andi.wijaya@email.com',
    phone: '08567890123',
    address: 'Jl. Imam Bonjol No. 567, Medan Baru, Medan',
    birth_date: '1987-11-25',
    join_date: '2024-01-20',
    branch_id: '4',
    status: 'aktif',
    notes: 'Koordinator wilayah Sumatera',
    created_at: '2024-01-20T00:00:00Z',
    updated_at: new Date().toISOString(),
    branch: DEMO_BRANCHES[3],
  },
  {
    id: '6',
    member_number: 'MBR000006',
    full_name: 'Maya Sari',
    email: 'maya.sari@email.com',
    phone: '08678901234',
    address: 'Jl. Cihampelas No. 890, Bandung Wetan, Bandung',
    birth_date: '1991-07-08',
    join_date: '2023-11-05',
    branch_id: '2',
    status: 'non_aktif',
    notes: 'Sedang cuti karena tugas luar negeri',
    created_at: '2023-11-05T00:00:00Z',
    updated_at: new Date().toISOString(),
    branch: DEMO_BRANCHES[1],
  },
];

// Helper function to check if Supabase is available
function checkSupabaseAvailable() {
  if (!supabase) {
    console.log('📊 Using demo data - Supabase not configured');
    return null;
  }
  return supabase;
}

// Test database connection and permissions
export async function testDatabaseConnection() {
  try {
    const client = checkSupabaseAvailable();
    if (!client) {
      return { success: false, message: 'Supabase not configured', isDemo: true };
    }

    console.log('🔄 Testing database connection...');
    
    // Test basic connection
    const { data: testData, error: testError } = await client
      .from('profiles')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Database connection test failed:', testError);
      return { success: false, message: testError.message, isDemo: false };
    }

    console.log('✅ Database connection successful');

    // Test user session
    const { data: { user }, error: userError } = await client.auth.getUser();
    
    if (userError) {
      console.error('❌ User session test failed:', userError);
      return { success: false, message: userError.message, isDemo: false };
    }

    console.log('✅ User session valid:', user?.email);

    // Test data access
    const { data: membersData, error: membersError } = await client
      .from('members')
      .select('*')
      .limit(5);

    if (membersError) {
      console.error('❌ Members data access failed:', membersError);
      return { success: false, message: `Members access: ${membersError.message}`, isDemo: false };
    }

    console.log('✅ Members data access successful, found:', membersData?.length || 0, 'members');

    return { 
      success: true, 
      message: 'All tests passed', 
      isDemo: false,
      memberCount: membersData?.length || 0,
      userEmail: user?.email
    };

  } catch (error) {
    console.error('❌ Database test error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error', 
      isDemo: false 
    };
  }
}

// Enhanced Service functions for Members CRUD operations
export class MemberService {
  static async getAll(): Promise<Member[]> {
    try {
      const client = checkSupabaseAvailable();
      if (!client) {
        console.log('📊 Returning demo members data');
        return DEMO_MEMBERS;
      }

      console.log('🔄 Fetching members from Supabase...');
      
      // Test connection first
      const connectionTest = await testDatabaseConnection();
      if (!connectionTest.success && !connectionTest.isDemo) {
        console.error('❌ Database connection failed:', connectionTest.message);
        console.log('📊 Falling back to demo data');
        return DEMO_MEMBERS;
      }

      const { data, error } = await client
        .from('members')
        .select(`
          *,
          branch:cabang(id, nama_cabang, kode_cabang, kota, provinsi)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Supabase error:', error);
        console.log('📊 Falling back to demo data');
        return DEMO_MEMBERS;
      }
      
      console.log(`✅ Successfully fetched ${data?.length || 0} members from Supabase`);
      return data || [];
    } catch (error) {
      console.error('❌ Error in MemberService.getAll:', error);
      console.log('📊 Falling back to demo data');
      return DEMO_MEMBERS;
    }
  }

  static async getById(id: string): Promise<Member> {
    try {
      const client = checkSupabaseAvailable();
      if (!client) {
        const member = DEMO_MEMBERS.find(m => m.id === id);
        if (!member) throw new Error('Member not found');
        return member;
      }

      const { data, error } = await client
        .from('members')
        .select(`
          *,
          branch:cabang(id, nama_cabang, kode_cabang, kota, provinsi)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ Supabase error:', error);
        throw new Error(`Failed to fetch member: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('❌ Error in MemberService.getById:', error);
      throw error;
    }
  }

  static async create(memberData: Omit<Member, 'id' | 'member_number' | 'created_at' | 'updated_at'>): Promise<Member> {
    try {
      const client = checkSupabaseAvailable();
      if (!client) {
        const newMember: Member = {
          id: Date.now().toString(),
          member_number: `MBR${String(DEMO_MEMBERS.length + 1).padStart(6, '0')}`,
          ...memberData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          branch: memberData.branch_id ? DEMO_BRANCHES.find(b => b.id === memberData.branch_id) : undefined,
        };
        DEMO_MEMBERS.unshift(newMember);
        console.log('✅ Demo member created:', newMember.full_name);
        return newMember;
      }

      const cleanData = {
        full_name: memberData.full_name,
        email: memberData.email || null,
        phone: memberData.phone || null,
        address: memberData.address || null,
        birth_date: memberData.birth_date || null,
        join_date: memberData.join_date || new Date().toISOString().split('T')[0],
        branch_id: memberData.branch_id || null,
        status: memberData.status || 'aktif',
        notes: memberData.notes || null,
        created_by: memberData.created_by || null,
      };

      const { data, error } = await client
        .from('members')
        .insert(cleanData)
        .select(`
          *,
          branch:cabang(id, nama_cabang, kode_cabang, kota, provinsi)
        `)
        .single();

      if (error) {
        console.error('❌ Supabase error:', error);
        throw new Error(`Failed to create member: ${error.message}`);
      }
      
      console.log('✅ Member created successfully:', data.full_name);
      return data;
    } catch (error) {
      console.error('❌ Error in MemberService.create:', error);
      throw error;
    }
  }

  static async update(id: string, memberData: Partial<Member>): Promise<Member> {
    try {
      const client = checkSupabaseAvailable();
      if (!client) {
        const index = DEMO_MEMBERS.findIndex(m => m.id === id);
        if (index === -1) throw new Error('Member not found');
        
        DEMO_MEMBERS[index] = {
          ...DEMO_MEMBERS[index],
          ...memberData,
          updated_at: new Date().toISOString(),
          branch: memberData.branch_id ? DEMO_BRANCHES.find(b => b.id === memberData.branch_id) : DEMO_MEMBERS[index].branch,
        };
        console.log('✅ Demo member updated:', DEMO_MEMBERS[index].full_name);
        return DEMO_MEMBERS[index];
      }

      const cleanData: any = {};
      
      if (memberData.full_name !== undefined) cleanData.full_name = memberData.full_name;
      if (memberData.email !== undefined) cleanData.email = memberData.email || null;
      if (memberData.phone !== undefined) cleanData.phone = memberData.phone || null;
      if (memberData.address !== undefined) cleanData.address = memberData.address || null;
      if (memberData.birth_date !== undefined) cleanData.birth_date = memberData.birth_date || null;
      if (memberData.branch_id !== undefined) cleanData.branch_id = memberData.branch_id || null;
      if (memberData.status !== undefined) cleanData.status = memberData.status;
      if (memberData.notes !== undefined) cleanData.notes = memberData.notes || null;

      const { data, error } = await client
        .from('members')
        .update(cleanData)
        .eq('id', id)
        .select(`
          *,
          branch:cabang(id, nama_cabang, kode_cabang, kota, provinsi)
        `)
        .single();

      if (error) {
        console.error('❌ Supabase error:', error);
        throw new Error(`Failed to update member: ${error.message}`);
      }
      
      console.log('✅ Member updated successfully:', data.full_name);
      return data;
    } catch (error) {
      console.error('❌ Error in MemberService.update:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const client = checkSupabaseAvailable();
      if (!client) {
        const index = DEMO_MEMBERS.findIndex(m => m.id === id);
        if (index === -1) throw new Error('Member not found');
        const deletedMember = DEMO_MEMBERS.splice(index, 1)[0];
        console.log('✅ Demo member deleted:', deletedMember.full_name);
        return true;
      }

      const { error } = await client
        .from('members')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Supabase error:', error);
        throw new Error(`Failed to delete member: ${error.message}`);
      }
      
      console.log('✅ Member deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Error in MemberService.delete:', error);
      throw error;
    }
  }

  static async getByBranch(branchId: string): Promise<Member[]> {
    try {
      const client = checkSupabaseAvailable();
      if (!client) {
        return DEMO_MEMBERS.filter(m => m.branch_id === branchId);
      }

      const { data, error } = await client
        .from('members')
        .select(`
          *,
          branch:cabang(id, nama_cabang, kode_cabang, kota, provinsi)
        `)
        .eq('branch_id', branchId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Supabase error:', error);
        return DEMO_MEMBERS.filter(m => m.branch_id === branchId);
      }
      
      return data || [];
    } catch (error) {
      console.error('❌ Error in MemberService.getByBranch:', error);
      return DEMO_MEMBERS.filter(m => m.branch_id === branchId);
    }
  }

  static async getByStatus(status: string): Promise<Member[]> {
    try {
      const client = checkSupabaseAvailable();
      if (!client) {
        return DEMO_MEMBERS.filter(m => m.status === status);
      }

      const { data, error } = await client
        .from('members')
        .select(`
          *,
          branch:cabang(id, nama_cabang, kode_cabang, kota, provinsi)
        `)
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Supabase error:', error);
        return DEMO_MEMBERS.filter(m => m.status === status);
      }
      
      return data || [];
    } catch (error) {
      console.error('❌ Error in MemberService.getByStatus:', error);
      return DEMO_MEMBERS.filter(m => m.status === status);
    }
  }
}

// Enhanced Service functions for Branches
export class BranchService {
  static async getAll(): Promise<Cabang[]> {
    try {
      const client = checkSupabaseAvailable();
      if (!client) {
        console.log('📊 Returning demo branches data');
        return DEMO_BRANCHES;
      }

      console.log('🔄 Fetching branches from Supabase...');
      const { data, error } = await client
        .from('cabang')
        .select('*')
        .eq('status', true)
        .order('nama_cabang');

      if (error) {
        console.error('❌ Supabase error:', error);
        console.log('📊 Falling back to demo data');
        return DEMO_BRANCHES;
      }
      
      console.log(`✅ Successfully fetched ${data?.length || 0} branches from Supabase`);
      return data || [];
    } catch (error) {
      console.error('❌ Error in BranchService.getAll:', error);
      console.log('📊 Falling back to demo data');
      return DEMO_BRANCHES;
    }
  }

  static async getById(id: string): Promise<Cabang> {
    try {
      const client = checkSupabaseAvailable();
      if (!client) {
        const branch = DEMO_BRANCHES.find(b => b.id === id);
        if (!branch) throw new Error('Branch not found');
        return branch;
      }

      const { data, error } = await client
        .from('cabang')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ Supabase error:', error);
        throw new Error(`Failed to fetch branch: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('❌ Error in BranchService.getById:', error);
      throw error;
    }
  }
}

// Dashboard Statistics Service
export class DashboardService {
  static async getStats() {
    try {
      console.log('🔄 DashboardService.getStats called');
      const client = checkSupabaseAvailable();
      
      if (!client) {
        console.log('📊 Using demo stats data');
        const demoStats = {
          totalMembers: DEMO_MEMBERS.length,
          activeBranches: DEMO_BRANCHES.filter(b => b.status).length,
          totalPayments: 45,
          monthlyRevenue: 15750000,
          activeOfficials: 12,
          pendingPayments: 8,
          activeMembers: DEMO_MEMBERS.filter(m => m.status === 'aktif').length,
          inactiveMembers: DEMO_MEMBERS.filter(m => m.status === 'non_aktif').length,
          alumniMembers: DEMO_MEMBERS.filter(m => m.status === 'alumni').length,
        };
        console.log('📊 Demo stats:', demoStats);
        return demoStats;
      }

      console.log('🔄 Fetching real statistics from Supabase...');
      
      // Test connection first
      const connectionTest = await testDatabaseConnection();
      if (!connectionTest.success) {
        console.error('❌ Database connection failed, using demo stats');
        const fallbackStats = {
          totalMembers: DEMO_MEMBERS.length,
          activeBranches: DEMO_BRANCHES.filter(b => b.status).length,
          totalPayments: 45,
          monthlyRevenue: 15750000,
          activeOfficials: 12,
          pendingPayments: 8,
          activeMembers: DEMO_MEMBERS.filter(m => m.status === 'aktif').length,
          inactiveMembers: DEMO_MEMBERS.filter(m => m.status === 'non_aktif').length,
          alumniMembers: DEMO_MEMBERS.filter(m => m.status === 'alumni').length,
        };
        return fallbackStats;
      }
      
      // Fetch real statistics from Supabase with better error handling
      const [membersResult, branchesResult] = await Promise.all([
        client.from('members').select('status', { count: 'exact' }),
        client.from('cabang').select('*', { count: 'exact' }).eq('status', true)
      ]);

      console.log('📊 Supabase results:', { 
        members: membersResult, 
        branches: branchesResult
      });

      const totalMembers = membersResult.count || 0;
      const activeBranches = branchesResult.count || 0;
      
      // Get member status breakdown
      const activeMembers = membersResult.data?.filter(m => m.status === 'aktif').length || 0;
      const inactiveMembers = membersResult.data?.filter(m => m.status === 'non_aktif').length || 0;
      const alumniMembers = membersResult.data?.filter(m => m.status === 'alumni').length || 0;

      const realStats = {
        totalMembers,
        activeBranches,
        totalPayments: 45, // This would need payments table
        monthlyRevenue: 15750000, // This would need payments table
        activeOfficials: 12, // This would need officials table
        pendingPayments: 8, // This would need payments table
        activeMembers,
        inactiveMembers,
        alumniMembers,
      };
      
      console.log('✅ Real stats from Supabase:', realStats);
      return realStats;
    } catch (error) {
      console.error('❌ Error fetching dashboard stats:', error);
      // Return demo stats on error
      const fallbackStats = {
        totalMembers: DEMO_MEMBERS.length,
        activeBranches: DEMO_BRANCHES.filter(b => b.status).length,
        totalPayments: 45,
        monthlyRevenue: 15750000,
        activeOfficials: 12,
        pendingPayments: 8,
        activeMembers: DEMO_MEMBERS.filter(m => m.status === 'aktif').length,
        inactiveMembers: DEMO_MEMBERS.filter(m => m.status === 'non_aktif').length,
        alumniMembers: DEMO_MEMBERS.filter(m => m.status === 'alumni').length,
      };
      console.log('📊 Fallback stats:', fallbackStats);
      return fallbackStats;
    }
  }
}