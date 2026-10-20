'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { StepIndicator } from '@/features/requirement-form/StepIndicator';
import { Step1Basics } from '@/features/requirement-form/Step1Basics';
import { Step2CategoryDetails } from '@/features/requirement-form/Step2CategoryDetails';
import { Step3ScheduleLogistics } from '@/features/requirement-form/Step3ScheduleLogistics';
import { Step4ReviewSubmit } from '@/features/requirement-form/Step4ReviewSubmit';
import { SuccessConfirmation } from '@/features/requirement-form/SuccessConfirmation';
import { RequirementFormData, Category } from '@/types/requirement';
import {
  step1Schema,
  plannerDetailsSchema,
  performerDetailsSchema,
  crewDetailsSchema,
  step3Schema,
} from '@/lib/validations';
import { submitRequirement } from '@/lib/api';

const initialFormData: RequirementFormData = {
  eventName: '',
  eventType: 'Corporate Event',
  eventTypeOther: '',
  date: {
    startDate: '',
    endDate: '',
  },
  location: '',
  venue: '',
  category: 'planner',

  plannerDetails: {
    servicesRequired: ['Full Event Planning & Curation', 'Production & AV'],
    expectedAttendees: 150,
    eventScale: 'Medium (50-250)',
    budgetMin: 30000,
    budgetMax: 70000,
    additionalRequirements: '',
  },

  performerDetails: {
    performanceType: '',
    durationMinutes: 60,
    performerCount: 1,
    budgetMin: 15000,
    budgetMax: 35000,
    technicalRequirements: '',
  },

  crewDetails: {
    crewRole: '',
    crewCount: 2,
    shiftHours: 8,
    budgetMin: 8000,
    budgetMax: 16000,
    experienceLevel: 'Mid Level',
    additionalInstructions: '',
  },

  additionalDetails: {
    preferredTimeWindow: '',
    venueType: 'indoor',
    equipmentFacilities: '',
    additionalNotes: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  },
};

