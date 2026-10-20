export type RequirementCategory = 'planner' | 'performer' | 'crew';

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

export type CategoryDetails = PlannerDetails | PerformerDetails | CrewDetails;

export interface AdditionalDetails {
  preferredTimeWindow?: string;
  venueType?: 'indoor' | 'outdoor' | 'hybrid';
  equipmentFacilities?: string;
  additionalNotes?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
}

export interface RequirementInput {
  eventName: string;
  eventType: EventType;
  eventTypeOther?: string;
  date: EventDate;
  location: string;
  venue?: string;
  category: RequirementCategory;
  categoryDetails: CategoryDetails;
  additionalDetails: AdditionalDetails;
}

export interface RequirementDocument extends RequirementInput {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
