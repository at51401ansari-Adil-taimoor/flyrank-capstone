/**
 * Tests for the SignupPage form validation.
 *
 * Step 3: form validation tests.
 * Queries use getByLabelText / getByRole / getByText – never CSS class or testid.
 * No real API is called (form submission is fully client-side).
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignupPage from '@/app/signup/page';

describe('SignupPage – form rendering', () => {
  it('renders Email and Password labeled inputs', () => {
    render(<SignupPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders the Sign Up submit button', () => {
    render(<SignupPage />);
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });
});

describe('SignupPage – validation errors on empty submit', () => {
  it('shows "Email is required" when email is empty', async () => {
    const user = userEvent.setup();
    render(<SignupPage />);
    await user.click(screen.getByRole('button', { name: /sign up/i }));
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });

  it('shows "Password is required" when password is empty', async () => {
    const user = userEvent.setup();
    render(<SignupPage />);
    await user.click(screen.getByRole('button', { name: /sign up/i }));
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it('shows invalid email error when email is malformed', async () => {
    const user = userEvent.setup();
    render(<SignupPage />);
    await user.type(screen.getByLabelText(/email/i), 'not-an-email');
    await user.click(screen.getByRole('button', { name: /sign up/i }));
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
  });

  it('shows password too short error when password < 8 chars', async () => {
    const user = userEvent.setup();
    render(<SignupPage />);
    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'short');
    await user.click(screen.getByRole('button', { name: /sign up/i }));
    expect(await screen.findByText(/at least 8 characters/i)).toBeInTheDocument();
  });
});

describe('SignupPage – successful submission', () => {
  it('shows success message when valid email and password are entered', async () => {
    const user = userEvent.setup();
    render(<SignupPage />);
    await user.type(screen.getByLabelText(/email/i), 'valid@example.com');
    await user.type(screen.getByLabelText(/password/i), 'securepassword');
    await user.click(screen.getByRole('button', { name: /sign up/i }));
    expect(await screen.findByText(/account created successfully/i)).toBeInTheDocument();
  });
});
