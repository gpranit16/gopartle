'use client';

import React from 'react';
import { AlertCircle, IndianRupee, Sparkles, Music, Users, Clock, HelpCircle } from 'lucide-react';
import { Category, PlannerDetails, PerformerDetails, CrewDetails } from '@/types/requirement';

interface Step2CategoryDetailsProps {
  category: Category;
  plannerData: PlannerDetails;
  performerData: PerformerDetails;
  crewData: CrewDetails;
  onUpdatePlanner: (fields: Partial<PlannerDetails>) => void;
  onUpdatePerformer: (fields: Partial<PerformerDetails>) => void;
  onUpdateCrew: (fields: Partial<CrewDetails>) => void;
  errors: Record<string, string>;
  onBack: () => void;
  onContinue: () => void;
}

const plannerServiceOptions = [
  'Full Event Planning & Curation',
  'Venue Sourcing & Contract Negotiation',
  'Catering & Menu Hospitality',
  'Stage Design & Floral Decor',
  'Sound, Stage & Lighting (AV)',
  'Artist & VIP Hospitality',
  'Guest RSVP & Registration',
  'On-Day Production & Timeline Control',
];

const eventScaleOptions: PlannerDetails['eventScale'][] = [
  'Small (Under 50)',
  'Medium (50-250)',
  'Large (250-1000)',
  'Extravagant (1000+)',
];

const crewExperienceOptions: CrewDetails['experienceLevel'][] = [
  'Entry Level',
  'Mid Level',
  'Lead / Senior',
];

