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

const PAGE_BREAK_REGEX = /^\[\[PAGEBREAK\]\]$/i

function resumePageBreakPlugin(md: MarkdownItInstance) {
  md.core.ruler.after('block', 'resume_page_break', (state) => {
    for (let index = 0; index < state.tokens.length; index += 1) {
      const token = state.tokens[index]
      if (token.type === 'html_block') {
        if (PAGE_BREAK_REGEX.test(token.content.trim())) {
          token.content = '<div class="resume-page-break"></div>'
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
      htmlToken.content = '<div class="resume-page-break"></div>'
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
  md.use(targetBlankExtension)
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
