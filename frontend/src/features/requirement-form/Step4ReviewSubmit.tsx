'use client';

import React from 'react';
import { Edit3, CheckCircle2, AlertCircle, Loader2, Sparkles, Music, Users, Calendar, MapPin, IndianRupee, ShieldCheck } from 'lucide-react';
import { RequirementFormData } from '@/types/requirement';

interface Step4ReviewSubmitProps {
  formData: RequirementFormData;
  onEditStep: (stepNumber: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submissionError: string | null;
  onBack: () => void;
}

export function Step4ReviewSubmit({
  formData,
  onEditStep,
  onSubmit,
  isSubmitting,
  submissionError,
  onBack,
}: Step4ReviewSubmitProps) {
  const { category, plannerDetails, performerDetails, crewDetails, additionalDetails } =
    formData;

  const categoryName =
    category === 'planner'
      ? 'Event Planner'
      : category === 'performer'
      ? 'Performer'
      : 'Crew & Staff';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1917]">
          Step 4: Review Your Requirement
        </h2>
        <p className="text-sm text-[#78716C] mt-1">
          Please carefully check all entered parameters before publishing your requirement to the marketplace.
        </p>
      </div>

      {submissionError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3 text-red-800">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">Unable to submit requirement</p>
            <p className="mt-0.5 text-xs text-red-700">{submissionError}</p>
          </div>
        </div>
      )}

      {/* Group 1: Event Basics */}
      <section className="bg-white rounded-xl border border-[#E8E4DC] p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E4DC]">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-[#B45309]" />
            <h3 className="text-sm sm:text-base font-bold text-[#1C1917]">
              1. Event Basics & Role
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(1)}
            disabled={isSubmitting}
            className="flex items-center space-x-1 text-xs font-semibold text-[#B45309] hover:text-[#92400E] px-2.5 py-1 rounded-md hover:bg-amber-50 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-sm">
          <div>
            <dt className="text-xs font-medium text-[#78716C]">Event Name</dt>
            <dd className="font-semibold text-[#1C1917] mt-0.5">{formData.eventName}</dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-[#78716C]">Event Type</dt>
            <dd className="font-medium text-[#1C1917] mt-0.5">
              {formData.eventType}
              {formData.eventType === 'Other' && formData.eventTypeOther
                ? ` (${formData.eventTypeOther})`
                : ''}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-[#78716C]">Target Role</dt>
            <dd className="mt-0.5 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
              {categoryName}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-[#78716C]">Schedule / Date</dt>
            <dd className="font-medium text-[#1C1917] mt-0.5">
              {formData.date.startDate}
              {formData.date.endDate && formData.date.endDate !== formData.date.startDate
                ? ` to ${formData.date.endDate}`
                : ''}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-[#78716C]">Location</dt>
            <dd className="font-medium text-[#1C1917] mt-0.5">{formData.location}</dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-[#78716C]">Venue</dt>
            <dd className="font-medium text-[#1C1917] mt-0.5">
              {formData.venue || <span className="text-[#A8A29E]">Not specified</span>}
            </dd>
          </div>
        </dl>
      </section>

      {/* Group 2: Category-Specific Details */}
      <section className="bg-white rounded-xl border border-[#E8E4DC] p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E4DC]">
          <div className="flex items-center space-x-2">
            {category === 'planner' && <Sparkles className="w-4 h-4 text-[#B45309]" />}
            {category === 'performer' && <Music className="w-4 h-4 text-[#B45309]" />}
            {category === 'crew' && <Users className="w-4 h-4 text-[#B45309]" />}
            <h3 className="text-sm sm:text-base font-bold text-[#1C1917]">
              2. {categoryName} Requirements
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(2)}
            disabled={isSubmitting}
            className="flex items-center space-x-1 text-xs font-semibold text-[#B45309] hover:text-[#92400E] px-2.5 py-1 rounded-md hover:bg-amber-50 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        {category === 'planner' && (
          <div className="space-y-4 text-sm">
            <div>
              <dt className="text-xs font-medium text-[#78716C] mb-1.5">Services Required</dt>
              <dd className="flex flex-wrap gap-1.5">
                {plannerDetails.servicesRequired?.map((srv) => (
                  <span
                    key={srv}
                    className="px-2.5 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E8E4DC] text-xs font-medium text-[#44403C]"
                  >
                    {srv}
                  </span>
                ))}
              </dd>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-6 pt-2">
              <div>
                <dt className="text-xs font-medium text-[#78716C]">Expected Attendees</dt>
                <dd className="font-semibold text-[#1C1917] mt-0.5">
                  {plannerDetails.expectedAttendees} guests
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-[#78716C]">Event Scale</dt>
                <dd className="font-semibold text-[#1C1917] mt-0.5">{plannerDetails.eventScale}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-[#78716C]">Planning Budget Range</dt>
                <dd className="font-semibold text-[#B45309] mt-0.5">
                  ₹{plannerDetails.budgetMin?.toLocaleString('en-IN')} – ₹
                  {plannerDetails.budgetMax?.toLocaleString('en-IN')}
                </dd>
              </div>
            </dl>

            {plannerDetails.additionalRequirements && (
              <div className="pt-2">
                <dt className="text-xs font-medium text-[#78716C]">Additional Planner Requirements</dt>
                <dd className="text-xs text-[#44403C] mt-1 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                  {plannerDetails.additionalRequirements}
                </dd>
              </div>
            )}
          </div>
        )}

        {category === 'performer' && (
          <div className="space-y-4 text-sm">
            <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-6">
              <div>
                <dt className="text-xs font-medium text-[#78716C]">Performance Type</dt>
                <dd className="font-semibold text-[#1C1917] mt-0.5">
                  {performerDetails.performanceType}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-[#78716C]">Set Duration</dt>
                <dd className="font-semibold text-[#1C1917] mt-0.5">
                  {performerDetails.durationMinutes} minutes
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-[#78716C]">Performer Count</dt>
                <dd className="font-semibold text-[#1C1917] mt-0.5">
                  {performerDetails.performerCount} artist(s)
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-[#78716C]">Budget Range</dt>
                <dd className="font-semibold text-[#B45309] mt-0.5">
                  ₹{performerDetails.budgetMin?.toLocaleString('en-IN')} – ₹
                  {performerDetails.budgetMax?.toLocaleString('en-IN')}
                </dd>
              </div>
            </dl>

            {performerDetails.technicalRequirements && (
              <div className="pt-2">
                <dt className="text-xs font-medium text-[#78716C]">Technical Requirements</dt>
                <dd className="text-xs text-[#44403C] mt-1 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                  {performerDetails.technicalRequirements}
                </dd>
              </div>
            )}
          </div>
        )}

        {category === 'crew' && (
          <div className="space-y-4 text-sm">
            <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-6">
              <div>
                <dt className="text-xs font-medium text-[#78716C]">Crew Role</dt>
                <dd className="font-semibold text-[#1C1917] mt-0.5">{crewDetails.crewRole}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-[#78716C]">Staff Count</dt>
                <dd className="font-semibold text-[#1C1917] mt-0.5">
                  {crewDetails.crewCount} member(s)
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-[#78716C]">Shift Length</dt>
                <dd className="font-semibold text-[#1C1917] mt-0.5">
                  {crewDetails.shiftHours} hours
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-[#78716C]">Experience Level</dt>
                <dd className="font-semibold text-[#1C1917] mt-0.5">
                  {crewDetails.experienceLevel}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-[#78716C]">Payment Range</dt>
                <dd className="font-semibold text-[#B45309] mt-0.5">
                  ₹{crewDetails.budgetMin?.toLocaleString('en-IN')} – ₹
                  {crewDetails.budgetMax?.toLocaleString('en-IN')}
                </dd>
              </div>
            </dl>

            {crewDetails.additionalInstructions && (
              <div className="pt-2">
                <dt className="text-xs font-medium text-[#78716C]">Crew Brief & Instructions</dt>
                <dd className="text-xs text-[#44403C] mt-1 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                  {crewDetails.additionalInstructions}
                </dd>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Group 3: Logistics & Point of Contact */}
      <section className="bg-white rounded-xl border border-[#E8E4DC] p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E4DC]">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#B45309]" />
            <h3 className="text-sm sm:text-base font-bold text-[#1C1917]">
              3. Logistics & Contact Details
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(3)}
            disabled={isSubmitting}
            className="flex items-center space-x-1 text-xs font-semibold text-[#B45309] hover:text-[#92400E] px-2.5 py-1 rounded-md hover:bg-amber-50 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-6 text-sm">
          <div>
            <dt className="text-xs font-medium text-[#78716C]">Time Window</dt>
            <dd className="font-medium text-[#1C1917] mt-0.5">
              {additionalDetails.preferredTimeWindow || <span className="text-[#A8A29E]">Flexible</span>}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-[#78716C]">Venue Type</dt>
            <dd className="font-medium capitalize text-[#1C1917] mt-0.5">
              {additionalDetails.venueType || <span className="text-[#A8A29E]">Not specified</span>}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-[#78716C]">Contact Host</dt>
            <dd className="font-semibold text-[#1C1917] mt-0.5">
              {additionalDetails.contactName}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-[#78716C]">Email Address</dt>
            <dd className="font-medium text-[#1C1917] mt-0.5">
              {additionalDetails.contactEmail}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-[#78716C]">Phone Number</dt>
            <dd className="font-medium text-[#1C1917] mt-0.5">
              {additionalDetails.contactPhone || <span className="text-[#A8A29E]">None provided</span>}
            </dd>
          </div>
        </dl>

        {(additionalDetails.equipmentFacilities || additionalDetails.additionalNotes) && (
          <div className="mt-4 pt-3 border-t border-[#E8E4DC] grid grid-cols-1 sm:grid-cols-2 gap-4">
            {additionalDetails.equipmentFacilities && (
              <div>
                <dt className="text-xs font-medium text-[#78716C]">Special Facilities / Equipment</dt>
                <dd className="text-xs text-[#44403C] mt-1 bg-stone-50 p-2 rounded-lg border border-stone-200">
                  {additionalDetails.equipmentFacilities}
                </dd>
              </div>
            )}
            {additionalDetails.additionalNotes && (
              <div>
                <dt className="text-xs font-medium text-[#78716C]">Additional Notes</dt>
                <dd className="text-xs text-[#44403C] mt-1 bg-stone-50 p-2 rounded-lg border border-stone-200">
                  {additionalDetails.additionalNotes}
                </dd>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Submission Actions */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-lg border border-[#D5CEC2] hover:bg-stone-100 text-[#44403C] text-sm font-medium transition-smooth disabled:opacity-50 cursor-pointer"
        >
          ← Back to Step 3
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-8 py-3 rounded-lg bg-[#B45309] hover:bg-[#92400E] text-white text-sm font-semibold shadow-md transition-smooth flex items-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Requirement to Database...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Post Requirement</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
