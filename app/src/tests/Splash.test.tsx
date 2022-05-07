import React from 'react'
import { render, screen } from '@testing-library/react'
import { Splash } from '../pages/Splash'

test('renders learn react link', () => {
  render(<Splash />)
  const linkElement = screen.getByText(/learn react/i)
  expect(linkElement).toBeInTheDocument()
})
