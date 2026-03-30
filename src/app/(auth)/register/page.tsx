'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { UserPlus, User, Key, Mail, UserCheck, Eye, EyeOff, Loader2 } from 'lucide-react';
import api from '@/utils/axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BackgroundBeams } from '@/components/ui/background-beams';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const registerPromise = async () => {
      const { data } = await api.post('/users/create-user', formData);
      return data;
    };

    toast.promise(registerPromise(), {
      loading: 'Initializing your account...',
      success: () => {
        router.push('/login');
        return (
          <div className="flex flex-col gap-0.5 font-outfit">
            <span className="font-bold text-white tracking-wide font-space text-sm">Account Created</span>
            <span className="text-[10px] text-white/50 font-normal uppercase tracking-widest">
              Welcome to the Mediasoft AI ecosystem.
            </span>
          </div>
        );
      },
      error: (err) => {
        setLoading(false);
        const msg = err.response?.data?.message || 'Registration failed';
        return (
          <div className="flex flex-col gap-0.5 font-outfit">
            <span className="font-bold text-red-400 tracking-wide font-space text-sm">Access Refused</span>
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
            <UserPlus size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-2 font-space">Create Account</h2>
          <p className="text-white/40 text-sm">Join the future of business intelligence</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-white/40 tracking-widest uppercase ml-1 font-space">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white opacity-20 group-focus-within:opacity-100 group-focus-within:text-brand-primary transition-all z-10" />
              <Input
                type="text"
                required
                className="w-full bg-white/5 border-white/5 rounded-xl pl-11 pr-4 py-3.5 focus:border-brand-primary/30 transition-all placeholder:text-white/10 text-sm"
                placeholder="John Doe"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-white/40 tracking-widest uppercase ml-1 font-space">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white opacity-20 group-focus-within:opacity-100 group-focus-within:text-brand-primary transition-all z-10" />
              <Input
                type="email"
                required
                className="w-full bg-white/5 border-white/5 rounded-xl pl-11 pr-4 py-3.5 focus:border-brand-primary/30 transition-all placeholder:text-white/10 text-sm"
                placeholder="you@company.com"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
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
                Register Now
                <UserCheck className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm">
          <p className="text-white/30">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-primary hover:underline transition-all font-semibold cursor-pointer">Sign In Here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
