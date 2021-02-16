import React from 'react';
import { render, screen } from '@testing-library/react';
import Accordion from '../Accordion';

test('renders the accordion', () => {
  render(<Accordion
    id="test-id"
    items={[
      {
        heading: 'Test heading 1',
        summary: 'Test summary 1',
        children: 'Test children 1',
      },
      {
        heading: 'Test heading 2',
        summary: 'Test summary 2',
        children: 'Test children 2',
      },
    ]}
  />);
  expect(screen.getByText('Test heading 1')).toBeInTheDocument();
  expect(screen.getByText('Test summary 1')).toBeInTheDocument();
  expect(screen.getByText('Test children 1')).toBeInTheDocument();
  expect(screen.getByText('Test heading 2')).toBeInTheDocument();
  expect(screen.getByText('Test summary 2')).toBeInTheDocument();
  expect(screen.getByText('Test children 2')).toBeInTheDocument();
});
