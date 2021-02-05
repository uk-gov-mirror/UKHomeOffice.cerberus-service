import React from 'react';
import { render, screen } from '@testing-library/react';
import Details from '../Details';

test('renders the closed details', () => {
  render(<Details summary="Test summary">Test body</Details>);
  expect(screen.getByText('Test summary')).toBeInTheDocument();
  expect(screen.getByText('Test body')).not.toBeVisible();
});

test('renders the open details', () => {
  render(<Details open summary="Test summary">Test body</Details>);
  expect(screen.getByText('Test summary')).toBeInTheDocument();
  expect(screen.getByText('Test body')).toBeVisible();
});
