'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, LogOut, BookOpen,
  User, X, FileText, History, Bot,
  Search, Bell, Command, ChevronDown, Info,
  Menu
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { toast } from 'sonner';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const {
    selectConversation,
    fetchConversations,
  } = useChatStore();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isSmall = window.innerWidth < 1024;
      setIsMobile(isSmall);
      setSidebarOpen(!isSmall);

      const handleResize = () => {
        const mobile = window.innerWidth < 1024;
        setIsMobile(mobile);
        setSidebarOpen(!mobile);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, []);



  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Logged out successfully');
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const navItems = [
    {
      href: '/dashboard',
      icon: LayoutDashboard,
      label: 'Chat Dashboard',
      badge: null
    },
    {
      href: '/dashboard/context',
      icon: FileText,
      label: 'Context Management',
      badge: null
    },
    {
      href: '/dashboard/history',
      icon: History,
      label: 'Chat History',
      badge: null
    },
    {
      href: '/dashboard/knowledge',
      icon: BookOpen,
      label: 'Knowledge Base',
      badge: 'Soon'
    }
  ];

  const activeItem = navItems.find(item => item.href === pathname) || navItems[0];

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-100 overflow-hidden font-outfit relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-50">
        <div className="absolute top-[-15%] left-[-15%] w-[40%] h-[40%] rounded-full bg-white/3 blur-[100px]" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[40%] h-[40%] rounded-full bg-white/2 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-white/1 blur-[120px]" />
      </div>

      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          width: sidebarOpen ? 260 : (isMobile ? 0 : 80),
          x: isMobile && !sidebarOpen ? -260 : 0,
          opacity: 1
        }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className={`fixed lg:relative z-50 bg-[#080808] border-r border-white/5 flex flex-col h-full overflow-hidden shrink-0 shadow-2xl group/sidebar ${isMobile && !sidebarOpen ? 'pointer-events-none' : ''}`}
      >
        <div className="p-4 lg:p-6 flex items-center justify-between border-b border-white/5">
          <AnimatePresence mode="wait">
            {sidebarOpen ? (
              <motion.div
                key="expanded-logo"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                  <Bot className="w-4.5 h-4.5 text-black" />
                </div>
                <div>
                  <h1 className="font-bold text-white font-space text-base whitespace-nowrap">Mediasoft AI</h1>
                  <p className="text-[10px] text-zinc-500 font-outfit uppercase tracking-wider">Enterprise</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed-logo"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="w-full flex justify-center"
              >
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                  <Bot className="w-4.5 h-4.5 text-black" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-zinc-400 hover:bg-zinc-800 hover:text-white p-2 rounded-lg"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <nav className="p-3 flex-1 flex flex-col gap-4 overflow-y-auto">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href} className="relative px-1">
                  <Link href={item.href} onClick={() => isMobile && setSidebarOpen(false)}>
                    <div
                      className={`w-full flex items-center gap-2.5 p-1.5 rounded-lg transition-all cursor-pointer relative group ${isActive ? 'text-white' : 'text-zinc-500 hover:text-white hover:bg-white/5'
                        } ${!sidebarOpen && !isMobile ? 'justify-center' : ''}`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active-pill"
                          className="absolute inset-0 bg-white/5 rounded-lg"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                      )}

                      <div className="relative z-10">
                        <div className="w-8 h-8 flex items-center justify-center shrink-0 relative">
                          {isActive && (
                            <motion.div
                              layoutId="sidebar-active-icon-bg"
                              className="absolute inset-0 bg-white rounded-md shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all relative z-10 ${!isActive ? 'bg-white/5 border border-white/5 group-hover:border-white/10' : ''
                            }`}>
                            <Icon size={16} className={isActive ? 'text-black' : 'text-zinc-500 group-hover:text-zinc-100 transition-colors'} />
                          </div>
                        </div>
                      </div>

                      {(sidebarOpen || (isMobile && sidebarOpen)) && (
                        <motion.span
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="font-semibold text-sm flex-1 text-left relative z-10 truncate whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}

                      {(sidebarOpen || (isMobile && sidebarOpen)) && item.badge && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white text-black relative z-10 whitespace-nowrap"
                        >
                          {item.badge}
                        </motion.span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {(sidebarOpen || (isMobile && sidebarOpen)) ? (
          <div className="p-4 border-t border-white/5">
            <div className="mx-1 p-4 rounded-2xl bg-linear-to-br from-white/5 to-transparent border border-white/5 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors duration-500" />

              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-white flex items-center justify-center">
                    <Info size={11} className="text-black" />
                  </div>
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Platform Sync</span>
                </div>

                <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                  AI efficiency scales with your <span className="text-white">Knowledge Base</span>.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border-t border-white/5 flex justify-center">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-colors cursor-help">
              <Info size={14} />
            </div>
          </div>
        )}
      </motion.aside>

      <main className="flex-1 flex flex-col min-w-0 bg-transparent font-outfit relative z-10 transition-all">
        <header className="h-16 border-b border-white/5 bg-[#080808] flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-3 lg:gap-4">
            <button
              onClick={toggleSidebar}
              className="text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all p-2 rounded-lg bg-zinc-950 border border-zinc-800/50 group/toggle"
            >
              <Menu size={18} className={`transition-transform duration-300 ${!sidebarOpen ? 'rotate-180 scale-x-[-1]' : ''}`} />
            </button>

            <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium overflow-hidden">
              <span className="hover:text-white cursor-pointer transition-colors hidden lg:block whitespace-nowrap">Workspace</span>
              <span className="hidden lg:block opacity-30">/</span>
              <span className="text-white font-semibold font-space tracking-tight truncate max-w-[120px] sm:max-w-none">{activeItem.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-500 hover:bg-zinc-900 transition-all cursor-pointer group">
              <Search size={14} className="group-hover:text-zinc-300" />
              <span className="text-xs">Search anything...</span>
              <div className="flex items-center gap-1 ml-4 border border-zinc-700/50 px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400 font-mono">
                <Command size={10} /> K
              </div>
            </div>

            <button className="h-8 w-8 text-zinc-400 hover:bg-zinc-900 border border-zinc-800/50 rounded-lg relative flex items-center justify-center">
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full border border-black z-10" />
              <Bell size={16} />
            </button>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center gap-2 p-1 lg:p-1.5 rounded-lg border transition-all ${userMenuOpen ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                  }`}
              >
                <div className="w-6.5 h-6.5 rounded bg-white flex items-center justify-center text-black font-bold text-[10px] font-space tracking-tighter">
                  {getInitials(user?.name || '')}
                </div>
                <ChevronDown size={14} className={`text-zinc-500 transition-transform duration-300 hidden sm:block ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-56 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="p-3 border-b border-zinc-800">
                        <p className="text-xs font-semibold text-white truncate">{user?.name || 'User'}</p>
                        <p className="text-[10px] text-zinc-500 truncate mt-0.5">{user?.email}</p>
                      </div>
                      <div className="p-1.5">
                        <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all text-xs text-left">
                          <User size={14} />
                          Profile Settings
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-red-400 hover:bg-red-950/20 transition-all text-xs text-left"
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <div className="flex-1 relative min-h-0 overflow-hidden transform-gpu">
          <div className="absolute inset-0 overflow-y-auto will-change-scroll transform-gpu">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
