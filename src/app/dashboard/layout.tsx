'use client';

import {
  LayoutDashboard, Database, Settings, LogOut, BookOpen,
  User, Menu, X, FileText, History, FolderOpen, Bot,
  Search, Bell, Command, Plus, ChevronDown, Info
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

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
      badge: 'Soon'
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
    <div className="flex h-screen bg-black text-white overflow-hidden font-outfit">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          width: sidebarOpen ? 240 : 0,
          opacity: sidebarOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-zinc-950 border-r border-zinc-800 flex flex-col z-50 lg:z-50 min-w-[240px] max-w-[240px] overflow-hidden"
      >
        <div className="p-4 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
             <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                <Bot className="w-4.5 h-4.5 text-black" />
             </div>
             <div>
               <h1 className="font-bold text-white font-space text-base">Mediasoft AI</h1>
               <p className="text-[10px] text-zinc-500 font-outfit uppercase tracking-wider">Enterprise</p>
             </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-zinc-400 hover:bg-zinc-800 hover:text-white p-2 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="p-3 flex-1 flex flex-col gap-4">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href} className="relative px-1">
                  <Link href={item.href}>
                    <div
                      className={`w-full flex items-center gap-2.5 p-1.5 rounded-lg transition-all cursor-pointer relative group ${
                        isActive ? 'text-white' : 'text-zinc-500 hover:text-white hover:bg-zinc-900/40'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active-pill"
                          className="absolute inset-0 bg-zinc-900 rounded-lg"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      
                      <div className="relative z-10">
                        <div className="w-8 h-8 flex items-center justify-center shrink-0 relative">
                          {isActive && (
                            <motion.div
                              layoutId="sidebar-active-icon-bg"
                              className="absolute inset-0 bg-white rounded-md"
                              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                          <div className={`w-8 h-8 rounded-md flex items-center justify-center transition-all relative z-10 ${
                            !isActive ? 'bg-zinc-950/50' : ''
                          }`}>
                            <Icon size={16} className={isActive ? 'text-black' : 'text-zinc-500 group-hover:text-zinc-300'} />
                          </div>
                        </div>
                      </div>

                      <span className="font-medium text-sm flex-1 text-left relative z-10">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-900/50 text-zinc-600 border border-zinc-800/50 relative z-10">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-2 border-t border-zinc-800">
           <div className="mx-1 p-3.5 rounded-xl bg-linear-to-br from-zinc-900 to-black border border-zinc-800/50 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors duration-500" />
              
              <div className="relative z-10 space-y-2.5">
                <div className="flex items-center gap-2">
                   <div className="w-5 h-5 rounded-md bg-zinc-800 border border-zinc-700/50 flex items-center justify-center">
                      <Info size={11} className="text-zinc-400" />
                   </div>
                   <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Platform Tip</span>
                </div>
                
                <p className="text-[11px] text-zinc-400 font-medium leading-normal">
                   AI responses are improved by your <span className="text-white">Knowledge Base</span>. Add documents for higher accuracy.
                </p>
              </div>
           </div>
        </div>
      </motion.aside>

      <main className="flex-1 flex flex-col min-w-0 bg-black font-outfit relative z-0">
        <header className="h-14 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
             <button
               onClick={toggleSidebar}
               className="lg:hidden text-zinc-400 hover:bg-zinc-800 p-2 rounded-lg"
             >
               <Menu size={20} />
             </button>
             
             <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
                <span className="hover:text-white cursor-pointer transition-colors hidden sm:block">Workspace</span>
                <span className="hidden sm:block opacity-30">/</span>
                <span className="text-white font-semibold font-space tracking-tight">{activeItem.label}</span>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-500 hover:bg-zinc-900 transition-all cursor-pointer group">
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
                 className={`flex items-center gap-2 p-1.5 rounded-lg border transition-all ${
                   userMenuOpen ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                 }`}
               >
                 <div className="w-6.5 h-6.5 rounded bg-white flex items-center justify-center text-black font-bold text-[10px] font-space tracking-tighter">
                    {getInitials(user?.name || '')}
                 </div>
                 <ChevronDown size={14} className={`text-zinc-500 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
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

        <div className="flex-1 relative min-h-0">
          <div className="absolute inset-0">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
