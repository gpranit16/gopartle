'use client';

import React from 'react';
import { AlertCircle, Clock, Home, Trees, Layers, User, Mail, Phone, ShieldCheck } from 'lucide-react';
import { AdditionalDetails } from '@/types/requirement';

interface Step3ScheduleLogisticsProps {
  data: AdditionalDetails;
  onChange: (fields: Partial<AdditionalDetails>) => void;
  errors: Record<string, string>;
  onBack: () => void;
  onContinue: () => void;
}

const venueTypes = [
  { id: 'indoor', label: 'Indoor Hall / Room', icon: Home, desc: 'Enclosed auditorium, banquet hall, or studio' },
  { id: 'outdoor', label: 'Outdoor Grounds', icon: Trees, desc: 'Open lawn, rooftop, amphitheater, or beachfront' },
  { id: 'hybrid', label: 'Hybrid / Mixed', icon: Layers, desc: 'Both indoor dining and outdoor lawn/courtyard' },
];

const timeWindowSuggestions = [
  'Morning (9:00 AM – 1:00 PM)',
  'Afternoon (1:00 PM – 5:00 PM)',
  'Evening (5:00 PM – 10:00 PM)',
  'Late Night (9:00 PM – 2:00 AM)',
  'Full Day Engagement',
];

export function Step3ScheduleLogistics({
  data,
  onChange,
  errors,
  onBack,
  onContinue,
}: Step3ScheduleLogisticsProps) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1917]">
          Step 3: Schedule, Logistics & Point of Contact
        </h2>
        <p className="text-sm text-[#78716C] mt-1">
          Add operational details about the venue layout, timing window, and direct contact for vendor follow-up.
        </p>
      </div>

      <div className="bg-white p-5 sm:p-7 rounded-xl border border-[#E8E4DC] shadow-sm space-y-6">
        {/* Preferred Time Window */}
        <div>
          <label htmlFor="preferredTimeWindow" className="block text-sm font-semibold text-[#1C1917] mb-1.5">
            Preferred Time / Operational Window
          </label>
          <div className="relative">
            <Clock className="w-4 h-4 text-[#78716C] absolute left-3 top-3" />
            <input
              id="preferredTimeWindow"
              type="text"
              value={data.preferredTimeWindow || ''}
              onChange={(e) => onChange({ preferredTimeWindow: e.target.value })}
              placeholder="e.g., Evening 6:00 PM to 10:30 PM"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#D5CEC2] focus:border-[#B45309] text-sm transition-smooth"
            />
          </div>
          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {timeWindowSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onChange({ preferredTimeWindow: suggestion })}
                className="text-[11px] px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E8E4DC] text-[#57534E] hover:border-[#D5CEC2] hover:bg-stone-100 transition-colors"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Indoor vs Outdoor Venue */}
        <div>
          <label className="block text-sm font-semibold text-[#1C1917] mb-1.5">
            Venue Environment
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {venueTypes.map((vt) => {
              const isSelected = data.venueType === vt.id;
              const Icon = vt.icon;
              return (
                <button
                  key={vt.id}
                  type="button"
                  onClick={() => onChange({ venueType: vt.id as any })}
                  className={`text-left p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#B45309] bg-[#FFFBEB] ring-1 ring-[#B45309]'
                      : 'border-[#E8E4DC] bg-white hover:border-[#D5CEC2]'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-[#B45309]' : 'text-[#78716C]'}`} />
                    <span className="text-xs sm:text-sm font-semibold text-[#1C1917]">
                      {vt.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#78716C] leading-normal">{vt.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Facilities & Equipment required */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="equipmentFacilities" className="block text-sm font-semibold text-[#1C1917]">
              Special Facilities or Venue Equipment Needed
            </label>
            <span className="text-xs text-[#78716C]">Optional</span>
          </div>
          <textarea
            id="equipmentFacilities"
            rows={2}
            value={data.equipmentFacilities || ''}
            onChange={(e) => onChange({ equipmentFacilities: e.target.value })}
            placeholder="e.g., Green room access, 3-phase power supply, freight elevator access, parking permits..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5CEC2] focus:border-[#B45309] text-sm transition-smooth"
          />
        </div>

        {/* Additional Notes */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="additionalNotes" className="block text-sm font-semibold text-[#1C1917]">
              Additional Notes or Special Instructions
            </label>
            <span className="text-xs text-[#78716C]">Optional</span>
          </div>
          <textarea
            id="additionalNotes"
            rows={2}
            value={data.additionalNotes || ''}
            onChange={(e) => onChange({ additionalNotes: e.target.value })}
            placeholder="Any other details relevant for the selected professionals..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5CEC2] focus:border-[#B45309] text-sm transition-smooth"
          />
        </div>

        {/* Point of Contact Section */}
        <div className="pt-4 border-t border-[#E8E4DC]">
          <div className="flex items-center space-x-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-[#1C1917]">
              Primary Host / Coordinator Contact
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="contactName" className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                Contact Full Name <span className="text-amber-700">*</span>
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-[#78716C] absolute left-3 top-3" />
                <input
                  id="contactName"
                  type="text"
                  value={data.contactName}
                  onChange={(e) => onChange({ contactName: e.target.value })}
                  placeholder="e.g., Priya Nair"
                  className={`w-full pl-8 pr-3 py-2 rounded-lg border text-sm transition-smooth ${
                    errors['additionalDetails.contactName']
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-[#D5CEC2] focus:border-[#B45309]'
                  }`}
                />
              </div>
              {errors['additionalDetails.contactName'] && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors['additionalDetails.contactName']}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="contactEmail" className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                Contact Email <span className="text-amber-700">*</span>
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-[#78716C] absolute left-3 top-3" />
                <input
                  id="contactEmail"
                  type="email"
                  value={data.contactEmail}
                  onChange={(e) => onChange({ contactEmail: e.target.value })}
                  placeholder="priya@example.com"
                  className={`w-full pl-8 pr-3 py-2 rounded-lg border text-sm transition-smooth ${
                    errors['additionalDetails.contactEmail']
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-[#D5CEC2] focus:border-[#B45309]'
                  }`}
                />
              </div>
              {errors['additionalDetails.contactEmail'] && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors['additionalDetails.contactEmail']}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="contactPhone" className="block text-xs font-semibold text-[#1C1917]">
                  Phone Number
                </label>
                <span className="text-[10px] text-[#78716C]">Optional</span>
              </div>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-[#78716C] absolute left-3 top-3" />
                <input
                  id="contactPhone"
                  type="tel"
                  value={data.contactPhone || ''}
                  onChange={(e) => onChange({ contactPhone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className={`w-full pl-8 pr-3 py-2 rounded-lg border text-sm transition-smooth ${
                    errors['additionalDetails.contactPhone']
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-[#D5CEC2] focus:border-[#B45309]'
                  }`}
                />
              </div>
              {errors['additionalDetails.contactPhone'] && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors['additionalDetails.contactPhone']}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-lg border border-[#D5CEC2] hover:bg-stone-100 text-[#44403C] text-sm font-medium transition-smooth cursor-pointer"
        >
          ← Back to Step 2
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="px-6 py-2.5 rounded-lg bg-[#1C1917] hover:bg-[#292524] text-white text-sm font-semibold shadow-sm transition-smooth cursor-pointer"
        >
          Review & Submit →
        </button>
      </div>
    </div>
  );
}
