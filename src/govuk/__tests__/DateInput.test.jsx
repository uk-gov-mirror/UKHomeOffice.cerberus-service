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

test('renders custom inputs', () => {
  render(
    <DateInput
      inputs={{
        hour: {
          label: 'Hour',
          name: 'hour',
          placeholder: 'HH',
        },
      }}
      id="testId"
    />,
  );
  expect(screen.getByLabelText('Hour')).toBeInTheDocument();
  expect(screen.queryByLabelText('Day')).toBeNull();
  expect(screen.queryByLabelText('Month')).toBeNull();
  expect(screen.queryByLabelText('Year')).toBeNull();
});
