import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentPropsWithRef,
  type RefObject,
  type ReactElement,
} from 'react'
import {
  DropdownToolbar,
  type ExposeParam,
  type ToolbarNames,
} from 'md-editor-rt'
import { redo, undo } from '@codemirror/commands'
import {
  ArrowClockwiseIcon,
  ArrowCounterClockwiseIcon,
  CodeIcon,
  SquareSplitHorizontalIcon,
  SidebarSimpleIcon,
  ImageIcon,
  KeyboardIcon,
  MinusIcon,
  TextHIcon,
} from '@phosphor-icons/react'
import { PageBreakIcon } from '@/icons/page-break'
import { Kbd } from '@/components/ui/kbd'
import usePlatformShortcuts from '@/hooks/use-platform-shortcuts'
import { useEditorViewStore } from '@/stores/editor-view-store'
import { useResumeStore } from '@/stores/resume-store'

import HeadingMenu from '../components/toolbar-heading-menu'
import ToolbarImageMenu from '../components/toolbar-image-menu'
import EditorShortcutsMenu from '../components/toolbar-shortcuts-menu'
import ToolbarTooltip from '../components/toolbar-tooltip'
import ToolbarTooltipButton from '../components/toolbar-tooltip-button'
import { HEADING_LEVELS, type HeadingLevel } from './use-toolbar-heading-menu'
import {
  ARIA_ONLY_TOOLBAR_ITEMS,
  TOOLBAR_LAYOUT,
  type AriaToolbarItem,
  type CustomToolbarItemId,
  type ToolbarLayoutItem,
} from './toolbar-items'

interface UseEditorToolbarsOptions {
  editorRef: RefObject<ExposeParam | null>
}

interface UseEditorToolbarsReturn {
  toolbars: ToolbarNames[]
  defToolbars: ReactElement[]
  uploadInputProps: ComponentPropsWithRef<'input'>
}

const MAX_IMAGE_DIMENSION = 700
const MAX_IMAGE_DATA_URL_LENGTH = 1_500_000

