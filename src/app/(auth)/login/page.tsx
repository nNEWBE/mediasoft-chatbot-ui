'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { LogIn, Key, Mail, ArrowRight, Loader2 } from 'lucide-react';
import api from '@/utils/axios';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', formData);
      const { user, accessToken, refreshToken } = data.data;
      setAuth(user, accessToken, refreshToken);
      toast.success('Successfully logged in!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6 font-outfit">
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
            <LogIn size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-2 font-space">Welcome Back</h2>
          <p className="text-white/40 text-sm">Secure access to your Mediasoft Assistant</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/60 tracking-wider uppercase ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-primary transition-colors z-10" />
              <Input
                type="email"
                required
                className="w-full bg-black/40 border-white/10 rounded-xl pl-12 pr-4 py-6 focus:border-brand-primary/50 transition-all placeholder:text-white/10"
                placeholder="you@mediasoftbd.com"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/60 tracking-wider uppercase ml-1">Password</label>
            <div className="relative group">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-primary transition-colors z-10" />
              <Input
                type="password"
                required
                className="w-full bg-black/40 border-white/10 rounded-xl pl-12 pr-4 py-6 focus:border-brand-primary/50 transition-all placeholder:text-white/10"
                placeholder="••••••••"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-brand-primary to-brand-secondary h-14 rounded-xl text-black font-bold flex items-center justify-center gap-2 hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgb(79,172,254,0.3)] transition-all active:scale-[0.98] mt-4 disabled:opacity-50 disabled:translate-y-0 border-none"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-white/30 text-sm">
            New to Mediasoft AI?{' '}
            <Link href="/register" className="text-brand-primary hover:underline transition-all font-semibold">Create Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
