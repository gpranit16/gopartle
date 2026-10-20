import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const dateSchema = z
  .object({
    startDate: z
      .string({ required_error: 'Start date is required' })
      .regex(dateRegex, 'Start date must be in YYYY-MM-DD format')
      .refine((val) => !isNaN(Date.parse(val)), 'Invalid start date'),
    endDate: z
      .string()
      .regex(dateRegex, 'End date must be in YYYY-MM-DD format')
      .refine((val) => !isNaN(Date.parse(val)), 'Invalid end date')
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
  });

export const plannerDetailsSchema = z
  .object({
    servicesRequired: z
      .array(z.string().min(1, 'Service name cannot be empty'), {
        required_error: 'At least one service must be selected',
      })
      .min(1, 'At least one service is required'),
    expectedAttendees: z.coerce
      .number({ invalid_type_error: 'Attendees must be a valid number' })
      .int('Must be a whole number')
      .positive('Expected attendees must be greater than 0'),
    eventScale: z.enum(
      ['Small (Under 50)', 'Medium (50-250)', 'Large (250-1000)', 'Extravagant (1000+)'],
      { required_error: 'Event scale is required' }
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
        message: 'Maximum budget must be greater than or equal to minimum budget',
        path: ['budgetMax'],
      });
    }
  });

export const performerDetailsSchema = z
  .object({
    performanceType: z
      .string({ required_error: 'Performance type is required' })
      .trim()
      .min(2, 'Performance type must be at least 2 characters')
      .max(100),
    durationMinutes: z.coerce
      .number({ invalid_type_error: 'Duration must be a number' })
      .int('Must be whole minutes')
      .min(5, 'Minimum performance duration is 5 minutes')
      .max(720, 'Duration cannot exceed 12 hours (720 minutes)'),
    performerCount: z.coerce
      .number({ invalid_type_error: 'Performer count must be a number' })
      .int('Must be an integer')
      .min(1, 'At least 1 performer required')
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
        message: 'Maximum budget must be greater than or equal to minimum budget',
        path: ['budgetMax'],
      });
    }
  });

export const crewDetailsSchema = z
  .object({
    crewRole: z
      .string({ required_error: 'Crew role is required' })
      .trim()
      .min(2, 'Crew role must be at least 2 characters')
      .max(100),
    crewCount: z.coerce
      .number({ invalid_type_error: 'Crew count must be a number' })
      .int('Must be an integer')
      .min(1, 'At least 1 crew member required')
      .max(100, 'Crew count cannot exceed 100'),
    shiftHours: z.coerce
      .number({ invalid_type_error: 'Shift hours must be a number' })
      .min(1, 'Minimum shift duration is 1 hour')
      .max(24, 'Shift duration cannot exceed 24 hours'),
    budgetMin: z.coerce
      .number({ invalid_type_error: 'Minimum budget must be a number' })
      .min(0, 'Minimum budget cannot be negative'),
    budgetMax: z.coerce
      .number({ invalid_type_error: 'Maximum budget must be a number' })
      .min(0, 'Maximum budget cannot be negative'),
    experienceLevel: z.enum(['Entry Level', 'Mid Level', 'Lead / Senior'], {
      required_error: 'Experience level is required',
    }),
    additionalInstructions: z.string().max(1000).optional().default(''),
  })
  .superRefine((data, ctx) => {
    if (data.budgetMax < data.budgetMin) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Maximum budget must be greater than or equal to minimum budget',
        path: ['budgetMax'],
      });
    }
  });

export const additionalDetailsSchema = z.object({
  preferredTimeWindow: z.string().max(100).optional().default(''),
  venueType: z.enum(['indoor', 'outdoor', 'hybrid']).optional(),
  equipmentFacilities: z.string().max(1000).optional().default(''),
  additionalNotes: z.string().max(1000).optional().default(''),
  contactName: z
    .string({ required_error: 'Contact name is required' })
    .trim()
    .min(2, 'Contact name must be at least 2 characters')
    .max(100),
  contactEmail: z
    .string({ required_error: 'Contact email is required' })
    .trim()
    .email('Please provide a valid email address'),
  contactPhone: z
    .string()
    .trim()
    .regex(/^(\+?[0-9\s\-()]{7,20})?$/, 'Please provide a valid phone number')
    .optional()
    .or(z.literal('')),
});

export const createRequirementSchema = z
  .object({
    eventName: z
      .string({ required_error: 'Event name is required' })
      .trim()
      .min(2, 'Event name must be at least 2 characters')
      .max(100, 'Event name cannot exceed 100 characters'),
    eventType: z.enum(
      ['Wedding', 'Corporate Event', 'Concert', 'Festival', 'Private Party', 'Other'],
      { required_error: 'Event type is required' }
    ),
    eventTypeOther: z.string().max(100).optional(),
    date: dateSchema,
    location: z
      .string({ required_error: 'Event location is required' })
      .trim()
      .min(2, 'Location must be at least 2 characters')
      .max(150, 'Location cannot exceed 150 characters'),
    venue: z.string().trim().max(150).optional().default(''),
    category: z.enum(['planner', 'performer', 'crew'], {
      required_error: 'Category is required and must be planner, performer, or crew',
    }),
    categoryDetails: z.record(z.any(), {
      required_error: 'Category-specific details are required',
    }),
    additionalDetails: additionalDetailsSchema,
  })
  .superRefine((data, ctx) => {
    // Validate other event type description
    if (data.eventType === 'Other') {
      if (!data.eventTypeOther || data.eventTypeOther.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please describe the event type when "Other" is selected',
          path: ['eventTypeOther'],
        });
      }
    }

    // Discriminated category details validation
    if (data.category === 'planner') {
      const res = plannerDetailsSchema.safeParse(data.categoryDetails);
      if (!res.success) {
        res.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: ['categoryDetails', ...issue.path],
          });
        });
      }
    } else if (data.category === 'performer') {
      const res = performerDetailsSchema.safeParse(data.categoryDetails);
      if (!res.success) {
        res.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: ['categoryDetails', ...issue.path],
          });
        });
      }
    } else if (data.category === 'crew') {
      const res = crewDetailsSchema.safeParse(data.categoryDetails);
      if (!res.success) {
        res.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: ['categoryDetails', ...issue.path],
          });
        });
      }
    }
  });

export type CreateRequirementInput = z.infer<typeof createRequirementSchema>;
