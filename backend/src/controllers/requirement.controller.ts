import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Requirement } from '../models/requirement.model.js';
import { AppError } from '../middleware/errorHandler.js';

export const createRequirement = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // If MongoDB is disconnected, fail fast with a descriptive error
    if (mongoose.connection.readyState !== 1) {
      throw new AppError('Database service unavailable. Please try again later.', 503);
    }

    const newRequirement = await Requirement.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Requirement created successfully',
      data: {
        id: newRequirement.id,
        category: newRequirement.category,
        createdAt: newRequirement.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getRequirementById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid requirement ID format', 400);
    }

    const requirement = await Requirement.findById(id);

    if (!requirement) {
      throw new AppError('Requirement not found', 404);
    }

    res.status(200).json({
      success: true,
      data: requirement.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

export const listRecentRequirements = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const requirements = await Requirement.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .select('eventName eventType category date location createdAt');

    res.status(200).json({
      success: true,
      count: requirements.length,
      data: requirements,
    });
  } catch (error) {
    next(error);
  }
};
