'use client';

import React from 'react';
import { Calendar as CalendarIcon, MapPin, Building, Sparkles, Music, Users, AlertCircle } from 'lucide-react';
import { Category, EventType } from '@/types/requirement';

interface Step1BasicsProps {
  data: {
    eventName: string;
    eventType: EventType;
    eventTypeOther?: string;
    date: {
      startDate: string;
      endDate?: string;
    };
    location: string;
    venue?: string;
    category: Category;
  };
  onChange: (fields: Partial<Step1BasicsProps['data']>) => void;
  errors: Record<string, string>;
  onContinue: () => void;
}

const eventTypes: EventType[] = [
  'Wedding',
  'Corporate Event',
  'Concert',
  'Festival',
  'Private Party',
  'Other',
];

const categories: Array<{
  id: Category;
  title: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    id: 'planner',
    title: 'Event Planner',
    badge: 'End-to-End',
    description: 'Expert coordinators to manage vendors, schedules, styling, and seamless execution.',
    icon: Sparkles,
  },
  {
    id: 'performer',
    title: 'Performer',
    badge: 'Entertainment',
    description: 'Live bands, DJs, solo musicians, anchors, and artists to engage your audience.',
    icon: Music,
  },
  {
    id: 'crew',
    title: 'Crew & Staff',
    badge: 'Operations',
    description: 'Technicians, lighting operators, stagehands, sound engineers, and event support staff.',
    icon: Users,
  },
];

