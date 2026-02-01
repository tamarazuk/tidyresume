import MarkdownIt from 'markdown-it'
import { imgSize } from '@mdit/plugin-img-size'
import { sanitizeHtml } from './sanitize-html'

type MarkdownItInstance = MarkdownIt

const PAGE_BREAK_REGEX = /^(?:\[\[PAGEBREAK\]\]|\/\/\/)$/i
const ACCENT_RULE_REGEX = /^(?:\[\[HR:accent\]\]|\+\+\+)$/i

const PAGE_BREAK_HTML = '<div class="resume-page-break page-break"></div>'
const ACCENT_RULE_HTML = '<hr class="divider--accent" />'

function isEscaped(value: string, index: number) {
  let backslashCount = 0
  for (let i = index - 1; i >= 0; i -= 1) {
    if (value[i] !== '\\') break
    backslashCount += 1
  }
  return backslashCount % 2 === 1
}

function findUnescapedSplitIndex(value: string) {
  for (let i = 0; i < value.length - 1; i += 1) {
    if (value[i] !== '|' || value[i + 1] !== '|') continue
    if (isEscaped(value, i) || isEscaped(value, i + 1)) continue
    return i
  }
  return -1
}

function parseSplitLine(value: string) {
  if (value.includes('\n')) return null
  const trimmed = value.trim()
  if (!trimmed) return null
  if (PAGE_BREAK_REGEX.test(trimmed) || ACCENT_RULE_REGEX.test(trimmed)) {
    return null
  }

  let inner = trimmed
  if (inner.startsWith('[[') && inner.endsWith(']]')) {
    inner = inner.slice(2, -2).trim()
  }

  const splitIndex = findUnescapedSplitIndex(inner)
  if (splitIndex < 0) return null

  const left = inner.slice(0, splitIndex).trim()
  const right = inner.slice(splitIndex + 2).trim()
  if (!left || !right) return null

  return { left, right }
}

function resumeShorthandBlockPlugin(md: MarkdownItInstance) {
  md.block.ruler.before(
    'blockquote',
    'resume_shorthand',
    (state, startLine, _endLine, silent) => {
      if (state.sCount[startLine] - state.blkIndent >= 4) return false
      const pos = state.bMarks[startLine] + state.tShift[startLine]
      const max = state.eMarks[startLine]
      if (pos >= max) return false

      const line = state.src.slice(pos, max)
      const trimmed = line.trim()
      if (!trimmed) return false

      if (!PAGE_BREAK_REGEX.test(trimmed) && !ACCENT_RULE_REGEX.test(trimmed)) {
        return false
      }

      if (silent) return true

      const token = state.push('html_block', '', 0)
      token.block = true
      token.map = [startLine, startLine + 1]
      token.content = PAGE_BREAK_REGEX.test(trimmed)
        ? PAGE_BREAK_HTML
        : ACCENT_RULE_HTML

      state.line = startLine + 1
      return true
    }
  )
}

function resumePageBreakPlugin(md: MarkdownItInstance) {
  md.core.ruler.after('block', 'resume_page_break', (state) => {
    for (let index = 0; index < state.tokens.length; index += 1) {
      const token = state.tokens[index]
      if (token.type === 'html_block') {
        if (PAGE_BREAK_REGEX.test(token.content.trim())) {
          token.content = PAGE_BREAK_HTML
        }
        continue
      }

      if (token.type !== 'inline') continue
      if (!PAGE_BREAK_REGEX.test(token.content.trim())) continue

      const prevToken = state.tokens[index - 1]
      const nextToken = state.tokens[index + 1]
      if (!prevToken || !nextToken) continue
      if (prevToken.type !== 'paragraph_open') continue
      if (nextToken.type !== 'paragraph_close') continue

      const htmlToken = new state.Token('html_block', '', 0)
      htmlToken.content = PAGE_BREAK_HTML
      htmlToken.block = true
      htmlToken.map = token.map

      state.tokens.splice(index - 1, 3, htmlToken)
      index -= 1
    }
  })
}

