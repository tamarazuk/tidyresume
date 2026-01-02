import sanitize from 'sanitize-html'

const ALLOWED_TAGS = [
  'a',
  'b',
  'strong',
  'i',
  'em',
  'u',
  'p',
  'del',
  's',
  'br',
  'ul',
  'ol',
  'li',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
  'code',
  'pre',
  'hr',
  'input',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'img',
  'span',
  'div',
  'sub',
  'sup',
  'figure',
  'figcaption',
  'kbd',
  'mark',
  'ins',
  'strike',
  'details',
  'summary',
]

const ALLOWED_ATTRIBUTES: sanitize.IOptions['allowedAttributes'] = {
  a: ['href', 'title', 'target', 'rel'],
  img: ['src', 'alt', 'title', 'width', 'height'],
  input: ['type', 'checked', 'disabled'],
  th: ['colspan', 'rowspan'],
  td: ['colspan', 'rowspan'],
  '*': ['class'],
}

type SanitizeAttributes = Record<string, string>

export function sanitizeHtml(html: string) {
  return sanitize(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: {
      img: ['http', 'https', 'data'],
    },
    transformTags: {
      a: (tagName: string, attribs: SanitizeAttributes) => {
        if (attribs.target !== '_blank') {
          return { tagName, attribs }
        }
        const relValue = attribs.rel ?? ''
        const relTokens = new Set(relValue.split(/\s+/).filter(Boolean))
        relTokens.add('noopener')
        relTokens.add('noreferrer')
        return {
          tagName,
          attribs: {
            ...attribs,
            rel: Array.from(relTokens).join(' '),
          },
        }
      },
    },
    exclusiveFilter: (frame: sanitize.IFrame) => {
      if (frame.tag !== 'img') return false
      const src = frame.attribs?.src?.trim()
      if (!src) return false
      const normalizedSrc = src.toLowerCase()
      if (normalizedSrc.startsWith('data:image/svg+xml')) return true
      if (normalizedSrc.startsWith('data:')) {
        return !normalizedSrc.startsWith('data:image/')
      }
      return false
    },
  })
}
