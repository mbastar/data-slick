import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders visual data extractor heading', () => {
    render(<App />)
    expect(screen.getByText('Visual Data Extractor')).toBeInTheDocument()
  })

  it('renders all form sections', () => {
    render(<App />)
    expect(screen.getByText('Data Schema')).toBeInTheDocument()
    expect(screen.getByText('Extraction Prompt')).toBeInTheDocument()
    expect(screen.getByText('Webhook URL')).toBeInTheDocument()
    expect(screen.getByText('Extract Data')).toBeInTheDocument()
  })
})