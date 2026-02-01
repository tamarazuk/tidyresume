import { describe, it, expect } from 'vitest'
import { renderResumeHtml } from '../render-resume-html'

describe('renderResumeHtml', () => {
  describe('basic markdown rendering', () => {
    it('renders a simple heading', () => {
      const markdown = '# Hello World'
      const html = renderResumeHtml(markdown)

      expect(html).toContain('<h1')
      expect(html).toContain('Hello World')
      expect(html).toContain('</h1>')
    })

    it('renders paragraphs', () => {
      const markdown = 'This is a paragraph.'
      const html = renderResumeHtml(markdown)

      expect(html).toContain('<p>')
      expect(html).toContain('This is a paragraph.')
      expect(html).toContain('</p>')
    })

    it('renders bold and italic text', () => {
      const markdown = '**bold** and *italic*'
      const html = renderResumeHtml(markdown)

      expect(html).toContain('<strong>bold</strong>')
      expect(html).toContain('<em>italic</em>')
    })

    it('renders unordered lists', () => {
      const markdown = '- Item 1\n- Item 2\n- Item 3'
      const html = renderResumeHtml(markdown)

      expect(html).toContain('<ul>')
      expect(html).toContain('<li>')
      expect(html).toContain('Item 1')
      expect(html).toContain('Item 2')
      expect(html).toContain('Item 3')
    })

    it('renders links with target blank', () => {
      const markdown = '[Example](https://example.com)'
      const html = renderResumeHtml(markdown)

      expect(html).toContain('href="https://example.com"')
      expect(html).toContain('target="_blank"')
      expect(html).toContain('rel="noopener noreferrer"')
    })
  })

  describe('custom resume plugins', () => {
    it('renders page breaks with /// syntax', () => {
      const markdown = 'Before\n\n///\n\nAfter'
      const html = renderResumeHtml(markdown)

      expect(html).toContain('class="resume-page-break page-break"')
    })

    it('renders page breaks with [[PAGEBREAK]] syntax', () => {
      const markdown = 'Before\n\n[[PAGEBREAK]]\n\nAfter'
      const html = renderResumeHtml(markdown)

      expect(html).toContain('class="resume-page-break page-break"')
    })

    it('renders accent dividers with +++ syntax', () => {
      const markdown = 'Before\n\n+++\n\nAfter'
      const html = renderResumeHtml(markdown)

      expect(html).toContain('class="divider--accent"')
    })

    it('renders accent dividers with [[HR:accent]] syntax', () => {
      const markdown = 'Before\n\n[[HR:accent]]\n\nAfter'
      const html = renderResumeHtml(markdown)

      expect(html).toContain('class="divider--accent"')
    })

    it('renders split lines with || syntax', () => {
      const markdown = '**Software Engineer** @ Google || *2020 — Present*'
      const html = renderResumeHtml(markdown)

      expect(html).toContain('class="split-line"')
      expect(html).toContain('class="split-line__left"')
      expect(html).toContain('class="split-line__right"')
      expect(html).toContain('Software Engineer')
      expect(html).toContain('2020 — Present')
    })
  })

  describe('HTML structure', () => {
    it('returns a complete HTML document', () => {
      const html = renderResumeHtml('# Test')

      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('<html lang="en">')
      expect(html).toContain('<head>')
      expect(html).toContain('<body>')
      expect(html).toContain('</html>')
    })

    it('includes Google Fonts link', () => {
      const html = renderResumeHtml('# Test')

      expect(html).toContain('fonts.googleapis.com')
      expect(html).toContain('Geologica')
      expect(html).toContain('Noto+Sans')
    })

    it('includes resume content wrapper', () => {
      const html = renderResumeHtml('# Test')

      expect(html).toContain('class="resume-content"')
    })

    it('includes ATS-safe letter-spacing override', () => {
      const html = renderResumeHtml('# Test')

      expect(html).toContain('letter-spacing: normal !important')
      expect(html).toContain('font-kerning: none !important')
    })
  })

  describe('theme options', () => {
    it('applies custom accent color', () => {
      const html = renderResumeHtml('# Test', { accentColor: 'teal' })

      expect(html).toContain('#0d9488') // teal color
    })

    it('defaults to indigo accent color', () => {
      const html = renderResumeHtml('# Test')

      expect(html).toContain('#4f46e5') // indigo color
    })

    it('applies custom heading font', () => {
      const html = renderResumeHtml('# Test', { headingFont: 'ibm-plex-serif' })

      expect(html).toContain('IBM Plex Serif')
    })

    it('applies custom body font', () => {
      const html = renderResumeHtml('# Test', { bodyFont: 'source-serif-4' })

      expect(html).toContain('Source Serif 4')
    })

    it('applies custom body size', () => {
      const html = renderResumeHtml('# Test', { bodySize: '14px' })

      expect(html).toContain('--resume-body-size: 14px')
    })

    it('applies custom heading scale', () => {
      const html = renderResumeHtml('# Test', { headingScale: '1.2' })

      expect(html).toContain('--resume-heading-scale: 1.2')
    })

    it('applies custom body leading', () => {
      const html = renderResumeHtml('# Test', { bodyLeading: '1.8' })

      expect(html).toContain('--resume-body-leading: 1.8')
    })
  })

  describe('edge cases', () => {
    it('handles empty markdown', () => {
      const html = renderResumeHtml('')

      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('class="resume-content"')
    })

    it('handles markdown with special characters', () => {
      const markdown = '# Test & "quotes" <brackets>'
      const html = renderResumeHtml(markdown)

      expect(html).toContain('Test')
      // HTML entities should be present
      expect(html).toMatch(/&amp;|&/)
    })

    it('handles nested formatting', () => {
      const markdown = '***bold and italic***'
      const html = renderResumeHtml(markdown)

      expect(html).toContain('<strong>')
      expect(html).toContain('<em>')
    })

    it('handles multiple headings at different levels', () => {
      const markdown = '# H1\n## H2\n### H3\n#### H4'
      const html = renderResumeHtml(markdown)

      expect(html).toContain('<h1')
      expect(html).toContain('<h2')
      expect(html).toContain('<h3')
      expect(html).toContain('<h4')
    })
  })
})
