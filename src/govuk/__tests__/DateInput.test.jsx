import React from 'react';
import { render, screen } from '@testing-library/react';
import DateInput from '../DateInput';

test('renders all date inputs', () => {
  render(<DateInput hint="Test hint" legend="Test legend" errorMessage="Test error" id="testId" />);
  expect(screen.getByText('Test legend')).toBeInTheDocument();
  expect(screen.getByText('Test hint')).toBeInTheDocument();
  expect(screen.getByText('Test error')).toBeInTheDocument();
  expect(screen.getByLabelText('Day')).toBeInTheDocument();
  expect(screen.getByLabelText('Month')).toBeInTheDocument();
  expect(screen.getByLabelText('Year')).toBeInTheDocument();
});

test('renders date inputs without a day', () => {
  render(<DateInput dayInput={null} id="testId" />);
  expect(screen.queryByLabelText('Day')).toBeNull();
  expect(screen.getByLabelText('Month')).toBeInTheDocument();
  expect(screen.getByLabelText('Year')).toBeInTheDocument();
});
