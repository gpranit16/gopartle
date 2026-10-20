import { test, expect } from '@playwright/test';

test.describe('GoPratle Requirement Posting Flow E2E', () => {
  test('Critical Validation: Step 1 prevents empty continue and invalid date range', async ({ page }) => {
    await page.goto('/');

    // Verify initial header and elements
    await expect(page.locator('h1')).toContainText('Post Your Event Requirement');

    // Attempt to continue without entering data
    await page.getByRole('button', { name: /Continue to Step 2/i }).click();

    // Verify validation errors appear
    await expect(page.getByText('Event name must be at least 2 characters')).toBeVisible();
    await expect(page.getByText('Event location must be at least 2 characters')).toBeVisible();

    // Test invalid date range
    await page.getByRole('button', { name: /Multi-Day Range/i }).click();
    await page.getByLabel(/Event Name/i).fill('Invalid Date Event');
    await page.getByLabel(/City \/ Location/i).fill('Bengaluru');
    await page.getByLabel(/Start Date/i).fill('2027-10-20');
    await page.getByLabel(/End Date/i).fill('2027-10-10'); // precedes start date!

    await page.getByRole('button', { name: /Continue to Step 2/i }).click();
    await expect(page.getByText('End date must not precede start date')).toBeVisible();
  });

  test('Happy Path: Performer requirement full end-to-end flow with real submission', async ({ page }) => {
    await page.goto('/');

    // 1. Step 1: Select Performer
    await page.getByRole('radio', { name: /Performer/i }).click();
    await page.getByLabel(/Event Name/i).fill('E2E Live Rock Festival');
    await page.getByLabel(/Event Type/i).selectOption('Festival');
    await page.getByLabel(/Event Date/i).fill('2027-11-20');
    await page.getByLabel(/City \/ Location/i).fill('Bengaluru');
    await page.getByLabel(/Specific Venue/i).fill('Palace Grounds');

    await page.getByRole('button', { name: /Continue to Step 2/i }).click();

    // 2. Step 2: Performer specifications
    await expect(page.locator('h2')).toContainText('Performer & Entertainment Specifications');
    await page.getByLabel(/Performance Type & Genre/i).fill('Alternative Rock Band');
    await page.getByLabel(/Performance Duration/i).fill('90');
    await page.getByLabel(/Number of Performers/i).fill('4');

    await page.getByRole('button', { name: /Continue to Step 3/i }).click();

    // 3. Step 3: Logistics & Contact
    await expect(page.locator('h2')).toContainText('Logistics & Point of Contact');
    await page.getByLabel(/Preferred Time/i).fill('Evening 7:00 PM to 10:00 PM');
    await page.getByRole('button', { name: /Outdoor Grounds/i }).click();
    await page.getByLabel(/Contact Full Name/i).fill('Vikram Malhotra');
    await page.getByLabel(/Contact Email/i).fill('vikram.e2e@example.com');
    await page.getByLabel(/Phone Number/i).fill('+91 9988776655');

    await page.getByRole('button', { name: /Review & Submit/i }).click();

    // 4. Step 4: Review Screen
    await expect(page.locator('h2')).toContainText('Review Your Requirement');
    await expect(page.getByText('E2E Live Rock Festival')).toBeVisible();
    await expect(page.getByText('Alternative Rock Band')).toBeVisible();
    await expect(page.getByText('Vikram Malhotra')).toBeVisible();

    // 5. Submit form
    await page.getByRole('button', { name: /Confirm & Post Requirement/i }).click();

    // 6. Verify Confirmation Screen and returned MongoDB Requirement ID
    await expect(page.getByText('Requirement Successfully Posted!')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Requirement ID (MongoDB ObjectId)')).toBeVisible();
    await expect(page.getByRole('button', { name: /Post Another Requirement/i })).toBeVisible();
  });

  test('Alternative Category: Crew requirement flow', async ({ page }) => {
    await page.goto('/');

    // 1. Step 1: Select Crew
    await page.getByRole('radio', { name: /Crew/i }).click();
    await page.getByLabel(/Event Name/i).fill('Film Premiere Red Carpet');
    await page.getByLabel(/Event Type/i).selectOption('Corporate Event');
    await page.getByLabel(/Event Date/i).fill('2027-12-10');
    await page.getByLabel(/City \/ Location/i).fill('Mumbai');

    await page.getByRole('button', { name: /Continue to Step 2/i }).click();

    // 2. Step 2: Crew specifications
    await expect(page.locator('h2')).toContainText('Crew & Operational Staff Specifications');
    await page.getByLabel(/Crew Role Needed/i).fill('Boom Mic & Sound Tech');
    await page.getByLabel(/Number of Staff/i).fill('2');
    await page.getByLabel(/Shift Duration/i).fill('6');

    await page.getByRole('button', { name: /Continue to Step 3/i }).click();

    // 3. Step 3: Contact
    await page.getByLabel(/Contact Full Name/i).fill('Rohan Joshi');
    await page.getByLabel(/Contact Email/i).fill('rohan@example.com');

    await page.getByRole('button', { name: /Review & Submit/i }).click();

    // 4. Verify Review
    await expect(page.getByText('Film Premiere Red Carpet')).toBeVisible();
    await expect(page.getByText('Boom Mic & Sound Tech')).toBeVisible();
  });
});
