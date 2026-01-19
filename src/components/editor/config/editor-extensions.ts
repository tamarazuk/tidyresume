import { config } from 'md-editor-rt'
import { lineNumbers, highlightActiveLineGutter } from '@codemirror/view'
import { catppuccinLatte, catppuccinMocha } from '@catppuccin/codemirror'
import { imgSize } from '@mdit/plugin-img-size'

type ConfigOptions = Parameters<typeof config>[0]
type MarkdownItConfig = NonNullable<ConfigOptions['markdownItConfig']>
type MarkdownItInstance = Parameters<MarkdownItConfig>[0]
type MarkdownItPluginsConfig = NonNullable<ConfigOptions['markdownItPlugins']>
type CodeMirrorExtensionsConfig = NonNullable<
  ConfigOptions['codeMirrorExtensions']
>

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

function injectLineNumberPlugin(md: MarkdownItInstance) {
  md.core.ruler.push('inject_line_number', (state) => {
    state.tokens.forEach((token) => {
      if (token.map) {
        if (!token.attrs) {
          token.attrs = []
        }
        token.attrs.push(['data-line', token.map[0].toString()])
      }
    })
    return true
  })
}

export const buildCodeMirrorExtensions: CodeMirrorExtensionsConfig = (
  extensions,
  options
) => [
  ...extensions,
  {
    type: 'lineNumbers',
    extension: lineNumbers(),
  },
  {
    type: 'highlightActiveLineGutter',
    extension: highlightActiveLineGutter(),
  },
  {
    type: 'theme',
    extension: () =>
      options.theme === 'dark' ? catppuccinMocha : catppuccinLatte,
  },
]

export const configureMarkdownIt: MarkdownItConfig = (md) => {
  md.set({ html: true, breaks: true, linkify: true, typographer: true })
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
  md.use(injectLineNumberPlugin)
  md.use(imgSize)
}

export const filterMarkdownItPlugins: MarkdownItPluginsConfig = (plugins) =>
  plugins
    .filter(
      (p) =>
        !['mermaid', 'katex', 'echarts', 'admonition', 'code'].includes(p.type)
    )
    .map((p) =>
      p.type === 'image'
        ? { ...p, options: { figcaption: false, classes: 'md-zoom' } }
        : p
    )
