import { vi } from 'vitest'
import '@testing-library/jest-dom'

if (!URL.createObjectURL) {
  URL.createObjectURL = vi.fn(() => 'blob:mock-url')
}

if (!URL.revokeObjectURL) {
  URL.revokeObjectURL = vi.fn()
}
