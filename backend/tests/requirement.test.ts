import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'express';
import { createApp } from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { Requirement } from '../src/models/requirement.model.js';

describe('Requirements API Integration Tests', () => {
  const app = createApp();
  const createdIds: string[] = [];

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    // Clean up test documents created during testing
    if (createdIds.length > 0) {
      await Requirement.deleteMany({ _id: { $in: createdIds } });
    }
    await disconnectDB();
  });

  it('POST /api/requirements - should create a valid Planner requirement (HTTP 201)', async () => {
    const payload = {
      eventName: 'Grand Gala 2027',
      eventType: 'Corporate Event',
      date: {
        startDate: '2027-06-15',
        endDate: '2027-06-16',
      },
      location: 'Bangalore Tech Park',
      venue: 'Main Auditorium',
      category: 'planner',
      categoryDetails: {
        servicesRequired: ['Venue Management', 'Catering Coordination', 'Guest Reception'],
        expectedAttendees: 300,
        eventScale: 'Large (250-1000)',
        budgetMin: 50000,
        budgetMax: 100000,
        additionalRequirements: 'Need dedicated stage lighting coordinator',
      },
      additionalDetails: {
        preferredTimeWindow: 'Morning to Evening',
        venueType: 'indoor',
        equipmentFacilities: 'Microphones, projector screen',
        additionalNotes: 'Strict timeline required',
        contactName: 'Alice Sharma',
        contactEmail: 'alice@example.com',
        contactPhone: '+91 9876543210',
      },
    };

    const res = await request(app).post('/api/requirements').send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.category).toBe('planner');
    createdIds.push(res.body.data.id);
  });

  it('POST /api/requirements - should create a valid Performer requirement (HTTP 201)', async () => {
    const payload = {
      eventName: 'Summer Music Fest',
      eventType: 'Concert',
      date: {
        startDate: '2027-07-20',
      },
      location: 'Goa Beachfront',
      category: 'performer',
      categoryDetails: {
        performanceType: 'Acoustic Rock Band',
        durationMinutes: 90,
        performerCount: 4,
        budgetMin: 30000,
        budgetMax: 60000,
        technicalRequirements: 'PA system, drum kit, 3 DI boxes',
      },
      additionalDetails: {
        venueType: 'outdoor',
        contactName: 'Bob Dylan',
        contactEmail: 'bob@example.com',
      },
    };

    const res = await request(app).post('/api/requirements').send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.category).toBe('performer');
    createdIds.push(res.body.data.id);
  });

  it('POST /api/requirements - should create a valid Crew requirement (HTTP 201)', async () => {
    const payload = {
      eventName: 'Film Screening & Panel',
      eventType: 'Festival',
      date: {
        startDate: '2027-08-10',
        endDate: '2027-08-10',
      },
      location: 'Mumbai Film City',
      category: 'crew',
      categoryDetails: {
        crewRole: 'Lighting Technician',
        crewCount: 3,
        shiftHours: 8,
        budgetMin: 15000,
        budgetMax: 25000,
        experienceLevel: 'Mid Level',
        additionalInstructions: 'Experience with DMX consoles required',
      },
      additionalDetails: {
        contactName: 'Charlie Roy',
        contactEmail: 'charlie@example.com',
      },
    };

    const res = await request(app).post('/api/requirements').send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.category).toBe('crew');
    createdIds.push(res.body.data.id);
  });

  it('POST /api/requirements - should reject invalid category (HTTP 400)', async () => {
    const res = await request(app).post('/api/requirements').send({
      eventName: 'Invalid Test',
      eventType: 'Wedding',
      date: { startDate: '2027-09-01' },
      location: 'Delhi',
      category: 'caterer', // invalid category
      categoryDetails: {},
      additionalDetails: {
        contactName: 'Test',
        contactEmail: 'test@example.com',
      },
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/requirements - should reject missing required fields (HTTP 400)', async () => {
    const res = await request(app).post('/api/requirements').send({
      // missing eventName, date, category
      location: 'Delhi',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('POST /api/requirements - should reject end date preceding start date (HTTP 400)', async () => {
    const res = await request(app).post('/api/requirements').send({
      eventName: 'Date Error Test',
      eventType: 'Wedding',
      date: {
        startDate: '2027-09-10',
        endDate: '2027-09-05', // precedes startDate!
      },
      location: 'Delhi',
      category: 'planner',
      categoryDetails: {
        servicesRequired: ['Planning'],
        expectedAttendees: 50,
        eventScale: 'Small (Under 50)',
        budgetMin: 10000,
        budgetMax: 20000,
      },
      additionalDetails: {
        contactName: 'Dave',
        contactEmail: 'dave@example.com',
      },
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    const dateErr = res.body.errors.find((e: any) => e.field.includes('date'));
    expect(dateErr).toBeDefined();
  });

  it('POST /api/requirements - should reject budgetMax < budgetMin (HTTP 400)', async () => {
    const res = await request(app).post('/api/requirements').send({
      eventName: 'Budget Inverted Test',
      eventType: 'Wedding',
      date: { startDate: '2027-10-01' },
      location: 'Delhi',
      category: 'planner',
      categoryDetails: {
        servicesRequired: ['Planning'],
        expectedAttendees: 100,
        eventScale: 'Medium (50-250)',
        budgetMin: 50000,
        budgetMax: 20000, // less than budgetMin!
      },
      additionalDetails: {
        contactName: 'Dave',
        contactEmail: 'dave@example.com',
      },
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    const budgetErr = res.body.errors.find((e: any) => e.field.includes('budgetMax'));
    expect(budgetErr).toBeDefined();
  });

  it('POST /api/requirements - should reject invalid email address (HTTP 400)', async () => {
    const res = await request(app).post('/api/requirements').send({
      eventName: 'Email Test',
      eventType: 'Wedding',
      date: { startDate: '2027-10-01' },
      location: 'Delhi',
      category: 'planner',
      categoryDetails: {
        servicesRequired: ['Planning'],
        expectedAttendees: 100,
        eventScale: 'Medium (50-250)',
        budgetMin: 20000,
        budgetMax: 50000,
      },
      additionalDetails: {
        contactName: 'Dave',
        contactEmail: 'not-a-valid-email', // invalid!
      },
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    const emailErr = res.body.errors.find((e: any) => e.field.includes('contactEmail'));
    expect(emailErr).toBeDefined();
  });

  it('GET /api/requirements/:id - should fetch saved requirement and return 200', async () => {
    const testId = createdIds[0];
    const res = await request(app).get(`/api/requirements/${testId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(testId);
    expect(res.body.data.eventName).toBe('Grand Gala 2027');
  });

  it('GET /api/requirements/:id - should return 400 for malformed ObjectId', async () => {
    const res = await request(app).get('/api/requirements/invalid-mongo-id');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Invalid requirement ID');
  });

  it('GET /api/requirements/:id - should return 404 for non-existent ObjectId', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const res = await request(app).get(`/api/requirements/${fakeId}`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('not found');
  });
});