function resumeSplitLinePlugin(md: MarkdownItInstance) {
  md.core.ruler.after('block', 'resume_split_line', (state) => {
    for (let index = 0; index < state.tokens.length; index += 1) {
      const token = state.tokens[index]
      if (token.type !== 'inline') continue

      const prevToken = state.tokens[index - 1]
      const nextToken = state.tokens[index + 1]
      if (!prevToken || !nextToken) continue
      if (prevToken.type !== 'paragraph_open') continue
      if (nextToken.type !== 'paragraph_close') continue

      const content = token.content
      const lines = content.split('\n')

      const hasSplitLine = lines.some((line) => parseSplitLine(line))
      if (!hasSplitLine) continue

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newTokens: any[] = []
      let currentParaLines: string[] = []

      for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i]
        const split = parseSplitLine(line)

        if (split) {
          if (currentParaLines.length > 0) {
            const pOpen = new state.Token('paragraph_open', 'p', 1)
            const textToken = new state.Token('inline', '', 0)
            textToken.content = currentParaLines.join('\n')
            textToken.children = []
            if (token.map && newTokens.length === 0) {
              pOpen.map = [token.map[0], token.map[0] + currentParaLines.length]
              textToken.map = pOpen.map
            }
            const pClose = new state.Token('paragraph_close', 'p', -1)
            newTokens.push(pOpen, textToken, pClose)
            currentParaLines = []
          }

          const leftHtml = md.renderInline(split.left)
          const rightHtml = md.renderInline(split.right)
          const htmlToken = new state.Token('html_block', '', 0)
          htmlToken.content = `<div class="split-line"><div class="split-line__left">${leftHtml}</div><div class="split-line__right">${rightHtml}</div></div>`
          htmlToken.block = true
          newTokens.push(htmlToken)
        } else {
          currentParaLines.push(line)
        }
      }

      if (currentParaLines.length > 0) {
        const pOpen = new state.Token('paragraph_open', 'p', 1)
        const textToken = new state.Token('inline', '', 0)
        textToken.content = currentParaLines.join('\n')
        textToken.children = []
        if (token.map) {
          const start = token.map[0] + lines.length - currentParaLines.length
          pOpen.map = [start, token.map[1]]
          textToken.map = pOpen.map
        }
        const pClose = new state.Token('paragraph_close', 'p', -1)
        newTokens.push(pOpen, textToken, pClose)
      }

      state.tokens.splice(index - 1, 3, ...newTokens)
      index += newTokens.length - 3
    }
  })
}

function resumeAccentRulePlugin(md: MarkdownItInstance) {
  md.core.ruler.after('block', 'resume_accent_rule', (state) => {
    for (let index = 0; index < state.tokens.length; index += 1) {
      const token = state.tokens[index]
      if (token.type === 'html_block') {
        if (ACCENT_RULE_REGEX.test(token.content.trim())) {
          token.content = ACCENT_RULE_HTML
        }
        continue
      }

      if (token.type !== 'inline') continue
      if (!ACCENT_RULE_REGEX.test(token.content.trim())) continue

      const prevToken = state.tokens[index - 1]
      const nextToken = state.tokens[index + 1]
      if (!prevToken || !nextToken) continue
      if (prevToken.type !== 'paragraph_open') continue
      if (nextToken.type !== 'paragraph_close') continue

      const htmlToken = new state.Token('html_block', '', 0)
      htmlToken.content = ACCENT_RULE_HTML
      htmlToken.block = true
      htmlToken.map = token.map

      state.tokens.splice(index - 1, 3, htmlToken)
      index -= 1
    }
  })
}

function targetBlankExtension(md: MarkdownItInstance) {
  const defaultRender =
    md.renderer.rules.link_open ??
    ((tokens, idx, options, _env, self) =>
      self.renderToken(tokens, idx, options))

  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const targetIndex = token.attrIndex('target')
    const relIndex = token.attrIndex('rel')

    if (targetIndex < 0) {
      token.attrPush(['target', '_blank'])
    } else if (token.attrs) {
      token.attrs[targetIndex][1] = '_blank'
    }

    if (relIndex < 0) {
      token.attrPush(['rel', 'noopener noreferrer'])
    } else if (token.attrs) {
      const relValue = token.attrs[relIndex][1]
      const relTokens = new Set(relValue.split(/\s+/).filter(Boolean))
      relTokens.add('noopener')
      relTokens.add('noreferrer')
      token.attrs[relIndex][1] = Array.from(relTokens).join(' ')
    }

    return defaultRender(tokens, idx, options, env, self)
  }
}

function createMarkdownRenderer(): MarkdownItInstance {
  const md = new MarkdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
  })

  md.linkify.tlds(
    [
      'dev',
      'app',
      'io',
      'ai',
      'co',
      'me',
      'online',
      'site',
      'blog',
      'shop',
      'store',
      'tech',
      'xyz',
      'gg',
      'design',
      'studio',
      'cloud',
      'digital',
    ],
    true
  )

  md.use(resumePageBreakPlugin)
  md.use(resumeShorthandBlockPlugin)
  md.use(resumeSplitLinePlugin)
  md.use(resumeAccentRulePlugin)
  md.use(targetBlankExtension)
  md.use(imgSize)

  return md
}

