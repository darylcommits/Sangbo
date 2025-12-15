# SANGBO BERDE - Database Setup

## 🚨 Current Error: "relation 'routes' does not exist"

This error occurs because the database tables haven't been created in your Supabase project yet.

## 🔧 Quick Fix - Create Database Schema

### Step 1: Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)

### Step 2: Run the Complete Schema
Copy and paste this entire SQL script into the SQL Editor and run it:

```sql
-- Enable RLS on auth.users (already enabled by default)
-- Note: RLS is already enabled on auth.users by default

-- User profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'supervisor', 'collector', 'facility_staff', 'citizen')),
  phone TEXT,
  barangay TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Routes table
CREATE TABLE IF NOT EXISTS routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  barangay TEXT NOT NULL,
  description TEXT,
  start_location_lat DECIMAL,
  start_location_lng DECIMAL,
  end_location_lat DECIMAL,
  end_location_lng DECIMAL,
  estimated_duration INTEGER, -- in minutes
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID REFERENCES profiles(id) NOT NULL,
  check_in TIMESTAMP WITH TIME ZONE NOT NULL,
  check_out TIMESTAMP WITH TIME ZONE,
  location_lat DECIMAL,
  location_lng DECIMAL,
  status TEXT CHECK (status IN ('present', 'late', 'absent')) DEFAULT 'present',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task assignments table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES profiles(id),
  assigned_by UUID REFERENCES profiles(id),
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  due_date TIMESTAMP WITH TIME ZONE,
  route_id UUID REFERENCES routes(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Waste collection logs
CREATE TABLE IF NOT EXISTS collection_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  collector_id UUID REFERENCES profiles(id) NOT NULL,
  route_id UUID REFERENCES routes(id),
  collection_date TIMESTAMP WITH TIME ZONE NOT NULL,
  waste_type TEXT CHECK (waste_type IN ('biodegradable', 'non_biodegradable', 'recyclable', 'hazardous')) NOT NULL,
  weight_kg DECIMAL,
  location_lat DECIMAL,
  location_lng DECIMAL,
  notes TEXT,
  photos TEXT[], -- Array of photo URLs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compost facility operations
CREATE TABLE IF NOT EXISTS compost_operations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID REFERENCES profiles(id) NOT NULL,
  operation_type TEXT CHECK (operation_type IN ('segregation', 'fermentation', 'curing', 'packaging', 'quality_check')) NOT NULL,
  input_weight_kg DECIMAL,
  output_weight_kg DECIMAL,
  temperature DECIMAL,
  humidity DECIMAL,
  ph_level DECIMAL,
  notes TEXT,
  photos TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Citizen reports
CREATE TABLE IF NOT EXISTS citizen_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id),
  report_type TEXT CHECK (report_type IN ('missed_collection', 'illegal_dumping', 'overflow_bin', 'environmental_complaint', 'other')) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location_lat DECIMAL,
  location_lng DECIMAL,
  address TEXT,
  status TEXT CHECK (status IN ('pending', 'assigned', 'in_progress', 'resolved', 'closed')) DEFAULT 'pending',
  assigned_to UUID REFERENCES profiles(id),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  photos TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('task_assignment', 'alert', 'reminder', 'report_update', 'system')) NOT NULL,
  is_read BOOLEAN DEFAULT false,
  related_id UUID, -- Can reference tasks, reports, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Waste segregation schedules
CREATE TABLE IF NOT EXISTS waste_segregation_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  waste_type TEXT CHECK (waste_type IN ('biodegradable', 'non_biodegradable', 'recyclable', 'hazardous', 'plastics', 'metals', 'paper', 'glass', 'electronics')) NOT NULL,
  schedule_date TIMESTAMP WITH TIME ZONE NOT NULL,
  frequency TEXT CHECK (frequency IN ('one_time', 'daily', 'weekly', 'monthly')) DEFAULT 'one_time',
  end_date TIMESTAMP WITH TIME ZONE,
  assigned_staff UUID REFERENCES profiles(id),
  route_id UUID REFERENCES routes(id),
  barangay TEXT,
  status TEXT CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')) DEFAULT 'scheduled',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sustainability metrics
CREATE TABLE IF NOT EXISTS sustainability_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  waste_collected_kg DECIMAL DEFAULT 0,
  waste_composted_kg DECIMAL DEFAULT 0,
  compost_produced_kg DECIMAL DEFAULT 0,
  co2_reduction_kg DECIMAL DEFAULT 0,
  landfill_diversion_percentage DECIMAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Attendance policies
CREATE POLICY "Staff can view their own attendance" ON attendance
  FOR SELECT USING (auth.uid() = staff_id OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'supervisor')));

CREATE POLICY "Staff can create their own attendance" ON attendance
  FOR INSERT WITH CHECK (auth.uid() = staff_id);

-- Tasks policies
CREATE POLICY "Users can view assigned tasks" ON tasks
  FOR SELECT USING (auth.uid() = assigned_to OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'supervisor')));

-- Citizen reports policies
CREATE POLICY "Citizens can create reports" ON citizen_reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports" ON citizen_reports
  FOR SELECT USING (auth.uid() = reporter_id OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'supervisor')));

-- Waste segregation schedules policies
CREATE POLICY "Staff can view assigned schedules" ON waste_segregation_schedules
  FOR SELECT USING (auth.uid() = assigned_staff OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'supervisor')));

CREATE POLICY "Admins can create schedules" ON waste_segregation_schedules
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'supervisor')));

CREATE POLICY "Admins can update schedules" ON waste_segregation_schedules
  FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'supervisor')));

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);
```

### Step 3: Verify Tables Created
After running the SQL, check the **Table Editor** to confirm all tables are created:
- profiles
- routes
- attendance
- tasks
- collection_logs
- compost_operations
- citizen_reports
- notifications
- waste_segregation_schedules
- sustainability_metrics

## 🎯 Next Steps

1. **Set up environment variables** in `.env` file
2. **Test the application** - the error should be resolved
3. **Create your first user account** through the signup form

## 🚨 If You Still Get Errors

Make sure you:
1. ✅ Have a Supabase project created
2. ✅ Added your credentials to `.env` file
3. ✅ Ran the complete SQL schema
4. ✅ Restarted your development server

---

**Once the database is set up, your SANGBO BERDE application will be fully functional! 🌱**