export function Step2CategoryDetails({
  category,
  plannerData,
  performerData,
  crewData,
  onUpdatePlanner,
  onUpdatePerformer,
  onUpdateCrew,
  errors,
  onBack,
  onContinue,
}: Step2CategoryDetailsProps) {
  const togglePlannerService = (service: string) => {
    const current = plannerData.servicesRequired || [];
    if (current.includes(service)) {
      onUpdatePlanner({ servicesRequired: current.filter((s) => s !== service) });
    } else {
      onUpdatePlanner({ servicesRequired: [...current, service] });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Category Banner */}
      <div className="p-4 sm:p-5 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-start space-x-3.5">
        <div className="w-10 h-10 rounded-lg bg-[#B45309] text-white flex items-center justify-center shrink-0 mt-0.5">
          {category === 'planner' && <Sparkles className="w-5 h-5" />}
          {category === 'performer' && <Music className="w-5 h-5" />}
          {category === 'crew' && <Users className="w-5 h-5" />}
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#1C1917]">
            Step 2:{' '}
            {category === 'planner'
              ? 'Event Planner Specifications'
              : category === 'performer'
              ? 'Performer & Entertainment Specifications'
              : 'Crew & Operational Staff Specifications'}
          </h2>
          <p className="text-xs sm:text-sm text-[#78716C] mt-0.5">
            {category === 'planner' &&
              'Specify the coordination scope, expected guest count, and planning budget.'}
            {category === 'performer' &&
              'Detail performance style, set duration, performer count, and tech needs.'}
            {category === 'crew' &&
              'Define crew roles, shift durations, team headcount, and required experience.'}
          </p>
        </div>
      </div>

      {/* Dynamic Form Content */}
      <div className="bg-white p-5 sm:p-7 rounded-xl border border-[#E8E4DC] shadow-sm space-y-6">
        {/* ==================== PLANNER FIELDS ==================== */}
        {category === 'planner' && (
          <>
            {/* Services Required */}
            <div>
              <label className="block text-sm font-semibold text-[#1C1917] mb-2">
                Services Required <span className="text-amber-700">*</span>
              </label>
              <p className="text-xs text-[#78716C] mb-3">
                Select one or more services you expect the event planner to handle.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {plannerServiceOptions.map((service) => {
                  const isChecked = plannerData.servicesRequired?.includes(service);
                  return (
                    <button
                      key={service}
                      type="button"
                      onClick={() => togglePlannerService(service)}
                      className={`text-left p-3 rounded-lg border text-xs sm:text-sm font-medium transition-all duration-150 flex items-center justify-between cursor-pointer ${
                        isChecked
                          ? 'border-[#B45309] bg-[#FFFBEB] text-[#92400E] ring-1 ring-[#B45309]'
                          : 'border-[#E8E4DC] bg-white text-[#44403C] hover:border-[#D5CEC2] hover:bg-stone-50'
                      }`}
                    >
                      <span>{service}</span>
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ml-2 ${
                          isChecked ? 'border-[#B45309] bg-[#B45309]' : 'border-stone-300'
                        }`}
                      >
                        {isChecked && (
                          <div className="w-1.5 h-1.5 rounded-sm bg-white" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors['categoryDetails.servicesRequired'] && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-2">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors['categoryDetails.servicesRequired']}
                </p>
              )}
            </div>

            {/* Expected Attendees & Event Scale */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="expectedAttendees" className="block text-sm font-semibold text-[#1C1917] mb-1.5">
                  Expected Attendees (Pax) <span className="text-amber-700">*</span>
                </label>
                <input
                  id="expectedAttendees"
                  type="number"
                  min="1"
                  value={plannerData.expectedAttendees || ''}
                  onChange={(e) =>
                    onUpdatePlanner({ expectedAttendees: Number(e.target.value) })
                  }
                  placeholder="e.g., 200"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-smooth ${
                    errors['categoryDetails.expectedAttendees']
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-[#D5CEC2] focus:border-[#B45309]'
                  }`}
                />
                {errors['categoryDetails.expectedAttendees'] && (
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors['categoryDetails.expectedAttendees']}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="eventScale" className="block text-sm font-semibold text-[#1C1917] mb-1.5">
                  Event Scale & Complexity <span className="text-amber-700">*</span>
                </label>
                <select
                  id="eventScale"
                  value={plannerData.eventScale}
                  onChange={(e) =>
                    onUpdatePlanner({
                      eventScale: e.target.value as PlannerDetails['eventScale'],
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5CEC2] focus:border-[#B45309] text-sm bg-white transition-smooth"
                >
                  {eventScaleOptions.map((scale) => (
                    <option key={scale} value={scale}>
                      {scale}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Planner Budget Range */}
            <div>
              <label className="block text-sm font-semibold text-[#1C1917] mb-1.5">
                Planning Fee / Budget Range (INR) <span className="text-amber-700">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <span className="text-xs font-semibold text-[#78716C] absolute left-3 top-3">
                    ₹ Min
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={plannerData.budgetMin || ''}
                    onChange={(e) =>
                      onUpdatePlanner({ budgetMin: Number(e.target.value) })
                    }
                    placeholder="25000"
                    className="w-full pl-14 pr-3.5 py-2.5 rounded-lg border border-[#D5CEC2] focus:border-[#B45309] text-sm transition-smooth"
                  />
                </div>
                <div className="relative">
                  <span className="text-xs font-semibold text-[#78716C] absolute left-3 top-3">
                    ₹ Max
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={plannerData.budgetMax || ''}
                    onChange={(e) =>
                      onUpdatePlanner({ budgetMax: Number(e.target.value) })
                    }
                    placeholder="75000"
                    className={`w-full pl-14 pr-3.5 py-2.5 rounded-lg border text-sm transition-smooth ${
                      errors['categoryDetails.budgetMax']
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-[#D5CEC2] focus:border-[#B45309]'
                    }`}
                  />
                </div>
              </div>
              {errors['categoryDetails.budgetMax'] && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors['categoryDetails.budgetMax']}
                </p>
              )}
            </div>

            {/* Additional Requirements */}
            <div>
              <label htmlFor="additionalRequirements" className="block text-sm font-semibold text-[#1C1917] mb-1.5">
                Specific Planner Expectations & Scope Notes
              </label>
              <textarea
                id="additionalRequirements"
                rows={3}
                value={plannerData.additionalRequirements || ''}
                onChange={(e) =>
                  onUpdatePlanner({ additionalRequirements: e.target.value })
                }
                placeholder="Mention any specific thematic ideas, vendor preferences, or special logistics..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5CEC2] focus:border-[#B45309] text-sm transition-smooth"
              />
            </div>
          </>
        )}

        {/* ==================== PERFORMER FIELDS ==================== */}
        {category === 'performer' && (
          <>
            <div>
              <label htmlFor="performanceType" className="block text-sm font-semibold text-[#1C1917] mb-1.5">
                Performance Type & Genre <span className="text-amber-700">*</span>
              </label>
              <input
                id="performanceType"
                type="text"
                value={performerData.performanceType}
                onChange={(e) =>
                  onUpdatePerformer({ performanceType: e.target.value })
                }
                placeholder="e.g., Acoustic Indie Band, Bollywood DJ, Classical Flautist, Emcee / Anchor"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-smooth ${
                  errors['categoryDetails.performanceType']
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-[#D5CEC2] focus:border-[#B45309]'
                }`}
              />
              {errors['categoryDetails.performanceType'] && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors['categoryDetails.performanceType']}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="durationMinutes" className="block text-sm font-semibold text-[#1C1917] mb-1.5">
                  Performance Duration (Minutes) <span className="text-amber-700">*</span>
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-[#78716C] absolute left-3 top-3" />
                  <input
                    id="durationMinutes"
                    type="number"
                    min="5"
                    max="720"
                    value={performerData.durationMinutes || ''}
                    onChange={(e) =>
                      onUpdatePerformer({ durationMinutes: Number(e.target.value) })
                    }
                    placeholder="e.g., 90 (1.5 hours)"
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-sm transition-smooth ${
                      errors['categoryDetails.durationMinutes']
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-[#D5CEC2] focus:border-[#B45309]'
                    }`}
                  />
                </div>
                {errors['categoryDetails.durationMinutes'] && (
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors['categoryDetails.durationMinutes']}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="performerCount" className="block text-sm font-semibold text-[#1C1917] mb-1.5">
                  Number of Performers <span className="text-amber-700">*</span>
                </label>
                <input
                  id="performerCount"
                  type="number"
                  min="1"
                  max="50"
                  value={performerData.performerCount || ''}
                  onChange={(e) =>
                    onUpdatePerformer({ performerCount: Number(e.target.value) })
                  }
                  placeholder="e.g., 4"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-smooth ${
                    errors['categoryDetails.performerCount']
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-[#D5CEC2] focus:border-[#B45309]'
                  }`}
                />
                {errors['categoryDetails.performerCount'] && (
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors['categoryDetails.performerCount']}
                  </p>
                )}
              </div>
            </div>

            {/* Performer Budget Range */}
            <div>
              <label className="block text-sm font-semibold text-[#1C1917] mb-1.5">
                Performer Budget Range (INR) <span className="text-amber-700">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <span className="text-xs font-semibold text-[#78716C] absolute left-3 top-3">
                    ₹ Min
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={performerData.budgetMin || ''}
                    onChange={(e) =>
                      onUpdatePerformer({ budgetMin: Number(e.target.value) })
                    }
                    placeholder="20000"
                    className="w-full pl-14 pr-3.5 py-2.5 rounded-lg border border-[#D5CEC2] focus:border-[#B45309] text-sm transition-smooth"
                  />
                </div>
                <div className="relative">
                  <span className="text-xs font-semibold text-[#78716C] absolute left-3 top-3">
                    ₹ Max
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={performerData.budgetMax || ''}
                    onChange={(e) =>
                      onUpdatePerformer({ budgetMax: Number(e.target.value) })
                    }
                    placeholder="50000"
                    className={`w-full pl-14 pr-3.5 py-2.5 rounded-lg border text-sm transition-smooth ${
                      errors['categoryDetails.budgetMax']
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-[#D5CEC2] focus:border-[#B45309]'
                    }`}
                  />
                </div>
              </div>
              {errors['categoryDetails.budgetMax'] && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors['categoryDetails.budgetMax']}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="technicalRequirements" className="block text-sm font-semibold text-[#1C1917] mb-1.5">
                Technical & Sound Requirements
              </label>
              <textarea
                id="technicalRequirements"
                rows={3}
                value={performerData.technicalRequirements || ''}
                onChange={(e) =>
                  onUpdatePerformer({ technicalRequirements: e.target.value })
                }
                placeholder="e.g., Wireless handheld mic, 2 monitors, DI inputs, drum riser..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5CEC2] focus:border-[#B45309] text-sm transition-smooth"
              />
            </div>
          </>
        )}

        {/* ==================== CREW FIELDS ==================== */}
        {category === 'crew' && (
          <>
            <div>
              <label htmlFor="crewRole" className="block text-sm font-semibold text-[#1C1917] mb-1.5">
                Crew Role Needed <span className="text-amber-700">*</span>
              </label>
              <input
                id="crewRole"
                type="text"
                value={crewData.crewRole}
                onChange={(e) => onUpdateCrew({ crewRole: e.target.value })}
                placeholder="e.g., Lighting Console Operator, Stage Hand, Camera Operator, Sound Engineer"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-smooth ${
                  errors['categoryDetails.crewRole']
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-[#D5CEC2] focus:border-[#B45309]'
                }`}
              />
              {errors['categoryDetails.crewRole'] && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors['categoryDetails.crewRole']}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="crewCount" className="block text-sm font-semibold text-[#1C1917] mb-1.5">
                  Number of Staff <span className="text-amber-700">*</span>
                </label>
                <input
                  id="crewCount"
                  type="number"
                  min="1"
                  max="100"
                  value={crewData.crewCount || ''}
                  onChange={(e) => onUpdateCrew({ crewCount: Number(e.target.value) })}
                  placeholder="e.g., 2"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-smooth ${
                    errors['categoryDetails.crewCount']
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-[#D5CEC2] focus:border-[#B45309]'
                  }`}
                />
                {errors['categoryDetails.crewCount'] && (
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors['categoryDetails.crewCount']}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="shiftHours" className="block text-sm font-semibold text-[#1C1917] mb-1.5">
                  Shift Duration (Hours) <span className="text-amber-700">*</span>
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-[#78716C] absolute left-3 top-3" />
                  <input
                    id="shiftHours"
                    type="number"
                    min="1"
                    max="24"
                    value={crewData.shiftHours || ''}
                    onChange={(e) => onUpdateCrew({ shiftHours: Number(e.target.value) })}
                    placeholder="e.g., 8"
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-sm transition-smooth ${
                      errors['categoryDetails.shiftHours']
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-[#D5CEC2] focus:border-[#B45309]'
                    }`}
                  />
                </div>
                {errors['categoryDetails.shiftHours'] && (
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors['categoryDetails.shiftHours']}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="experienceLevel" className="block text-sm font-semibold text-[#1C1917] mb-1.5">
                  Experience Level <span className="text-amber-700">*</span>
                </label>
                <select
                  id="experienceLevel"
                  value={crewData.experienceLevel}
                  onChange={(e) =>
                    onUpdateCrew({
                      experienceLevel: e.target.value as CrewDetails['experienceLevel'],
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5CEC2] focus:border-[#B45309] text-sm bg-white transition-smooth"
                >
                  {crewExperienceOptions.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Crew Budget / Pay Range */}
            <div>
              <label className="block text-sm font-semibold text-[#1C1917] mb-1.5">
                Pay Rate / Budget Range (INR per person or total) <span className="text-amber-700">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <span className="text-xs font-semibold text-[#78716C] absolute left-3 top-3">
                    ₹ Min
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={crewData.budgetMin || ''}
                    onChange={(e) =>
                      onUpdateCrew({ budgetMin: Number(e.target.value) })
                    }
                    placeholder="5000"
                    className="w-full pl-14 pr-3.5 py-2.5 rounded-lg border border-[#D5CEC2] focus:border-[#B45309] text-sm transition-smooth"
                  />
                </div>
                <div className="relative">
                  <span className="text-xs font-semibold text-[#78716C] absolute left-3 top-3">
                    ₹ Max
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={crewData.budgetMax || ''}
                    onChange={(e) =>
                      onUpdateCrew({ budgetMax: Number(e.target.value) })
                    }
                    placeholder="15000"
                    className={`w-full pl-14 pr-3.5 py-2.5 rounded-lg border text-sm transition-smooth ${
                      errors['categoryDetails.budgetMax']
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-[#D5CEC2] focus:border-[#B45309]'
                    }`}
                  />
                </div>
              </div>
              {errors['categoryDetails.budgetMax'] && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors['categoryDetails.budgetMax']}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="additionalInstructions" className="block text-sm font-semibold text-[#1C1917] mb-1.5">
                Crew Brief & Special Instructions
              </label>
              <textarea
                id="additionalInstructions"
                rows={3}
                value={crewData.additionalInstructions || ''}
                onChange={(e) =>
                  onUpdateCrew({ additionalInstructions: e.target.value })
                }
                placeholder="e.g., Black crew attire required, call time 2 hours prior to doors opening..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5CEC2] focus:border-[#B45309] text-sm transition-smooth"
              />
            </div>
          </>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-lg border border-[#D5CEC2] hover:bg-stone-100 text-[#44403C] text-sm font-medium transition-smooth cursor-pointer"
        >
          ← Back to Step 1
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="px-6 py-2.5 rounded-lg bg-[#1C1917] hover:bg-[#292524] text-white text-sm font-semibold shadow-sm transition-smooth cursor-pointer"
        >
          Continue to Step 3 →
        </button>
      </div>
    </div>
  );
}
