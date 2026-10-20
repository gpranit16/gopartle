'use client';

import React, { useState } from 'react';
import { CheckCircle, Copy, Check, PlusCircle, ArrowRight, Calendar, UserCheck } from 'lucide-react';
import { Category } from '@/types/requirement';

interface SuccessConfirmationProps {
  requirementId: string;
  eventName: string;
  category: Category;
  createdAt?: string;
  onReset: () => void;
}

export function SuccessConfirmation({
  requirementId,
  eventName,
  category,
  createdAt,
  onReset,
}: SuccessConfirmationProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(requirementId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categoryName =
    category === 'planner'
      ? 'Event Planner'
      : category === 'performer'
      ? 'Performer'
      : 'Crew & Staff';

  return (
    <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 sm:p-10 shadow-sm text-center max-w-xl mx-auto animate-fadeIn">
      {/* Success Badge */}
      <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-9 h-9" />
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-[#1C1917]">
        Requirement Successfully Posted!
      </h2>
      <p className="text-sm text-[#78716C] mt-2 max-w-md mx-auto">
        Your requirement for <strong className="text-[#1C1917]">{eventName}</strong> has been saved directly to the MongoDB database and is now live for qualified event specialists.
      </p>

      {/* Generated Requirement ID card */}
      <div className="mt-6 p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] text-left">
        <div className="flex items-center justify-between text-xs text-[#78716C] mb-1">
          <span>Requirement ID (MongoDB ObjectId)</span>
          <span className="font-medium text-emerald-700 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Persisted
          </span>
        </div>
        <div className="flex items-center justify-between font-mono text-sm bg-white p-2.5 rounded-lg border border-[#D5CEC2]">
          <span className="text-[#1C1917] select-all break-all">{requirementId}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="ml-2 px-2.5 py-1 text-xs rounded-md bg-[#FAF8F5] hover:bg-stone-100 text-[#44403C] border border-[#E8E4DC] flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#E8E4DC]/60 text-xs">
          <div>
            <span className="text-[#78716C]">Category: </span>
            <span className="font-semibold text-[#1C1917]">{categoryName}</span>
          </div>
          <div className="text-right">
            <span className="text-[#78716C]">Created: </span>
            <span className="font-medium text-[#1C1917]">
              {createdAt ? new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#1C1917] hover:bg-[#292524] text-white text-sm font-semibold shadow-sm transition-smooth flex items-center justify-center space-x-2 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Another Requirement</span>
        </button>
      </div>
    </div>
  );
}
