'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { checkBackendHealth } from '@/lib/api';

export function Header() {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    let isMounted = true;
    checkBackendHealth().then((res) => {
      if (isMounted) {
        setBackendStatus(res.healthy ? 'online' : 'offline');
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className="border-b border-[#E8E4DC] bg-[#FAF8F5]/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#1C1917] flex items-center justify-center text-white shadow-sm ring-1 ring-black/5">
            <Calendar className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-lg tracking-tight text-[#1C1917]">GoPratle</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                Event Portal
              </span>
            </div>
            <p className="text-xs text-[#78716C] hidden sm:block">
              Host & Professional Marketplace
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          {backendStatus === 'checking' && (
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
              <RefreshCw className="w-3 h-3 animate-spin text-stone-500" />
              <span>Checking API...</span>
            </div>
          )}
          {backendStatus === 'online' && (
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium">Backend & DB Connected</span>
            </div>
          )}
          {backendStatus === 'offline' && (
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Backend Offline</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