export function Step1Basics({ data, onChange, errors, onContinue }: Step1BasicsProps) {
  const [isRange, setIsRange] = React.useState<boolean>(
    Boolean(data.date.endDate && data.date.endDate.trim() !== '')
  );

  const handleDateModeChange = (rangeMode: boolean) => {
    setIsRange(rangeMode);
    if (!rangeMode) {
      onChange({
        date: {
          startDate: data.date.startDate,
          endDate: '',
        },
      });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Step Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1917]">
          Step 1: Event Basics & Requirement Category
        </h2>
        <p className="text-sm text-[#78716C] mt-1">
          Provide foundational event details and select the specialist role you are looking to hire.
        </p>
      </div>

      {/* Category Selection Cards */}
      <div>
        <label className="block text-sm font-semibold text-[#1C1917] mb-2">
          Who are you looking to hire? <span className="text-amber-700">*</span>
        </label>
        <p className="text-xs text-[#78716C] mb-4">
          Select one primary category. Step 2 will adapt to collect role-specific requirements.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5" role="radiogroup" aria-label="Requirement Category">
          {categories.map((cat) => {
            const isSelected = data.category === cat.id;
            const Icon = cat.icon;

            return (
              <button
                key={cat.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onChange({ category: cat.id })}
                className={`relative text-left p-4 sm:p-5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#B45309] bg-[#FFFBEB] ring-2 ring-[#B45309]/30 shadow-sm'
                    : 'border-[#E8E4DC] bg-white hover:border-[#D5CEC2] hover:bg-[#FAF8F5]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#B45309] text-white'
                          : 'bg-[#F4F1EC] text-[#57534E]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="font-semibold text-base text-[#1C1917] mb-1">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#78716C] leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8E4DC]/60 flex items-center justify-between">
                  <span
                    className={`text-xs font-medium ${
                      isSelected ? 'text-[#B45309]' : 'text-[#78716C]'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'border-[#B45309] bg-[#B45309]'
                        : 'border-stone-300 bg-white'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {errors.category && (
          <p className="text-xs text-red-600 flex items-center gap-1 mt-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.category}
          </p>
        )}
      </div>

      {/* Event Details Form Grid */}
      <div className="bg-white p-5 sm:p-7 rounded-xl border border-[#E8E4DC] shadow-sm space-y-6">
        {/* Event Name */}
        <div>
          <label htmlFor="eventName" className="block text-sm font-semibold text-[#1C1917] mb-1.5">
            Event Name <span className="text-amber-700">*</span>
          </label>
          <input
            id="eventName"
            type="text"
            value={data.eventName}
            onChange={(e) => onChange({ eventName: e.target.value })}
            placeholder="e.g., Annual Tech Symposium 2027 or Mehendi Celebration"
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-smooth ${
              errors.eventName
                ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                : 'border-[#D5CEC2] focus:border-[#B45309] focus:ring-1 focus:ring-[#B45309]'
            }`}
          />
          {errors.eventName ? (
            <p className="text-xs text-red-600 flex items-center gap-1 mt-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.eventName}
            </p>
          ) : (
            <p className="text-xs text-[#78716C] mt-1">
              Give your event a clear, recognizable name.
            </p>
          )}
        </div>

        {/* Event Type & Other description */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="eventType" className="block text-sm font-semibold text-[#1C1917] mb-1.5">
              Event Type <span className="text-amber-700">*</span>
            </label>
            <select
              id="eventType"
              value={data.eventType}
              onChange={(e) => onChange({ eventType: e.target.value as EventType })}
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white transition-smooth ${
                errors.eventType
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-[#D5CEC2] focus:border-[#B45309]'
              }`}
            >
              {eventTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.eventType && (
              <p className="text-xs text-red-600 flex items-center gap-1 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.eventType}
              </p>
            )}
          </div>

          {data.eventType === 'Other' && (
            <div>
              <label htmlFor="eventTypeOther" className="block text-sm font-semibold text-[#1C1917] mb-1.5">
                Specify Custom Event Type <span className="text-amber-700">*</span>
              </label>
              <input
                id="eventTypeOther"
                type="text"
                value={data.eventTypeOther || ''}
                onChange={(e) => onChange({ eventTypeOther: e.target.value })}
                placeholder="e.g., Art Exhibition, Flash Mob, Product Launch"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-smooth ${
                  errors.eventTypeOther
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-[#D5CEC2] focus:border-[#B45309]'
                }`}
              />
              {errors.eventTypeOther && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.eventTypeOther}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Date Selection: Single vs Date Range */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-[#1C1917]">
              Event Schedule <span className="text-amber-700">*</span>
            </label>
            <div className="flex items-center space-x-2 text-xs">
              <button
                type="button"
                onClick={() => handleDateModeChange(false)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  !isRange
                    ? 'bg-[#1C1917] text-white font-medium'
                    : 'bg-[#F4F1EC] text-[#57534E] hover:bg-[#E8E4DC]'
                }`}
              >
                Single Day
              </button>
              <button
                type="button"
                onClick={() => handleDateModeChange(true)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  isRange
                    ? 'bg-[#1C1917] text-white font-medium'
                    : 'bg-[#F4F1EC] text-[#57534E] hover:bg-[#E8E4DC]'
                }`}
              >
                Multi-Day Range
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-xs font-medium text-[#57534E] mb-1">
                {isRange ? 'Start Date' : 'Event Date'} <span className="text-amber-700">*</span>
              </label>
              <div className="relative">
                <input
                  id="startDate"
                  type="date"
                  value={data.date.startDate}
                  onChange={(e) =>
                    onChange({
                      date: {
                        ...data.date,
                        startDate: e.target.value,
                      },
                    })
                  }
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-smooth ${
                    errors['date.startDate']
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-[#D5CEC2] focus:border-[#B45309]'
                  }`}
                />
              </div>
              {errors['date.startDate'] && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors['date.startDate']}
                </p>
              )}
            </div>

            {isRange && (
              <div>
                <label htmlFor="endDate" className="block text-xs font-medium text-[#57534E] mb-1">
                  End Date <span className="text-amber-700">*</span>
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={data.date.endDate || ''}
                  min={data.date.startDate}
                  onChange={(e) =>
                    onChange({
                      date: {
                        ...data.date,
                        endDate: e.target.value,
                      },
                    })
                  }
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-smooth ${
                    errors['date.endDate']
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-[#D5CEC2] focus:border-[#B45309]'
                  }`}
                />
                {errors['date.endDate'] && (
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors['date.endDate']}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Location & Optional Venue */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-[#1C1917] mb-1.5">
              City / Location <span className="text-amber-700">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#78716C] absolute left-3 top-3" />
              <input
                id="location"
                type="text"
                value={data.location}
                onChange={(e) => onChange({ location: e.target.value })}
                placeholder="e.g., Bengaluru, Karnataka"
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-sm transition-smooth ${
                  errors.location
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-[#D5CEC2] focus:border-[#B45309]'
                }`}
              />
            </div>
            {errors.location && (
              <p className="text-xs text-red-600 flex items-center gap-1 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.location}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="venue" className="block text-sm font-semibold text-[#1C1917]">
                Specific Venue
              </label>
              <span className="text-xs text-[#78716C]">Optional</span>
            </div>
            <div className="relative">
              <Building className="w-4 h-4 text-[#78716C] absolute left-3 top-3" />
              <input
                id="venue"
                type="text"
                value={data.venue || ''}
                onChange={(e) => onChange({ venue: e.target.value })}
                placeholder="e.g., Leela Palace, Palace Grounds"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#D5CEC2] focus:border-[#B45309] text-sm transition-smooth"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={onContinue}
          className="px-6 py-2.5 rounded-lg bg-[#1C1917] hover:bg-[#292524] text-white text-sm font-semibold shadow-sm transition-smooth cursor-pointer"
        >
          Continue to Step 2 →
        </button>
      </div>
    </div>
  );
}
