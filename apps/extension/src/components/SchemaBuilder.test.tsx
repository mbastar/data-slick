import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SchemaBuilder } from './SchemaBuilder'

describe('SchemaBuilder', () => {
  it('renders empty state message when no fields exist', () => {
    const mockOnChange = vi.fn()
    render(<SchemaBuilder schema={{}} onChange={mockOnChange} />)
    
    expect(screen.getByText('No fields defined. Add a field to get started.')).toBeInTheDocument()
  })

  it('adds a new field when clicking Add Field button', () => {
    const mockOnChange = vi.fn()
    render(<SchemaBuilder schema={{}} onChange={mockOnChange} />)
    
    const input = screen.getByPlaceholderText('New field name')
    const button = screen.getByText('Add Field')
    
    fireEvent.change(input, { target: { value: 'test-field' } })
    fireEvent.click(button)
    
    expect(mockOnChange).toHaveBeenCalledWith({ 'test-field': 'string' })
  })

  it('prevents duplicate field names', () => {
    const mockOnChange = vi.fn()
    const existingSchema = { 'existing-field': 'string' }
    
    render(<SchemaBuilder schema={existingSchema} onChange={mockOnChange} />)
    
    const input = screen.getByPlaceholderText('New field name')
    const button = screen.getByText('Add Field')
    
    fireEvent.change(input, { target: { value: 'existing-field' } })
    fireEvent.click(button)
    
    // Should not call onChange because field already exists
    expect(mockOnChange).not.toHaveBeenCalled()
  })
})