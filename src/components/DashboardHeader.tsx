'use client';

import React from 'react';
import { Bot, Plus, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  isBotWorking?: boolean;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  actionText?: string;
  isActionDisabled?: boolean;
  isActionLoading?: boolean;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
}

export function DashboardHeader({
  title,
  subtitle,
  isBotWorking = false,
  onAction,
  actionIcon = <Plus className="w-3.5 h-3.5" />,
  actionText = "New Chat",
  isActionDisabled = false,
  isActionLoading = false,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search..."
}: DashboardHeaderProps) {
  return (
    <div className="relative z-20 px-4 lg:px-6 py-3 lg:py-4 border-b border-white/5 bg-black/20 backdrop-blur-md shrink-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 lg:gap-4 min-w-0">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-white flex items-center justify-center shrink-0 shadow-2xl">
            <Bot className={`w-4.5 h-4.5 lg:w-6 lg:h-6 text-black ${isBotWorking ? 'animate-spin' : ''}`} />
          </div>
          <div className="min-w-0 overflow-hidden">
            <h1 className="font-bold text-sm lg:text-lg font-space tracking-tight leading-none uppercase gradient-text truncate">
              {title}
            </h1>
            <div className="flex items-center gap-1 mt-0.5 lg:mt-1">
              <div className="w-1 h-1 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
              <p className="text-[7px] lg:text-[8px] uppercase tracking-widest text-zinc-600 font-bold truncate">
                {subtitle}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 lg:gap-4 shrink-0">
          {onSearchChange !== undefined && (
            <div className="relative group hidden lg:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-600 w-3 h-3 group-focus-within:text-white transition-colors" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 h-8 bg-white/5 border-zinc-800/50 text-white placeholder:text-zinc-700 focus:border-zinc-700 focus:ring-0 w-32 lg:w-48 xl:w-64 rounded-lg backdrop-blur-sm transition-all text-[10px] lg:text-[11px] font-medium"
              />
            </div>
          )}
          {onAction && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAction}
              disabled={isActionDisabled || isActionLoading}
              className="flex items-center gap-1.5 lg:gap-2 text-zinc-500 hover:text-white border-zinc-800/50 hover:bg-zinc-800/50 rounded-lg px-2 lg:px-3 h-7 lg:h-8 transition-all shrink-0 font-bold text-[9px] lg:text-[10px] tracking-widest"
            >
              <span className="shrink-0 scale-90 lg:scale-100">
                {actionIcon}
              </span>
              <span className="hidden xs:inline">{actionText}</span>
              <span className="xs:hidden">{actionText.split(' ')[0]}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
