/*
  # SIMOR MDTI Database Schema Extension

  1. New Tables
    - `members` - Member management with auto-generated member numbers
    - `officials` - Official positions management  
    - `payments` - Payment tracking with auto-generated payment numbers
    - `financial_records` - Financial transaction records

  2. Security
    - Enable RLS on all new tables
    - Add policies for role-based access control
    - Use existing has_role() function for authorization

  3. Features
    - Auto-generated member and payment numbers
    - Automatic timestamp updates
    - Proper indexing for performance
    - Integration with existing schema
*/

-- Create missing tables that don't exist in current schema

-- Members table (maps to existing anggota table structure)
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_number text UNIQUE NOT NULL,
  full_name text NOT NULL,
  email text,
  phone text,
  address text,
  birth_date date,
  join_date date DEFAULT CURRENT_DATE,
  branch_id uuid REFERENCES cabang(id),
  status status_anggota DEFAULT 'aktif',
  notes text,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Officials table (maps to existing pengurus table structure)
CREATE TABLE IF NOT EXISTS officials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  branch_id uuid REFERENCES cabang(id),
  position jabatan_pengurus NOT NULL,
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payments table (maps to existing pembayaran table structure)
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_number text UNIQUE NOT NULL,
  member_id uuid REFERENCES anggota(id),
  branch_id uuid REFERENCES cabang(id),
  amount decimal(15,2) NOT NULL,
  payment_type jenis_pembayaran NOT NULL,
  payment_date date DEFAULT CURRENT_DATE,
  status status_pembayaran DEFAULT 'pending',
  description text,
  receipt_url text,
  processed_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Financial records table (maps to existing keuangan table structure)
CREATE TABLE IF NOT EXISTS financial_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id uuid REFERENCES cabang(id),
  transaction_type jenis_transaksi NOT NULL,
  amount decimal(15,2) NOT NULL,
  description text NOT NULL,
  category text,
  transaction_date date DEFAULT CURRENT_DATE,
  reference_id uuid, -- Can reference payments or other records
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE officials ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "All authenticated users can read members" ON members;
DROP POLICY IF EXISTS "Admins and pengurus can modify members" ON members;
DROP POLICY IF EXISTS "All authenticated users can read officials" ON officials;
DROP POLICY IF EXISTS "Admins can modify officials" ON officials;
DROP POLICY IF EXISTS "All authenticated users can read payments" ON payments;
DROP POLICY IF EXISTS "Admins and pengurus can modify payments" ON payments;
DROP POLICY IF EXISTS "All authenticated users can read financial records" ON financial_records;
DROP POLICY IF EXISTS "Admins and pengurus can modify financial records" ON financial_records;

-- RLS Policies for members
CREATE POLICY "All authenticated users can read members"
  ON members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and pengurus can modify members"
  ON members FOR ALL
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'super_admin'::app_role) OR 
    has_role(auth.uid(), 'pengurus'::app_role)
  );

-- RLS Policies for officials
CREATE POLICY "All authenticated users can read officials"
  ON officials FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can modify officials"
  ON officials FOR ALL
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'super_admin'::app_role)
  );

-- RLS Policies for payments
CREATE POLICY "All authenticated users can read payments"
  ON payments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and pengurus can modify payments"
  ON payments FOR ALL
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'super_admin'::app_role) OR 
    has_role(auth.uid(), 'pengurus'::app_role)
  );

-- RLS Policies for financial records
CREATE POLICY "All authenticated users can read financial records"
  ON financial_records FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and pengurus can modify financial records"
  ON financial_records FOR ALL
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'super_admin'::app_role) OR 
    has_role(auth.uid(), 'pengurus'::app_role)
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_members_branch ON members(branch_id);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_members_member_number ON members(member_number);
CREATE INDEX IF NOT EXISTS idx_officials_branch ON officials(branch_id);
CREATE INDEX IF NOT EXISTS idx_officials_profile ON officials(profile_id);
CREATE INDEX IF NOT EXISTS idx_payments_member ON payments(member_id);
CREATE INDEX IF NOT EXISTS idx_payments_branch ON payments(branch_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_financial_branch ON financial_records(branch_id);
CREATE INDEX IF NOT EXISTS idx_financial_date ON financial_records(transaction_date);

-- Functions for auto-generating numbers
CREATE OR REPLACE FUNCTION generate_member_number()
RETURNS text AS $$
DECLARE
  next_num integer;
  new_number text;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(member_number FROM 4) AS integer)), 0) + 1
  INTO next_num
  FROM members
  WHERE member_number ~ '^MBR[0-9]+$';
  
  new_number := 'MBR' || LPAD(next_num::text, 6, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_payment_number()
RETURNS text AS $$
DECLARE
  next_num integer;
  new_number text;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(payment_number FROM 4) AS integer)), 0) + 1
  INTO next_num
  FROM payments
  WHERE payment_number ~ '^PAY[0-9]+$';
  
  new_number := 'PAY' || LPAD(next_num::text, 8, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-generating numbers
CREATE OR REPLACE FUNCTION auto_generate_member_number()
RETURNS trigger AS $$
BEGIN
  IF NEW.member_number IS NULL OR NEW.member_number = '' THEN
    NEW.member_number := generate_member_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION auto_generate_payment_number()
RETURNS trigger AS $$
BEGIN
  IF NEW.payment_number IS NULL OR NEW.payment_number = '' THEN
    NEW.payment_number := generate_payment_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS trigger_auto_member_number ON members;
DROP TRIGGER IF EXISTS trigger_auto_payment_number ON payments;

CREATE TRIGGER trigger_auto_member_number
  BEFORE INSERT ON members
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_member_number();

CREATE TRIGGER trigger_auto_payment_number
  BEFORE INSERT ON payments
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_payment_number();

-- Drop existing update triggers if they exist
DROP TRIGGER IF EXISTS handle_updated_at ON members;
DROP TRIGGER IF EXISTS handle_updated_at ON officials;
DROP TRIGGER IF EXISTS handle_updated_at ON payments;
DROP TRIGGER IF EXISTS handle_updated_at ON financial_records;

-- Create update timestamp triggers using existing handle_updated_at function
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON officials
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON financial_records
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();