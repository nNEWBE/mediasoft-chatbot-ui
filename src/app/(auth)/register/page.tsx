'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserPlus, User, Key, Mail, ArrowRight, Loader2 } from 'lucide-react';
import api from '@/utils/axios';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      toast.success('Account created! Please login.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6">
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-brand-primary opacity-5 blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-brand-secondary opacity-5 blur-[150px]" />

      <motion.div
       initial={{ opacity: 0, scale: 0.9 }}
       animate={{ opacity: 1, scale: 1 }}
       transition={{ duration: 0.5 }}
       className="w-full max-w-md glass-effect p-8 rounded-3xl border border-white/5 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-primary/10 text-brand-primary mb-6">
            <UserPlus size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Create Account</h2>
          <p className="text-white/40 text-sm">Join the future of business intelligence</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/60 tracking-wider uppercase ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-primary transition-colors" />
              <input
                type="text"
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-12 py-3.5 focus:outline-none focus:border-brand-primary/50 transition-all placeholder:text-white/10"
                placeholder="John Doe"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/60 tracking-wider uppercase ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-primary transition-colors" />
              <input
                type="email"
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-12 py-3.5 focus:outline-none focus:border-brand-primary/50 transition-all placeholder:text-white/10"
                placeholder="you@company.com"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/60 tracking-wider uppercase ml-1">Password</label>
            <div className="relative group">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-primary transition-colors" />
              <input
                type="password"
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-12 py-3.5 focus:outline-none focus:border-brand-primary/50 transition-all placeholder:text-white/10"
                placeholder="••••••••"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary py-4 rounded-xl text-black font-bold flex items-center justify-center gap-2 hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgb(79,172,254,0.3)] transition-all active:scale-[0.98] mt-4 disabled:opacity-50 disabled:translate-y-0"
          >
           {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Register Now
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <p className="text-white/30">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-primary hover:underline transition-all">Sign In Here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
