import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

test('shows spinner with prop loading=true', () => {
  render(<LoadingSpinner loading={true}>Test</LoadingSpinner>);
  expect(screen.getByText('Loading')).toBeInTheDOM();
  expect(screen.getByText('Test')).toBeInTheDOM();
});

test('hides spinner with prop loading=false', () => {
  render(<LoadingSpinner loading={false}>Test</LoadingSpinner>);
  expect(screen.queryByText('Loading')).toBeNull();
  expect(screen.getByText('Test')).toBeInTheDOM();
});
