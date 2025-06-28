import React, { useState } from 'react';
import { Building2, Eye, EyeOff, AlertCircle, Database } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [fullName, setFullName] = useState('');
  const [formError, setFormError] = useState('');
  const { signIn, signUp, loading, error: authError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Basic validation
    if (!email || !password) {
      setFormError('Email dan password wajib diisi');
      return;
    }

    if (isRegistering && !fullName) {
      setFormError('Nama lengkap wajib diisi');
      return;
    }

    if (password.length < 6) {
      setFormError('Password minimal 6 karakter');
      return;
    }

    try {
      let result;
      if (isRegistering) {
        result = await signUp(email, password, fullName);
      } else {
        result = await signIn(email, password);
      }

      if (result.error) {
        setFormError(result.error.message);
      }
    } catch (err) {
      setFormError('Terjadi kesalahan yang tidak terduga');
      console.error('Auth error:', err);
    }
  };

  const handleDemoLogin = () => {
    setEmail('admin@simor.com');
    setPassword('admin123');
    setIsRegistering(false);
    setFormError('');
  };

  const displayError = formError || authError;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">SIMOR MDTI</h1>
            <p className="text-gray-600 mt-1">Sistem Manajemen Organisasi</p>
          </div>

          {/* Local Storage Status */}
          <div className="mb-6 p-4 rounded-lg border bg-green-50 border-green-200">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-green-600" />
              <span className="text-green-700 font-medium text-sm">Local Storage Mode</span>
            </div>
            <p className="text-green-600 text-sm mt-1">
              Data tersimpan secara lokal di browser Anda
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {displayError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{displayError}</span>
              </div>
            )}

            {isRegistering && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Masukkan nama lengkap"
                  disabled={loading}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="admin@simor.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="admin123"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{loading ? 'Processing...' : (isRegistering ? 'Daftar' : 'Masuk')}</span>
            </button>
          </form>

          {/* Demo Login */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-3 font-medium">Demo Credentials:</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="font-mono text-gray-700">admin@simor.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Password:</span>
                <span className="font-mono text-gray-700">admin123</span>
              </div>
            </div>
            <button
              onClick={handleDemoLogin}
              className="mt-3 w-full text-blue-600 hover:text-blue-700 text-sm font-medium py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
              disabled={loading}
            >
              Use Demo Credentials
            </button>
          </div>

          {/* Toggle Form */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setFormError('');
                setFullName('');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              disabled={loading}
            >
              {isRegistering ? 'Sudah punya akun? Masuk di sini' : 'Belum punya akun? Daftar di sini'}
            </button>
          </div>

          {/* Local Storage Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">💾 Local Storage Mode</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p>✅ Data tersimpan di browser lokal</p>
              <p>✅ Tidak memerlukan koneksi internet</p>
              <p>⚠️ Data akan hilang jika cache dibersihkan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}