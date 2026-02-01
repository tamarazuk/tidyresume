import { describe, it, expect } from 'vitest'
import { sanitizeFilename } from '../sanitize-filename'

describe('sanitizeFilename', () => {
  it('should return default filename for undefined input', () => {
    expect(sanitizeFilename(undefined)).toBe('resume.pdf')
  })

  it('should return default filename for empty string', () => {
    expect(sanitizeFilename('')).toBe('resume.pdf')
  })

  it('should return default filename for whitespace-only string', () => {
    expect(sanitizeFilename('   ')).toBe('resume.pdf')
  })

  it('should append .pdf if missing', () => {
    expect(sanitizeFilename('My Resume')).toBe('My Resume.pdf')
  })

  it('should not double-append .pdf if already present', () => {
    expect(sanitizeFilename('My Resume.pdf')).toBe('My Resume.pdf')
  })

  it('should handle .PDF extension (case insensitive)', () => {
    expect(sanitizeFilename('My Resume.PDF')).toBe('My Resume.PDF')
  })

  it('should remove forward slashes', () => {
    expect(sanitizeFilename('path/to/file')).toBe('pathtofile.pdf')
  })

  it('should remove backslashes', () => {
    expect(sanitizeFilename('path\\to\\file')).toBe('pathtofile.pdf')
  })

  it('should remove question marks', () => {
    expect(sanitizeFilename('file?name')).toBe('filename.pdf')
  })

  it('should remove percent signs', () => {
    expect(sanitizeFilename('file%20name')).toBe('file20name.pdf')
  })

  it('should remove asterisks', () => {
    expect(sanitizeFilename('file*name')).toBe('filename.pdf')
  })

  it('should remove colons', () => {
    expect(sanitizeFilename('file:name')).toBe('filename.pdf')
  })

  it('should remove pipes', () => {
    expect(sanitizeFilename('file|name')).toBe('filename.pdf')
  })

  it('should remove double quotes', () => {
    expect(sanitizeFilename('file"name')).toBe('filename.pdf')
  })

  it('should remove angle brackets', () => {
    expect(sanitizeFilename('file<name>')).toBe('filename.pdf')
  })

  it('should trim whitespace', () => {
    expect(sanitizeFilename('  My Resume  ')).toBe('My Resume.pdf')
  })

  it('should handle multiple invalid characters', () => {
    expect(sanitizeFilename("John's Resume <2024> | Draft")).toBe(
      "John's Resume 2024  Draft.pdf"
    )
  })

  it('should return default if only invalid characters remain', () => {
    expect(sanitizeFilename('/<>:"|?*\\')).toBe('resume.pdf')
  })

  it('should preserve valid special characters like apostrophes', () => {
    expect(sanitizeFilename("John's Resume")).toBe("John's Resume.pdf")
  })

  it('should preserve hyphens and underscores', () => {
    expect(sanitizeFilename('my-resume_2024')).toBe('my-resume_2024.pdf')
  })

  it('should preserve spaces', () => {
    expect(sanitizeFilename('My Resume 2024')).toBe('My Resume 2024.pdf')
  })
})
