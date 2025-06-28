# SIMOR MDTI - Sistem Manajemen Organisasi

A comprehensive organization management system built with React, TypeScript, and Supabase.

## Features

- 👥 **Member Management** - Complete member registration and management
- 🏢 **Branch Management** - Multi-branch organization support
- 💰 **Payment Tracking** - Payment and financial record management
- 👨‍💼 **Official Management** - Organization official position management
- 📊 **Dashboard Analytics** - Real-time statistics and insights
- 🔐 **Role-based Access Control** - Secure access based on user roles
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Icons**: Lucide React
- **Build Tool**: Vite

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd simor-mdti-dashboard
npm install
```

### 2. Environment Setup

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the migration file in your Supabase SQL editor:
   ```sql
   -- Copy and paste the content from supabase/migrations/20250628074933_late_mode.sql
   ```
3. Get your project URL and anon key from Settings > API
4. Add them to your `.env` file

### 4. Run the Application

```bash
npm run dev
```

The application will start at `http://localhost:5173`

## Demo Mode

If Supabase is not configured, the application runs in demo mode with sample data.

**Demo Credentials:**
- Email: `demo@example.com`
- Password: `password123`

## Database Schema

The application uses the following main tables:

- `profiles` - User profiles and authentication
- `cabang` - Organization branches
- `members` - Member management
- `officials` - Official positions
- `payments` - Payment tracking
- `financial_records` - Financial transactions

## User Roles

- **Super Admin** - Full system access
- **Admin** - Organization-wide management
- **Pengurus** - Branch-level management
- **Anggota** - Basic member access

## Key Features

### Member Management
- Auto-generated member numbers
- Complete member profiles
- Status tracking (Active, Inactive, Alumni)
- Branch assignment
- Search and filtering

### Dashboard Analytics
- Real-time member statistics
- Payment tracking
- Branch performance
- Recent activity feed

### Payment System
- Auto-generated payment numbers
- Multiple payment types
- Status tracking
- Receipt management

### Security
- Row Level Security (RLS)
- Role-based access control
- Secure authentication
- Data validation

## Development

### Project Structure

```
src/
├── components/          # React components
│   ├── Auth/           # Authentication components
│   ├── Dashboard/      # Dashboard components
│   ├── Layout/         # Layout components
│   └── Members/        # Member management components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── lib/                # Utilities and services
└── types/              # TypeScript types
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

The application can be deployed to any static hosting service:

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Set environment variables in your hosting platform

### Netlify Deployment

The project includes Netlify configuration. Simply connect your repository to Netlify and it will deploy automatically.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support and questions:
- Check the documentation
- Review the demo mode for examples
- Ensure Supabase is properly configured

## License

This project is licensed under the MIT License.