import React from 'react';
import { render, screen } from '@testing-library/react';
import { Splash } from '../pages/Splash';

test('renders paper trader', () => {
  render(<Splash />);
  const linkElement = screen.getByText(/Trading real stocks with fake money./i);
  expect(linkElement).toBeInTheDocument();
});

test('renders loading transactions', () => {
  render(<Splash />);
  const linkElement = screen.getByText(/Loading Transaction Activity.../i);
  expect(linkElement).toBeInTheDocument();
});
