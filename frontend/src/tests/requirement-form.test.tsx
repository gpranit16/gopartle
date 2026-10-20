import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '@/app/page';

// Mock the API calls
vi.mock('@/lib/api', () => ({
  submitRequirement: vi.fn(),
  checkBackendHealth: vi.fn().mockResolvedValue({ healthy: true }),
  fetchRequirement: vi.fn(),
}));

describe('GoPratle Requirement Posting Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Step 1 with all 3 category cards', () => {
    render(<Home />);

    expect(screen.getByText(/Step 1: Event Basics/i)).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Event Planner/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Performer/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Crew/i })).toBeInTheDocument();
  });

  it('validates required fields on Step 1 before proceeding', async () => {
    render(<Home />);

    const continueBtn = screen.getByRole('button', { name: /Continue to Step 2/i });
    fireEvent.click(continueBtn);

    await waitFor(() => {
      expect(screen.getByText(/Event name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Event location must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Event start date is required/i)).toBeInTheDocument();
    });
  });

  it('validates date range so end date cannot precede start date', async () => {
    render(<Home />);

    // Toggle multi-day
    const multiDayBtn = screen.getByRole('button', { name: /Multi-Day Range/i });
    fireEvent.click(multiDayBtn);

    const nameInput = screen.getByLabelText(/Event Name/i);
    const locInput = screen.getByLabelText(/City \/ Location/i);
    const startDateInput = screen.getByLabelText(/Start Date/i);
    const endDateInput = screen.getByLabelText(/End Date/i);

    fireEvent.change(nameInput, { target: { value: 'Tech Expo' } });
    fireEvent.change(locInput, { target: { value: 'Mumbai' } });
    fireEvent.change(startDateInput, { target: { value: '2027-11-20' } });
    fireEvent.change(endDateInput, { target: { value: '2027-11-15' } }); // preceding!

    const continueBtn = screen.getByRole('button', { name: /Continue to Step 2/i });
    fireEvent.click(continueBtn);

    await waitFor(() => {
      expect(screen.getByText(/End date must not precede start date/i)).toBeInTheDocument();
    });
  });

  it('navigates to Step 2 and renders Performer-specific fields when Performer category is chosen', async () => {
    render(<Home />);

    // Select Performer category
    const performerCard = screen.getByRole('radio', { name: /Performer/i });
    fireEvent.click(performerCard);

    // Fill valid Step 1 basics
    fireEvent.change(screen.getByLabelText(/Event Name/i), { target: { value: 'Acoustic Night' } });
    fireEvent.change(screen.getByLabelText(/City \/ Location/i), { target: { value: 'Pune' } });
    fireEvent.change(screen.getByLabelText(/Event Date/i), { target: { value: '2027-12-05' } });

    fireEvent.click(screen.getByRole('button', { name: /Continue to Step 2/i }));

    await waitFor(() => {
      expect(screen.getByText(/Step 2: Performer & Entertainment Specifications/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Performance Type & Genre/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Performance Duration/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Number of Performers/i)).toBeInTheDocument();
    });
  });

  it('navigates to Step 2 and renders Crew-specific fields when Crew category is chosen', async () => {
    render(<Home />);

    // Select Crew category
    const crewCard = screen.getByRole('radio', { name: /Crew/i });
    fireEvent.click(crewCard);

    // Fill valid Step 1 basics
    fireEvent.change(screen.getByLabelText(/Event Name/i), { target: { value: 'Music Festival 2027' } });
    fireEvent.change(screen.getByLabelText(/City \/ Location/i), { target: { value: 'Delhi' } });
    fireEvent.change(screen.getByLabelText(/Event Date/i), { target: { value: '2027-10-15' } });

    fireEvent.click(screen.getByRole('button', { name: /Continue to Step 2/i }));

    await waitFor(() => {
      expect(screen.getByText(/Step 2: Crew & Operational Staff Specifications/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Crew Role Needed/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Number of Staff/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Shift Duration/i)).toBeInTheDocument();
    });
  });

  it('preserves form data when navigating Back and Continue', async () => {
    render(<Home />);

    fireEvent.change(screen.getByLabelText(/Event Name/i), { target: { value: 'Annual Gala' } });
    fireEvent.change(screen.getByLabelText(/City \/ Location/i), { target: { value: 'Hyderabad' } });
    fireEvent.change(screen.getByLabelText(/Event Date/i), { target: { value: '2027-09-10' } });

    fireEvent.click(screen.getByRole('button', { name: /Continue to Step 2/i }));

    await waitFor(() => {
      expect(screen.getByText(/Step 2: Event Planner Specifications/i)).toBeInTheDocument();
    });

    // Go back to Step 1
    fireEvent.click(screen.getByRole('button', { name: /Back to Step 1/i }));

    await waitFor(() => {
      expect(screen.getByDisplayValue('Annual Gala')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Hyderabad')).toBeInTheDocument();
    });
  });

  it('navigates through all 4 steps and renders Review screen with entered details', async () => {
    render(<Home />);

    // Step 1
    fireEvent.change(screen.getByLabelText(/Event Name/i), { target: { value: 'Winter Conclave' } });
    fireEvent.change(screen.getByLabelText(/City \/ Location/i), { target: { value: 'Chandigarh' } });
    fireEvent.change(screen.getByLabelText(/Event Date/i), { target: { value: '2027-12-25' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue to Step 2/i }));

    // Step 2 (Planner)
    await waitFor(() => {
      expect(screen.getByText(/Step 2: Event Planner Specifications/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Continue to Step 3/i }));

    // Step 3 (Logistics & Contact)
    await waitFor(() => {
      expect(screen.getByText(/Step 3: Schedule, Logistics & Point of Contact/i)).toBeInTheDocument();
    });
    fireEvent.change(screen.getByLabelText(/Contact Full Name/i), { target: { value: 'Rahul Mehta' } });
    fireEvent.change(screen.getByLabelText(/Contact Email/i), { target: { value: 'rahul@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Review & Submit/i }));

    // Step 4 (Review)
    await waitFor(() => {
      expect(screen.getByText(/Step 4: Review Your Requirement/i)).toBeInTheDocument();
      expect(screen.getByText('Winter Conclave')).toBeInTheDocument();
      expect(screen.getByText('Chandigarh')).toBeInTheDocument();
      expect(screen.getByText('Rahul Mehta')).toBeInTheDocument();
      expect(screen.getByText('rahul@example.com')).toBeInTheDocument();
    });
  });

  it('displays error message when API submission fails', async () => {
    const { submitRequirement } = await import('@/lib/api');
    vi.mocked(submitRequirement).mockResolvedValueOnce({
      success: false,
      message: 'Database connection failed. Please try again.',
    });

    render(<Home />);

    // Step 1
    fireEvent.change(screen.getByLabelText(/Event Name/i), { target: { value: 'Tech Fest' } });
    fireEvent.change(screen.getByLabelText(/City \/ Location/i), { target: { value: 'Chennai' } });
    fireEvent.change(screen.getByLabelText(/Event Date/i), { target: { value: '2027-10-10' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue to Step 2/i }));

    // Step 2
    await waitFor(() => screen.getByRole('button', { name: /Continue to Step 3/i }));
    fireEvent.click(screen.getByRole('button', { name: /Continue to Step 3/i }));

    // Step 3
    await waitFor(() => screen.getByLabelText(/Contact Full Name/i));
    fireEvent.change(screen.getByLabelText(/Contact Full Name/i), { target: { value: 'Sita Ram' } });
    fireEvent.change(screen.getByLabelText(/Contact Email/i), { target: { value: 'sita@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Review & Submit/i }));

    // Step 4
    await waitFor(() => screen.getByRole('button', { name: /Confirm & Post Requirement/i }));
    fireEvent.click(screen.getByRole('button', { name: /Confirm & Post Requirement/i }));

    await waitFor(() => {
      expect(screen.getByText(/Database connection failed/i)).toBeInTheDocument();
    });
  });

  it('displays success confirmation with returned requirement ID when API succeeds', async () => {
    const { submitRequirement } = await import('@/lib/api');
    vi.mocked(submitRequirement).mockResolvedValueOnce({
      success: true,
      message: 'Requirement created successfully',
      data: {
        id: 'mock-mongo-id-12345678',
        category: 'planner',
        createdAt: '2027-01-01T10:00:00.000Z',
      },
    });

    render(<Home />);

    // Step 1
    fireEvent.change(screen.getByLabelText(/Event Name/i), { target: { value: 'Grand Showcase' } });
    fireEvent.change(screen.getByLabelText(/City \/ Location/i), { target: { value: 'Jaipur' } });
    fireEvent.change(screen.getByLabelText(/Event Date/i), { target: { value: '2027-11-11' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue to Step 2/i }));

    // Step 2
    await waitFor(() => screen.getByRole('button', { name: /Continue to Step 3/i }));
    fireEvent.click(screen.getByRole('button', { name: /Continue to Step 3/i }));

    // Step 3
    await waitFor(() => screen.getByLabelText(/Contact Full Name/i));
    fireEvent.change(screen.getByLabelText(/Contact Full Name/i), { target: { value: 'Ananya Roy' } });
    fireEvent.change(screen.getByLabelText(/Contact Email/i), { target: { value: 'ananya@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Review & Submit/i }));

    // Step 4
    await waitFor(() => screen.getByRole('button', { name: /Confirm & Post Requirement/i }));
    fireEvent.click(screen.getByRole('button', { name: /Confirm & Post Requirement/i }));

    await waitFor(() => {
      expect(screen.getByText(/Requirement Successfully Posted!/i)).toBeInTheDocument();
      expect(screen.getByText('mock-mongo-id-12345678')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Post Another Requirement/i })).toBeInTheDocument();
    });
  });
});
