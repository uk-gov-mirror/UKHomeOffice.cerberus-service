import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../Header';

test('renders the header with nav links', () => {
  render(<Header />);
  const bannerText = screen.getByRole('banner').textContent;
  expect(bannerText).toContain('Cerberus');
  expect(bannerText).toContain('powered by the Central Operations Platform');
  expect(screen.getByText('Issue a target'))
    .toHaveAttribute('href', '/issue-target');
  expect(screen.getByText('Sign out'))
    .toHaveAttribute('href', 'http://example.com/logout');
});
