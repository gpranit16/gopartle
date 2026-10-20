export type Category = 'planner' | 'performer' | 'crew';

export type EventType =
  | 'Wedding'
  | 'Corporate Event'
  | 'Concert'
  | 'Festival'
  | 'Private Party'
  | 'Other';

export interface EventDate {
  startDate: string;
  endDate?: string;
}

export interface PlannerDetails {
  servicesRequired: string[];
  expectedAttendees: number;
  eventScale: 'Small (Under 50)' | 'Medium (50-250)' | 'Large (250-1000)' | 'Extravagant (1000+)';
  budgetMin: number;
  budgetMax: number;
  additionalRequirements?: string;
}

export interface PerformerDetails {
  performanceType: string;
  durationMinutes: number;
  performerCount: number;
  budgetMin: number;
  budgetMax: number;
  technicalRequirements?: string;
}

export interface CrewDetails {
  crewRole: string;
  crewCount: number;
  shiftHours: number;
  budgetMin: number;
  budgetMax: number;
  experienceLevel: 'Entry Level' | 'Mid Level' | 'Lead / Senior';
  additionalInstructions?: string;
}

export interface AdditionalDetails {
  preferredTimeWindow?: string;
  venueType?: 'indoor' | 'outdoor' | 'hybrid';
  equipmentFacilities?: string;
  additionalNotes?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
}

export interface RequirementFormData {
  // Step 1: Event Basics
  eventName: string;
  eventType: EventType;
  eventTypeOther?: string;
  date: EventDate;
  location: string;
  venue?: string;
  category: Category;

  // Step 2: Category-Specific
  plannerDetails: PlannerDetails;
  performerDetails: PerformerDetails;
  crewDetails: CrewDetails;

  // Step 3: Additional Details
  additionalDetails: AdditionalDetails;
}

export interface SubmissionResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    category: Category;
    createdAt: string;
  };
  errors?: Array<{ field: string; message: string }>;
}
