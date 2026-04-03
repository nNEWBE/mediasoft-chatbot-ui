'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Trash2, AlertCircle, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: string | ReactNode;
  confirmText?: string;
  abortText?: string;
  variant?: 'danger' | 'primary' | 'info';
  icon?: LucideIcon;
  isLoading?: boolean;
  footerText?: string;
  children?: ReactNode;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm Action",
  abortText = "Abort",
  variant = 'primary',
  icon: Icon = AlertCircle,
  isLoading = false,
  footerText = "Permanent System Action",
  confirmIcon: ConfirmIcon,
  abortIcon: AbortIcon,
  children
}: ConfirmationModalProps & { confirmIcon?: LucideIcon; abortIcon?: LucideIcon }) {
  const isDanger = variant === 'danger';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-60"
          />
          
          <div className="fixed inset-0 flex items-center justify-center z-70 pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-950/80 backdrop-blur-3xl border border-white/5 rounded-3xl w-full max-w-[360px] pointer-events-auto overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] font-outfit"
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-5 border border-white/5 transition-transform duration-500">
                  <Icon className={`${isDanger ? 'text-zinc-400' : 'text-white'} transition-colors`} size={20} />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1.5 font-space uppercase tracking-tight leading-none">
                  {title}
                </h3>
                <div className="text-zinc-500 text-[13px] leading-relaxed mb-6">
                  {description}
                </div>

                {children}

                <div className="flex items-center gap-3">
                  <Button
                    onClick={async () => {
                      await onConfirm();
                    }}
                    disabled={isLoading}
                    className={`flex-1 bg-white text-black hover:bg-zinc-200 h-10 rounded-xl font-bold text-[11px] transition-all active:scale-95 shadow-xl shadow-white/5 flex items-center justify-center gap-2`}
                  >
                    {isLoading ? (
                      <div className="w-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      ConfirmIcon && <ConfirmIcon size={14} />
                    )}
                    <span>{isLoading ? 'Wait' : confirmText}</span>
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-white h-10 rounded-xl font-bold text-[11px] transition-all flex items-center justify-center gap-2"
                  >
                    {AbortIcon && <AbortIcon size={14} />}
                    <span>{abortText}</span>
                  </Button>
                </div>
              </div>
              
              <div className="bg-white/2 px-6 py-3 border-t border-white/5 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <AlertCircle size={10} className="text-zinc-700" />
                  <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest leading-none">{footerText}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
