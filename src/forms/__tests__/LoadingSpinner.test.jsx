import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

test('shows spinner with prop loading=true', () => {
  render(<LoadingSpinner loading>Test</LoadingSpinner>);
  expect(screen.getByText('Loading')).toBeInTheDocument();
  expect(screen.getByText('Test')).toBeInTheDocument();
});

test('hides spinner with prop loading=false', () => {
  render(<LoadingSpinner loading={false}>Test</LoadingSpinner>);
  expect(screen.queryByText('Loading')).toBeNull();
  expect(screen.getByText('Test')).toBeInTheDocument();
});
