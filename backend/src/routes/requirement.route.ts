import { Router } from 'express';
import {
  createRequirement,
  getRequirementById,
  listRecentRequirements,
} from '../controllers/requirement.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createRequirementSchema } from '../validators/requirement.validator.js';
import { submissionLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Public requirement submission with dedicated rate limiting and server validation
router.post(
  '/',
  submissionLimiter,
  validateRequest(createRequirementSchema),
  createRequirement
);

// Fetch a requirement by id
router.get('/:id', getRequirementById);

// List recent requirements (for verification & debug)
router.get('/', listRecentRequirements);

export default router;
