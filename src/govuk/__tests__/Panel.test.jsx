import React from 'react';
import { render, screen } from '@testing-library/react';
import Panel from '../Panel';

test('renders the panel with default heading', () => {
  render(<Panel title="Test title">Test body</Panel>);
  expect(screen.getByText('Test title').tagName).toBe('H1');
  expect(screen.getByText('Test body')).toBeInTheDocument();
});

test('renders the with custom heading', () => {
  render(<Panel headingLevel={2} title="Test title">Test body</Panel>);
  expect(screen.getByText('Test title').tagName).toBe('H2');
  expect(screen.getByText('Test body')).toBeInTheDocument();
});