const ACCENT_COLORS: Record<string, string> = {
  indigo: '#4f46e5',
  blue: '#2563eb',
  teal: '#0d9488',
  slate: '#475569',
  emerald: '#059669',
  rose: '#e11d48',
}

interface RenderOptions {
  accentColor?: string
  headingFont?: string
  bodyFont?: string
  bodySize?: string
  headingScale?: string
  bodyLeading?: string
  // Note: bodyTracking intentionally not supported - letter-spacing is hardcoded
  // to 'normal' for ATS-safe text extraction (Chrome PDF text layer bug)
}

export function renderResumeHtml(
  markdown: string,
  options: RenderOptions = {}
): string {
  const md = createMarkdownRenderer()
  // Sanitize rendered HTML to prevent XSS in the browser rendering sandbox
  const contentHtml = sanitizeHtml(md.render(markdown))

  const accentColor =
    ACCENT_COLORS[options.accentColor ?? 'indigo'] ?? ACCENT_COLORS.indigo

  const fontFamilies = {
    geologica: '"Geologica", ui-sans-serif, system-ui, sans-serif',
    'noto-sans': '"Noto Sans", ui-sans-serif, system-ui, sans-serif',
    'ibm-plex-sans': '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif',
    'ibm-plex-serif': '"IBM Plex Serif", ui-serif, Georgia, serif',
    'source-serif-4': '"Source Serif 4", ui-serif, Georgia, serif',
  }

  const headingFont =
    fontFamilies[options.headingFont as keyof typeof fontFamilies] ??
    fontFamilies.geologica
  const bodyFont =
    fontFamilies[options.bodyFont as keyof typeof fontFamilies] ??
    fontFamilies['noto-sans']
  const bodySize = options.bodySize ?? '0.9375rem'
  const headingScale = options.headingScale ?? '1'
  const bodyLeading = options.bodyLeading ?? '1.6'

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geologica:wght@400;500;600;700;800&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Serif:wght@400;500;600;700&family=Noto+Sans:wght@400;500;600;700;800&family=Source+Serif+4:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --resume-preview-background: #f1f5f9;
      --resume-preview-foreground: #0f172a;
      --resume-preview-muted: #f1f5f9;
      --resume-preview-muted-foreground: #64748b;
      --resume-preview-border: #e2e8f0;
      --resume-preview-primary: ${accentColor};
      --resume-preview-primary-foreground: #ffffff;
      --resume-preview-card: #ffffff;
      --resume-preview-card-foreground: #0f172a;
      --resume-preview-accent: #e2e8f0;
      --resume-preview-accent-foreground: #0f172a;

      --background: var(--resume-preview-background);
      --foreground: var(--resume-preview-foreground);
      --muted: var(--resume-preview-muted);
      --muted-foreground: var(--resume-preview-muted-foreground);
      --border: var(--resume-preview-border);
      --primary: var(--resume-preview-primary);
      --card: var(--resume-preview-card);

      --resume-heading-font: ${headingFont};
      --resume-body-font: ${bodyFont};
      --resume-body-size: ${bodySize};
      --resume-heading-scale: ${headingScale};
      --resume-body-leading: ${bodyLeading};
      /* Force letter-spacing to normal for ATS-friendly text extraction */
      /* Chrome PDF rendering breaks text layer when letter-spacing is non-zero */
      --resume-body-tracking: normal;

      --preview-link-color: var(--resume-preview-primary);
    }

    *, *::before, *::after {
      box-sizing: border-box;
      /* Global ATS-safe text rendering - disable all letter spacing and kerning */
      letter-spacing: normal !important;
      font-feature-settings: "kern" 0, "liga" 0 !important;
      font-kerning: none !important;
    }

    html, body {
      margin: 0;
      padding: 0;
      background: white;
      color-scheme: light;
    }

    body {
      font-family: var(--resume-body-font);
      font-size: var(--resume-body-size);
      line-height: var(--resume-body-leading);
      letter-spacing: var(--resume-body-tracking);
      color: var(--foreground);
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .resume-content {
      padding: 0.5in;
      max-width: 8.5in;
      margin: 0 auto;
    }

    /* Page breaks */
    .resume-page-break, .page-break {
      display: block;
      height: 0;
      margin: 0;
      padding: 0;
      border: 0;
    }

    .resume-page-break + *, .page-break + * {
      break-before: page;
      page-break-before: always;
      margin-top: 0;
    }

    /* Split line */
    .split-line {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 16px;
      margin-block: 0 12px;
    }

    .split-line__left {
      min-width: 0;
      flex: 1 1 auto;
    }

    .split-line__right {
      flex: 0 0 auto;
      text-align: right;
    }

    /* Accent divider */
    hr.divider--accent {
      border: none;
      height: 3px;
      width: 100%;
      border-radius: 999px;
      background: var(--resume-preview-primary);
      margin-block: 12px;
    }

    /* Headings */
    h1, h2, h3, h4, h5, h6 {
      font-family: var(--resume-heading-font);
      margin-block-start: 24px;
      margin-block-end: 16px;
      line-height: 1.25;
      font-weight: 700;
      color: var(--foreground);
    }

    h1 {
      margin-block-start: 0;
      margin-block-end: 6px;
      font-size: calc(2.2rem * var(--resume-heading-scale));
      font-weight: 800;
      letter-spacing: normal;
    }

    h1 + h2 {
      margin-block-start: 0;
      margin-block-end: 12px;
      font-size: calc(1.2rem * var(--resume-heading-scale));
      font-weight: 500;
      color: var(--muted-foreground);
      text-transform: none;
      border: none;
      padding: 0;
    }

    h2 {
      margin-block-start: 28px;
      margin-block-end: 16px;
      font-size: calc(0.95rem * var(--resume-heading-scale));
      font-weight: 700;
      letter-spacing: normal;
      text-transform: uppercase;
      color: var(--primary);
      border-block-end: 1px solid var(--border);
      padding-block-end: 6px;
    }

    h3 {
      margin-block-start: 18px;
      margin-block-end: 6px;
      font-size: calc(1rem * var(--resume-heading-scale));
      font-weight: 700;
    }

    h4 {
      margin-block-start: 12px;
      margin-block-end: 4px;
      font-size: calc(0.95rem * var(--resume-heading-scale));
      font-weight: 600;
    }

    /* Paragraphs */
    p {
      margin-block: 0 12px;
      color: var(--muted-foreground);
      line-height: var(--resume-body-leading);
      letter-spacing: var(--resume-body-tracking);
    }

    p:empty {
      display: none;
    }

    strong {
      color: var(--foreground);
      font-weight: 600;
    }

    em {
      color: var(--muted-foreground);
      letter-spacing: normal;
      font-feature-settings: "kern" 0;
    }

    /* Force all text to have normal letter-spacing for ATS */
    .split-line__right {
      letter-spacing: normal;
      font-feature-settings: "kern" 0;
    }

    /* Links */
    a {
      color: var(--preview-link-color);
      text-decoration: none;
    }

    /* Lists */
    ul, ol {
      list-style: revert;
      padding-inline-start: 1.25em;
      margin-block: 0 16px;
      color: var(--muted-foreground);
      list-style-position: outside;
    }

    li {
      margin-block: 4px;
      line-height: var(--resume-body-leading);
      letter-spacing: var(--resume-body-tracking);
    }

    li::marker {
      color: var(--muted-foreground);
    }

    h2 + ul {
      list-style: disc;
      padding-inline-start: 1.25em;
      margin-block: 0 16px;
      display: block;
    }

    h2 + ul > li {
      margin-block: 4px;
      padding: 0;
      border-radius: 0;
      background: none;
      color: inherit;
      font-size: inherit;
      font-weight: inherit;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      border: 1px solid var(--border);
      padding: 8px 10px;
    }

    /* Blockquotes */
    blockquote {
      margin: 16px 0;
      padding: 8px 16px;
      border-inline-start: 4px solid var(--border);
      background-color: var(--muted);
    }

    /* Code */
    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.9em;
    }

    pre {
      margin: 20px 0;
      background-color: #0b1220;
      border-radius: 6px;
      overflow: auto;
    }

    pre code {
      display: block;
      font-size: 14px;
      color: #a9b7c6;
      background: transparent;
      padding: 1em;
      line-height: 1.6;
    }

    /* Print styles */
    @media print {
      @page {
        margin: 0.5in;
        size: letter;
      }

      html, body {
        font-size: 12pt;
      }

      .resume-content {
        padding: 0;
        max-width: none;
      }

      h1, h2, h3, h4, h5, h6 {
        break-after: avoid-page;
        page-break-after: avoid;
      }

      li {
        break-inside: avoid;
        page-break-inside: avoid;
      }

      p {
        orphans: 2;
        widows: 2;
      }
    }
  </style>
</head>
<body>
  <div class="resume-content">
    ${contentHtml}
  </div>
</body>
</html>`
}
