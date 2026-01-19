import { describe, expect, it } from 'vitest'
import MarkdownIt from 'markdown-it'
import { configureMarkdownIt } from '../editor-extensions'

const PAGE_BREAK_HTML = '<div class="resume-page-break page-break"></div>'
const ACCENT_RULE_HTML = '<hr class="divider--accent" />'

const createMarkdown = () => {
  const md = new MarkdownIt()
  configureMarkdownIt(md as Parameters<typeof configureMarkdownIt>[0], {
    editorId: 'test-editor',
  })
  return md
}

describe('configureMarkdownIt', () => {
  it('renders page break shorthand and verbose syntax', () => {
    const md = createMarkdown()

    expect(md.render('///')).toContain(PAGE_BREAK_HTML)
    expect(md.render('[[PAGEBREAK]]')).toContain(PAGE_BREAK_HTML)
  })

  it('renders accent rule shorthand and verbose syntax', () => {
    const md = createMarkdown()

    expect(md.render('+++')).toContain(ACCENT_RULE_HTML)
    expect(md.render('[[HR:accent]]')).toContain(ACCENT_RULE_HTML)
  })

  it('renders split lines with inline markdown', () => {
    const md = createMarkdown()

    const html = md.render('**Role** || 2020')
    expect(html).toContain('class="split-line"')
    expect(html).toContain('class="split-line__left"')
    expect(html).toContain('<strong>Role</strong>')
    expect(html).toContain('class="split-line__right"')
    expect(html).toContain('>2020<')
  })

  it('does not transform split lines when the divider is escaped', () => {
    const md = createMarkdown()

    const html = md.render('Left \\|\\| Right')
    expect(html).not.toContain('split-line')
  })

  it('does not render accent rules inline', () => {
    const md = createMarkdown()

    const html = md.render('Hello +++ world')
    expect(html).not.toContain('divider--accent')
  })

  it('does not transform split lines with missing sides', () => {
    const md = createMarkdown()

    expect(md.render('Left ||')).not.toContain('split-line')
    expect(md.render('|| Right')).not.toContain('split-line')
  })
})
