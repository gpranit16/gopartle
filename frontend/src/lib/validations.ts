import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const step1Schema = z
  .object({
    eventName: z
      .string()
      .trim()
      .min(2, 'Event name must be at least 2 characters')
      .max(100, 'Event name cannot exceed 100 characters'),
    eventType: z.enum(
      ['Wedding', 'Corporate Event', 'Concert', 'Festival', 'Private Party', 'Other'],
      { required_error: 'Please select an event type' }
    ),
    eventTypeOther: z.string().trim().max(100).optional(),
    date: z
      .object({
        startDate: z
          .string({ required_error: 'Event start date is required' })
          .min(1, 'Event start date is required')
          .refine(
            (val) => val === '' || (dateRegex.test(val) && !isNaN(Date.parse(val))),
            'Start date must be in YYYY-MM-DD format'
          ),
        endDate: z
          .string()
          .regex(dateRegex, 'End date must be in YYYY-MM-DD format')
          .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format')
          .optional()
          .or(z.literal('')),
      })
      .superRefine((data, ctx) => {
        if (data.endDate && data.endDate.trim() !== '') {
          const start = new Date(data.startDate).getTime();
          const end = new Date(data.endDate).getTime();
          if (end < start) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'End date must not precede start date',
              path: ['endDate'],
            });
          }
        }
      }),
    location: z
      .string()
      .trim()
      .min(2, 'Event location must be at least 2 characters')
      .max(150, 'Location cannot exceed 150 characters'),
    venue: z.string().trim().max(150).optional().default(''),
    category: z.enum(['planner', 'performer', 'crew'], {
      required_error: 'Please choose an event category',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.eventType === 'Other') {
      if (!data.eventTypeOther || data.eventTypeOther.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please specify the custom event type',
          path: ['eventTypeOther'],
        });
      }
    }
  });

export const plannerDetailsSchema = z
  .object({
    servicesRequired: z
      .array(z.string().min(1))
      .min(1, 'Please select at least one required service'),
    expectedAttendees: z.coerce
      .number({ invalid_type_error: 'Please enter a valid number of attendees' })
      .int('Attendees must be a whole number')
      .positive('Expected attendees must be greater than 0'),
    eventScale: z.enum(
      ['Small (Under 50)', 'Medium (50-250)', 'Large (250-1000)', 'Extravagant (1000+)'],
      { required_error: 'Please select the scale of your event' }
    ),
    budgetMin: z.coerce
      .number({ invalid_type_error: 'Minimum budget must be a number' })
      .min(0, 'Minimum budget cannot be negative'),
    budgetMax: z.coerce
      .number({ invalid_type_error: 'Maximum budget must be a number' })
      .min(0, 'Maximum budget cannot be negative'),
    additionalRequirements: z.string().max(1000).optional().default(''),
  })
  .superRefine((data, ctx) => {
    if (data.budgetMax < data.budgetMin) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Max budget must be greater than or equal to min budget',
        path: ['budgetMax'],
      });
    }
  });

export const performerDetailsSchema = z
  .object({
    performanceType: z
      .string()
      .trim()
      .min(2, 'Performance type must be at least 2 characters')
      .max(100),
    durationMinutes: z.coerce
      .number({ invalid_type_error: 'Duration must be a number' })
      .int('Must be whole minutes')
      .min(5, 'Minimum performance duration is 5 minutes')
      .max(720, 'Duration cannot exceed 720 minutes (12 hours)'),
    performerCount: z.coerce
      .number({ invalid_type_error: 'Performer count must be a number' })
      .int('Must be a whole number')
      .min(1, 'At least 1 performer is required')
      .max(100, 'Performer count cannot exceed 100'),
    budgetMin: z.coerce
      .number({ invalid_type_error: 'Minimum budget must be a number' })
      .min(0, 'Minimum budget cannot be negative'),
    budgetMax: z.coerce
      .number({ invalid_type_error: 'Maximum budget must be a number' })
      .min(0, 'Maximum budget cannot be negative'),
    technicalRequirements: z.string().max(1000).optional().default(''),
  })
  .superRefine((data, ctx) => {
    if (data.budgetMax < data.budgetMin) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Max budget must be greater than or equal to min budget',
        path: ['budgetMax'],
      });
    }
  });

export const crewDetailsSchema = z
  .object({
    crewRole: z
      .string()
      .trim()
      .min(2, 'Crew role must be at least 2 characters')
      .max(100),
    crewCount: z.coerce
      .number({ invalid_type_error: 'Crew count must be a number' })
      .int('Must be a whole number')
      .min(1, 'At least 1 crew member is required')
      .max(100, 'Crew count cannot exceed 100'),
    shiftHours: z.coerce
      .number({ invalid_type_error: 'Shift hours must be a number' })
      .min(1, 'Minimum shift duration is 1 hour')
      .max(24, 'Shift cannot exceed 24 hours'),
    budgetMin: z.coerce
      .number({ invalid_type_error: 'Minimum budget must be a number' })
      .min(0, 'Minimum budget cannot be negative'),
    budgetMax: z.coerce
      .number({ invalid_type_error: 'Maximum budget must be a number' })
      .min(0, 'Maximum budget cannot be negative'),
    experienceLevel: z.enum(['Entry Level', 'Mid Level', 'Lead / Senior'], {
      required_error: 'Please select required experience level',
    }),
    additionalInstructions: z.string().max(1000).optional().default(''),
  })
  .superRefine((data, ctx) => {
    if (data.budgetMax < data.budgetMin) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Max budget must be greater than or equal to min budget',
        path: ['budgetMax'],
      });
    }
  });

export const step3Schema = z.object({
  preferredTimeWindow: z.string().max(100).optional().default(''),
  venueType: z.enum(['indoor', 'outdoor', 'hybrid']).optional(),
  equipmentFacilities: z.string().max(1000).optional().default(''),
  additionalNotes: z.string().max(1000).optional().default(''),
  contactName: z
    .string()
    .trim()
    .min(2, 'Contact name must be at least 2 characters')
    .max(100),
  contactEmail: z
    .string()
    .trim()
    .email('Please provide a valid email address'),
  contactPhone: z
    .string()
    .trim()
    .regex(/^(\+?[0-9\s\-()]{7,20})?$/, 'Please provide a valid phone number')
    .optional()
    .or(z.literal('')),
});
