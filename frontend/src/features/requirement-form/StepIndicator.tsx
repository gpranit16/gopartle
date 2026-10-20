'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const steps = [
  { id: 1, title: 'Event Basics', description: 'Type, date & category' },
  { id: 2, title: 'Requirements', description: 'Role-specific details' },
  { id: 3, title: 'Logistics', description: 'Timing & contact info' },
  { id: 4, title: 'Review', description: 'Confirm & submit' },
];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="w-full mb-8">
      <ol className="grid grid-cols-4 gap-2 sm:gap-4">
        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <li
              key={step.id}
              className="relative flex flex-col items-center sm:items-start text-center sm:text-left"
              aria-current={isCurrent ? 'step' : undefined}
            >
              {/* Progress bar line for steps */}
              <div
                className={`w-full h-1.5 rounded-full mb-2.5 transition-colors duration-300 ${
                  isCompleted
                    ? 'bg-[#1C1917]'
                    : isCurrent
                    ? 'bg-[#B45309]'
                    : 'bg-[#E8E4DC]'
                }`}
              />

              <div className="flex items-center space-x-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200 ${
                    isCompleted
                      ? 'bg-[#1C1917] text-white'
                      : isCurrent
                      ? 'bg-[#B45309] text-white ring-4 ring-[#FEF3C7]'
                      : 'bg-[#F4F1EC] text-[#78716C] border border-[#E8E4DC]'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : step.id}
                </div>
                <span
                  className={`text-xs sm:text-sm font-medium hidden sm:inline ${
                    isCurrent
                      ? 'text-[#1C1917] font-semibold'
                      : isCompleted
                      ? 'text-[#57534E]'
                      : 'text-[#A8A29E]'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              <span className="text-[11px] text-[#78716C] mt-0.5 hidden md:block">
                {step.description}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