export default function Home() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<RequirementFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    id: string;
    category: Category;
    createdAt?: string;
  } | null>(null);

  // Update handlers
  const updateStep1 = (fields: Partial<RequirementFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
    // Clear relevant errors
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(fields).forEach((k) => delete next[k]);
      delete next['date.startDate'];
      delete next['date.endDate'];
      return next;
    });
  };

  const updatePlanner = (fields: Partial<RequirementFormData['plannerDetails']>) => {
    setFormData((prev) => ({
      ...prev,
      plannerDetails: { ...prev.plannerDetails, ...fields },
    }));
    setErrors({});
  };

  const updatePerformer = (fields: Partial<RequirementFormData['performerDetails']>) => {
    setFormData((prev) => ({
      ...prev,
      performerDetails: { ...prev.performerDetails, ...fields },
    }));
    setErrors({});
  };

  const updateCrew = (fields: Partial<RequirementFormData['crewDetails']>) => {
    setFormData((prev) => ({
      ...prev,
      crewDetails: { ...prev.crewDetails, ...fields },
    }));
    setErrors({});
  };

  const updateStep3 = (fields: Partial<RequirementFormData['additionalDetails']>) => {
    setFormData((prev) => ({
      ...prev,
      additionalDetails: { ...prev.additionalDetails, ...fields },
    }));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(fields).forEach((k) => delete next[`additionalDetails.${k}`]);
      return next;
    });
  };

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    const result = step1Schema.safeParse({
      eventName: formData.eventName,
      eventType: formData.eventType,
      eventTypeOther: formData.eventTypeOther,
      date: formData.date,
      location: formData.location,
      venue: formData.venue,
      category: formData.category,
    });

    if (!result.success) {
      const errMap: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errMap[issue.path.join('.')] = issue.message;
      });
      setErrors(errMap);
      return false;
    }

    setErrors({});
    return true;
  };

  // Step 2 Validation based on category
  const validateStep2 = (): boolean => {
    let result;
    if (formData.category === 'planner') {
      result = plannerDetailsSchema.safeParse(formData.plannerDetails);
    } else if (formData.category === 'performer') {
      result = performerDetailsSchema.safeParse(formData.performerDetails);
    } else {
      result = crewDetailsSchema.safeParse(formData.crewDetails);
    }

    if (!result.success) {
      const errMap: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errMap[`categoryDetails.${issue.path.join('.')}`] = issue.message;
      });
      setErrors(errMap);
      return false;
    }

    setErrors({});
    return true;
  };

  // Step 3 Validation
  const validateStep3 = (): boolean => {
    const result = step3Schema.safeParse(formData.additionalDetails);
    if (!result.success) {
      const errMap: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errMap[`additionalDetails.${issue.path.join('.')}`] = issue.message;
      });
      setErrors(errMap);
      return false;
    }

    setErrors({});
    return true;
  };

  // Navigation handlers
  const handleContinueStep1 = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleContinueStep2 = () => {
    if (validateStep2()) {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleContinueStep3 = () => {
    if (validateStep3()) {
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleEditStep = (stepNumber: number) => {
    setErrors({});
    setSubmissionError(null);
    setCurrentStep(stepNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Handler
  const handleSubmit = async () => {
    if (isSubmitting) return;

    // Full validation check
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }
    if (!validateStep2()) {
      setCurrentStep(2);
      return;
    }
    if (!validateStep3()) {
      setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    // Prepare payload
    let activeCategoryDetails: any;
    if (formData.category === 'planner') {
      activeCategoryDetails = formData.plannerDetails;
    } else if (formData.category === 'performer') {
      activeCategoryDetails = formData.performerDetails;
    } else {
      activeCategoryDetails = formData.crewDetails;
    }

    const payload = {
      eventName: formData.eventName,
      eventType: formData.eventType,
      eventTypeOther: formData.eventTypeOther || undefined,
      date: {
        startDate: formData.date.startDate,
        endDate: formData.date.endDate || undefined,
      },
      location: formData.location,
      venue: formData.venue || undefined,
      category: formData.category,
      categoryDetails: activeCategoryDetails,
      additionalDetails: {
        preferredTimeWindow: formData.additionalDetails.preferredTimeWindow || undefined,
        venueType: formData.additionalDetails.venueType || undefined,
        equipmentFacilities: formData.additionalDetails.equipmentFacilities || undefined,
        additionalNotes: formData.additionalDetails.additionalNotes || undefined,
        contactName: formData.additionalDetails.contactName,
        contactEmail: formData.additionalDetails.contactEmail,
        contactPhone: formData.additionalDetails.contactPhone || undefined,
      },
    };

    try {
      const response = await submitRequirement(payload);

      if (response.success && response.data?.id) {
        setSubmittedData({
          id: response.data.id,
          category: response.data.category,
          createdAt: response.data.createdAt,
        });
      } else {
        const errorMsg =
          response.errors && response.errors.length > 0
            ? response.errors.map((e) => `${e.field}: ${e.message}`).join(', ')
            : response.message || 'Failed to submit requirement';
        setSubmissionError(errorMsg);
      }
    } catch (err: any) {
      setSubmissionError(err.message || 'An unexpected error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setSubmissionError(null);
    setSubmittedData(null);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col justify-between">
      <div>
        <Header />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {!submittedData ? (
            <>
              {/* Portal Header */}
              <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
                <span className="text-xs font-semibold tracking-wider text-[#B45309] uppercase">
                  Marketplace Requirement Posting
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#1C1917] mt-1.5 mb-3">
                  Post Your Event Requirement
                </h1>
                <p className="text-sm sm:text-base text-[#78716C] leading-relaxed">
                  Connect with curated event planners, performers, and technical crew. Submit your verified requirements in four simple steps.
                </p>
              </div>

              {/* Four-Step Progress Indicator */}
              <StepIndicator currentStep={currentStep} totalSteps={4} />

              {/* Active Step Container */}
              <div className="mt-6">
                {currentStep === 1 && (
                  <Step1Basics
                    data={{
                      eventName: formData.eventName,
                      eventType: formData.eventType,
                      eventTypeOther: formData.eventTypeOther,
                      date: formData.date,
                      location: formData.location,
                      venue: formData.venue,
                      category: formData.category,
                    }}
                    onChange={updateStep1}
                    errors={errors}
                    onContinue={handleContinueStep1}
                  />
                )}

                {currentStep === 2 && (
                  <Step2CategoryDetails
                    category={formData.category}
                    plannerData={formData.plannerDetails}
                    performerData={formData.performerDetails}
                    crewData={formData.crewDetails}
                    onUpdatePlanner={updatePlanner}
                    onUpdatePerformer={updatePerformer}
                    onUpdateCrew={updateCrew}
                    errors={errors}
                    onBack={() => setCurrentStep(1)}
                    onContinue={handleContinueStep2}
                  />
                )}

                {currentStep === 3 && (
                  <Step3ScheduleLogistics
                    data={formData.additionalDetails}
                    onChange={updateStep3}
                    errors={errors}
                    onBack={() => setCurrentStep(2)}
                    onContinue={handleContinueStep3}
                  />
                )}

                {currentStep === 4 && (
                  <Step4ReviewSubmit
                    formData={formData}
                    onEditStep={handleEditStep}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    submissionError={submissionError}
                    onBack={() => setCurrentStep(3)}
                  />
                )}
              </div>
            </>
          ) : (
            <SuccessConfirmation
              requirementId={submittedData.id}
              eventName={formData.eventName}
              category={submittedData.category}
              createdAt={submittedData.createdAt}
              onReset={handleReset}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#E8E4DC] bg-white py-6 mt-12 text-center text-xs text-[#78716C]">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2027 GoPratle Platform. Built for Full-Stack Developer Assignment.</p>
          <div className="flex items-center space-x-4 text-xs font-medium text-[#57534E]">
            <span>Next.js 16 (App Router)</span>
            <span>•</span>
            <span>Node & Express</span>
            <span>•</span>
            <span>MongoDB Atlas</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