function useEditorToolbars({
  editorRef,
}: UseEditorToolbarsOptions): UseEditorToolbarsReturn {
  const [headingOpen, setHeadingOpen] = useState(false)
  const [imageMenuOpen, setImageMenuOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const uploadRef = useRef<HTMLInputElement>(null)
  const boundEditorRef = useRef<ExposeParam | null>(null)
  const { modifierKey, formatShortcutKeys } = usePlatformShortcuts()
  const editorViewState = useEditorViewStore((state) => state.editorViewState)
  const setEditorViewState = useEditorViewStore(
    (state) => state.setEditorViewState
  )
  const setImageWarning = useResumeStore((state) => state.setImageWarning)

  const viewMode =
    editorViewState.previewOnly || editorViewState.htmlPreview
      ? 'preview'
      : editorViewState.preview
        ? 'split'
        : 'editor'

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return
    if (boundEditorRef.current === editor) return
    boundEditorRef.current = editor

    const handlePreview = (status: boolean) => {
      setEditorViewState({ preview: status })
    }

    const handlePreviewOnly = (status: boolean) => {
      setEditorViewState({ previewOnly: status })
    }

    const handleHtmlPreview = (status: boolean) => {
      setEditorViewState({ htmlPreview: status })
    }

    editor.on('preview', handlePreview)
    editor.on('previewOnly', handlePreviewOnly)
    editor.on('htmlPreview', handleHtmlPreview)
    const editorWithOff = editor as ExposeParam & {
      off?: (
        eventName: 'preview' | 'previewOnly' | 'htmlPreview',
        callBack: (status: boolean) => void
      ) => void
    }
    if (!editorWithOff.off) return

    return () => {
      editorWithOff.off?.('preview', handlePreview)
      editorWithOff.off?.('previewOnly', handlePreviewOnly)
      editorWithOff.off?.('htmlPreview', handleHtmlPreview)
      if (boundEditorRef.current === editor) {
        boundEditorRef.current = null
      }
    }
  }, [editorRef, setEditorViewState])

  const insertDivider = useCallback(() => {
    editorRef.current?.insert(() => ({
      targetValue: '\n---\n',
      select: false,
    }))
  }, [editorRef])

  const insertPageBreak = useCallback(() => {
    editorRef.current?.insert(() => ({
      targetValue: '\n[[PAGEBREAK]]\n',
      select: false,
    }))
  }, [editorRef])

  const insertHeading = useCallback(
    (level: HeadingLevel) => {
      editorRef.current?.execCommand(`h${level}`)
      setHeadingOpen(false)
    },
    [editorRef]
  )

  const insertComment = useCallback(() => {
    editorRef.current?.insert((selectedText) => {
      if (selectedText) {
        return {
          targetValue: `<!-- ${selectedText} -->`,
          select: false,
        }
      }

      return {
        targetValue: '<!--  -->',
        select: true,
        deviationStart: 5,
        deviationEnd: -4,
      }
    })
  }, [editorRef])

  const triggerImageUpload = useCallback(() => {
    uploadRef.current?.click()
  }, [])

  const insertImage = useCallback(() => {
    editorRef.current?.execCommand('image')
  }, [editorRef])

  const handleInsertImage = useCallback(() => {
    insertImage()
    setImageMenuOpen(false)
  }, [insertImage])

  const handleUploadImage = useCallback(() => {
    triggerImageUpload()
    setImageMenuOpen(false)
  }, [triggerImageUpload])

  const readFileAsDataUrl = useCallback((file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result
        if (typeof result === 'string') {
          resolve(result)
        } else {
          reject(new Error('Unexpected file reader result.'))
        }
      }
      reader.onerror = () => {
        reject(reader.error ?? new Error('Failed to read image file.'))
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const loadImage = useCallback((src: string) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => {
        reject(new Error('Failed to load image.'))
      }
      image.src = src
    })
  }, [])

  const normalizeAltText = useCallback((filename: string) => {
    const stripped = filename.replace(/\.[^/.]+$/, '').trim()
    return stripped.length > 0 ? stripped : 'Image'
  }, [])

  const clampDimensions = useCallback((width: number, height: number) => {
    if (width <= MAX_IMAGE_DIMENSION) {
      return { width, height }
    }
    const scale = MAX_IMAGE_DIMENSION / width
    return {
      width: Math.max(1, Math.round(width * scale)),
      height: Math.max(1, Math.round(height * scale)),
    }
  }, [])

  const normalizeImageType = useCallback((mimeType: string) => {
    if (mimeType === 'image/jpeg') return mimeType
    if (mimeType === 'image/png') return mimeType
    if (mimeType === 'image/webp') return mimeType
    return 'image/png'
  }, [])

  const resizeImageSource = useCallback(
    (
      image: HTMLImageElement,
      targetWidth: number,
      targetHeight: number,
      mimeType: string
    ) => {
      if (
        targetWidth === image.naturalWidth &&
        targetHeight === image.naturalHeight
      ) {
        return image.src
      }

      const canvas = document.createElement('canvas')
      canvas.width = targetWidth
      canvas.height = targetHeight
      const context = canvas.getContext('2d')
      if (!context) return image.src
      context.drawImage(image, 0, 0, targetWidth, targetHeight)

      const outputType = normalizeImageType(mimeType)
      if (outputType === 'image/jpeg' || outputType === 'image/webp') {
        return canvas.toDataURL(outputType, 0.9)
      }

      return canvas.toDataURL(outputType)
    },
    [normalizeImageType]
  )

  const handleUndo = useCallback(() => {
    const view = editorRef.current?.getEditorView?.()
    if (!view) return
    undo(view)
  }, [editorRef])

  const handleRedo = useCallback(() => {
    const view = editorRef.current?.getEditorView?.()
    if (!view) return
    redo(view)
  }, [editorRef])

  const setEditorView = useCallback(() => {
    if (editorViewState.htmlPreview) {
      editorRef.current?.toggleHtmlPreview(false)
    }
    if (editorViewState.previewOnly) {
      editorRef.current?.togglePreviewOnly(false)
    }
    editorRef.current?.togglePreview(false)
    setEditorViewState({
      preview: false,
      previewOnly: false,
      htmlPreview: false,
    })
  }, [editorRef, editorViewState, setEditorViewState])

  const setSplitView = useCallback(() => {
    if (editorViewState.htmlPreview) {
      editorRef.current?.toggleHtmlPreview(false)
    }
    if (editorViewState.previewOnly) {
      editorRef.current?.togglePreviewOnly(false)
    }
    editorRef.current?.togglePreview(true)
    setEditorViewState({
      preview: true,
      previewOnly: false,
      htmlPreview: false,
    })
  }, [editorRef, editorViewState, setEditorViewState])

  const setPreviewView = useCallback(() => {
    if (editorViewState.htmlPreview) {
      editorRef.current?.toggleHtmlPreview(false)
    }
    editorRef.current?.togglePreviewOnly(true)
    setEditorViewState({
      preview: true,
      previewOnly: true,
      htmlPreview: false,
    })
  }, [editorRef, editorViewState.htmlPreview, setEditorViewState])

  const headingOverlay = useMemo(() => {
    return <HeadingMenu levels={HEADING_LEVELS} onSelect={insertHeading} />
  }, [insertHeading])

  const shortcutsOverlay = useMemo(() => {
    return <EditorShortcutsMenu />
  }, [])

  const imageMenuOverlay = useMemo(() => {
    return (
      <ToolbarImageMenu
        onInsert={handleInsertImage}
        onUpload={handleUploadImage}
      />
    )
  }, [handleInsertImage, handleUploadImage])

  const renderShortcutTooltip = useCallback((label: string, keys: string[]) => {
    return (
      <span className="flex items-center gap-2">
        <span>{label}</span>
        <span className="inline-flex items-center gap-1">
          {keys.map((key) => (
            <Kbd key={`${label}-${key}`}>{key}</Kbd>
          ))}
        </span>
      </span>
    )
  }, [])

  const handleUploadChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []).filter(
        (file) =>
          file.type.startsWith('image/') && file.type !== 'image/svg+xml'
      )
      if (files.length === 0) {
        event.target.value = ''
        return
      }

      void (async () => {
        const results = await Promise.allSettled(
          files.map(async (file) => {
            const src = await readFileAsDataUrl(file)
            const image = await loadImage(src)
            const clamped = clampDimensions(
              image.naturalWidth,
              image.naturalHeight
            )
            const resizedSrc = resizeImageSource(
              image,
              clamped.width,
              clamped.height,
              file.type
            )
            if (resizedSrc.length > MAX_IMAGE_DATA_URL_LENGTH) {
              throw new Error('Image too large to store safely.')
            }
            return {
              alt: normalizeAltText(file.name),
              src: resizedSrc,
              width: clamped.width,
              height: clamped.height,
            }
          })
        )
        const oversizedResults = results.filter(
          (result) =>
            result.status === 'rejected' &&
            String(result.reason).includes('Image too large to store safely')
        )
        if (oversizedResults.length > 0) {
          setImageWarning('Image too large to store')
        } else {
          setImageWarning(null)
        }
        const images = results.flatMap((result) => {
          if (result.status !== 'fulfilled') return []
          return [result.value]
        })
        if (images.length === 0) return
        const markdown = images
          .map(({ alt, src, width }) => `![${alt} =${width}x](${src})`)
          .join('\n')

        editorRef.current?.insert(() => ({
          targetValue: `${markdown}\n`,
          select: false,
        }))
      })()

      event.target.value = ''
    },
    [
      clampDimensions,
      editorRef,
      loadImage,
      normalizeAltText,
      resizeImageSource,
      readFileAsDataUrl,
      setImageWarning,
    ]
  )

  const handleAriaToolbarAction = useCallback(
    (item: AriaToolbarItem) => {
      switch (item.action) {
        case 'exec':
          editorRef.current?.execCommand(item.command)
          break
        case 'togglePreview':
          editorRef.current?.togglePreview()
          break
        case 'toggleHtmlPreview':
          editorRef.current?.toggleHtmlPreview()
          break
        default:
          break
      }
    },
    [editorRef]
  )

  const buildCustomToolbar = useCallback(
    (id: CustomToolbarItemId) => {
      const undoLabel = `Undo (${modifierKey}+Z)`
      const redoLabel = `Redo (${modifierKey}+Shift+Z)`
      const headingKeys = formatShortcutKeys(['Mod', '1-6'])
      const headingLabel = `Heading (${headingKeys.join('+')})`
      switch (id) {
        case 'undo':
          return (
            <ToolbarTooltipButton
              key="custom-undo"
              label={undoLabel}
              tooltip={renderShortcutTooltip(
                'Undo',
                formatShortcutKeys(['Mod', 'Z'])
              )}
              icon={<ArrowCounterClockwiseIcon size={16} aria-hidden />}
              onClick={handleUndo}
            />
          )
        case 'redo':
          return (
            <ToolbarTooltipButton
              key="custom-redo"
              label={redoLabel}
              tooltip={renderShortcutTooltip(
                'Redo',
                formatShortcutKeys(['Mod', 'Shift', 'Z'])
              )}
              icon={<ArrowClockwiseIcon size={16} aria-hidden />}
              onClick={handleRedo}
            />
          )
        case 'heading':
          return (
            <ToolbarTooltip
              key="custom-heading"
              label={headingLabel}
              tooltip={renderShortcutTooltip('Heading', headingKeys)}
            >
              <DropdownToolbar
                title="Heading"
                aria-label={headingLabel}
                visible={headingOpen}
                onChange={setHeadingOpen}
                overlay={headingOverlay}
              >
                <TextHIcon size={16} aria-hidden />
              </DropdownToolbar>
            </ToolbarTooltip>
          )
        case 'shortcuts':
          return (
            <ToolbarTooltip key="custom-shortcuts" label="Keyboard shortcuts">
              <DropdownToolbar
                title="Keyboard shortcuts"
                aria-label="Keyboard shortcuts"
                visible={shortcutsOpen}
                onChange={setShortcutsOpen}
                overlay={shortcutsOverlay}
              >
                <KeyboardIcon size={16} aria-hidden />
              </DropdownToolbar>
            </ToolbarTooltip>
          )
        case 'divider':
          return (
            <ToolbarTooltipButton
              key="custom-divider"
              label="Insert divider"
              icon={<MinusIcon size={16} aria-hidden />}
              onClick={insertDivider}
            />
          )
        case 'pageBreak':
          return (
            <ToolbarTooltipButton
              key="custom-page-break"
              label="Insert page break"
              className="text-slate-900"
              icon={<PageBreakIcon aria-hidden />}
              onClick={insertPageBreak}
            />
          )
        case 'imageMenu':
          return (
            <ToolbarTooltip key="custom-image-menu" label="Image options">
              <DropdownToolbar
                title="Image"
                aria-label="Image options"
                visible={imageMenuOpen}
                onChange={setImageMenuOpen}
                overlay={imageMenuOverlay}
              >
                <ImageIcon size={16} aria-hidden />
              </DropdownToolbar>
            </ToolbarTooltip>
          )
        case 'comment':
          return (
            <ToolbarTooltipButton
              key="custom-comment"
              label="Insert HTML Comment"
              icon={<CodeIcon size={16} aria-hidden />}
              onClick={insertComment}
            />
          )
        case 'viewEditor':
          return (
            <ToolbarTooltipButton
              key="view-editor"
              label="Editor only"
              icon={
                <SidebarSimpleIcon
                  size={16}
                  aria-hidden
                  className="-scale-x-100"
                />
              }
              onClick={setEditorView}
              className={
                viewMode === 'editor' ? 'md-editor-toolbar-active' : undefined
              }
            />
          )
        case 'viewSplit':
          return (
            <ToolbarTooltipButton
              key="view-split"
              label="Split view"
              icon={<SquareSplitHorizontalIcon size={16} aria-hidden />}
              onClick={setSplitView}
              className={
                viewMode === 'split' ? 'md-editor-toolbar-active' : undefined
              }
            />
          )
        case 'viewPreview':
          return (
            <ToolbarTooltipButton
              key="view-preview"
              label="Preview only"
              icon={<SidebarSimpleIcon size={16} aria-hidden />}
              onClick={setPreviewView}
              className={
                viewMode === 'preview' ? 'md-editor-toolbar-active' : undefined
              }
            />
          )
        default:
          return null
      }
    },
    [
      handleRedo,
      handleUndo,
      formatShortcutKeys,
      headingOpen,
      headingOverlay,
      imageMenuOpen,
      imageMenuOverlay,
      insertComment,
      insertDivider,
      insertPageBreak,
      modifierKey,
      renderShortcutTooltip,
      shortcutsOpen,
      shortcutsOverlay,
      setEditorView,
      setPreviewView,
      setSplitView,
      viewMode,
    ]
  )

  const { defToolbars, toolbars } = useMemo(() => {
    const toolbarElements: ReactElement[] = []
    const toolbarLayout: ToolbarNames[] = []

    const pushToolbar = (element: ReactElement | null) => {
      if (!element) return
      const index = toolbarElements.length
      toolbarElements.push(element)
      toolbarLayout.push(index as ToolbarNames)
    }

    TOOLBAR_LAYOUT.forEach((item: ToolbarLayoutItem) => {
      if (item.type === 'separator') {
        toolbarLayout.push('-')
        return
      }

      if (item.type === 'align') {
        toolbarLayout.push('=')
        return
      }

      if (item.type === 'builtin') {
        toolbarLayout.push(item.name)
        return
      }

      if (item.type === 'custom') {
        pushToolbar(buildCustomToolbar(item.id))
        return
      }

      const toolbarItem = ARIA_ONLY_TOOLBAR_ITEMS[item.id]
      const shortcutKeys = toolbarItem.shortcutKeys
        ? formatShortcutKeys(toolbarItem.shortcutKeys)
        : null
      const shortcutLabel = shortcutKeys ? shortcutKeys.join('+') : null
      const ariaLabel = shortcutLabel
        ? `${toolbarItem.label} (${shortcutLabel})`
        : toolbarItem.label
      pushToolbar(
        <ToolbarTooltipButton
          key={`aria-${toolbarItem.id}`}
          label={ariaLabel}
          icon={toolbarItem.icon}
          tooltip={
            shortcutKeys
              ? renderShortcutTooltip(toolbarItem.label, shortcutKeys)
              : undefined
          }
          onClick={() => handleAriaToolbarAction(toolbarItem)}
        />
      )
    })

    return {
      defToolbars: toolbarElements,
      toolbars: toolbarLayout,
    }
  }, [
    buildCustomToolbar,
    formatShortcutKeys,
    handleAriaToolbarAction,
    renderShortcutTooltip,
  ])

  const uploadInputProps = useMemo<ComponentPropsWithRef<'input'>>(() => {
    return {
      ref: uploadRef,
      type: 'file',
      accept: 'image/*',
      multiple: true,
      className: 'hidden',
      onChange: handleUploadChange,
    }
  }, [handleUploadChange])

  return {
    toolbars,
    defToolbars,
    uploadInputProps,
  }
}

export { useEditorToolbars }
