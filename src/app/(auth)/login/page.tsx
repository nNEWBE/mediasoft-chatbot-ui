'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { LogIn, Key, Mail, ShieldCheck, Eye, EyeOff, Loader2 } from 'lucide-react';
import api from '@/utils/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';
import { BackgroundBeams } from '@/components/ui/background-beams';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const loginPromise = async () => {
      const { data } = await api.post('/auth/login', formData);
      const { user, accessToken, refreshToken } = data.data;
      setAuth(user, accessToken, refreshToken);
      return data;
    };

    toast.promise(loginPromise(), {
      loading: 'Authenticating credentials...',
      success: (data) => {
        sessionStorage.setItem('showWelcomeModal', 'true');
        router.push('/dashboard');
        return (
          <div className="flex flex-col gap-0.5 font-outfit">
            <span className="font-bold text-white tracking-wide font-space text-sm">Access Granted</span>
            <span className="text-[10px] text-white/50 font-normal uppercase tracking-widest">
              Welcome back, {data?.data?.user?.name || 'Member'}!
            </span>
          </div>
        );
      },
      error: (err) => {
        setLoading(false);
        const msg = err.response?.data?.message || 'Authentication failed';
        return (
          <div className="flex flex-col gap-0.5 font-outfit">
            <span className="font-bold text-red-400 tracking-wide font-space text-sm">Security Error</span>
            <span className="text-[10px] text-red-500/60 font-normal uppercase tracking-widest">
              {msg}
            </span>
          </div>
        );
      },
      finally: () => {
        setLoading(false);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6 font-outfit overflow-hidden">
      <BackgroundBeams interactive={false} />

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
            <label className="text-[10px] font-bold text-white/40 tracking-widest uppercase ml-1 font-space">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white opacity-20 group-focus-within:opacity-100 group-focus-within:text-brand-primary transition-all z-10" />
              <Input
                type="email"
                required
                className="w-full bg-white/5 border-white/5 rounded-xl pl-11 pr-4 py-3.5 focus:border-brand-primary/30 transition-all placeholder:text-white/10 text-sm"
                placeholder="you@mediasoftbd.com"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 tracking-widest uppercase ml-1 font-space">Password</label>
            <div className="relative group">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white opacity-20 group-focus-within:opacity-100 group-focus-within:text-brand-primary transition-all z-10" />
              <Input
                type={showPassword ? "text" : "password"}
                required
                className="w-full bg-white/5 border-white/5 rounded-xl pl-11 pr-11 py-3.5 focus:border-brand-primary/30 transition-all placeholder:text-white/10 text-sm"
                placeholder="••••••••"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors z-20 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary h-11 rounded-xl text-black font-bold flex items-center justify-center gap-2 hover:bg-white/90 transition-all active:scale-[0.98] mt-4 disabled:opacity-50 border-none text-xs cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Sign In
                <ShieldCheck className="w-4 h-4" />
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
