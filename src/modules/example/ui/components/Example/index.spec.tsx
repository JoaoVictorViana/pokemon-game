/** @jest-environment jsdom */
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { ExampleComponent } from '.'

describe('Example default', () => {
  it('Modo Default', () => {
    const exampleId = 'example-test'

    render(<ExampleComponent />)

    const exampleUI = screen.getByTestId(exampleId)

    expect(exampleUI).toBeInTheDocument()
    expect(exampleUI).toHaveProperty('tagName', 'DIV')
  })
})
