/**
 * Smoke test – verifies Vitest + React Testing Library are wired up correctly.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

function Hello({ name }: { name: string }) {
  return <p>Hello, {name}!</p>;
}

describe('vitest smoke test', () => {
  it('renders a simple component', () => {
    render(<Hello name="World" />);
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
  });
});
