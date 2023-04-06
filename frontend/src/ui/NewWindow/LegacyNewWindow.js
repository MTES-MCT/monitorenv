import React from 'react'
import ReactDOM from 'react-dom'

export class LegacyNewWindow extends React.PureComponent {
  /**
   * The NewWindow function constructor.
   * @param {Object} props
   */
  constructor(props) {
    super(props)
    this.container = null
    this.window = null
    this.windowCheckerInterval = undefined
    this.released = false
    this.state = {
      mounted: false
    }
    this.beforeUnloadListener = this.beforeUnloadListener.bind(this)
  }

  /**
   * @override
   */
  componentDidMount() {
    const { onChangeFocus } = this.props

    this.openChild()
    this.setState({ mounted: true })

    this.window?.addEventListener('beforeunload', this.beforeUnloadListener, { capture: true })

    this.window?.addEventListener('blur', () => {
      onChangeFocus('hidden')
    })
    this.window?.addEventListener('focus', () => {
      onChangeFocus('visible')
    })
  }

  /**
   *
   * @override
   */
  componentDidUpdate(prevProps) {
    const { shouldHaveFocus } = this.props
    if (prevProps.shouldHaveFocus !== shouldHaveFocus && shouldHaveFocus) {
      this.window?.focus()
    }
  }

  /**
   * Closes the opened window (if any) when NewWindow will unmount if the
   * prop {closeOnUnmount} is true, otherwise the NewWindow will remain open
   * @override
   */
  componentWillUnmount() {
    const { children, closeOnUnmount } = this.props
    if (this.window) {
      if (closeOnUnmount) {
        this.window.close()
      } else if (children) {
        // Clone any children so they aren't removed when react stops rendering
        const clone = this.container?.cloneNode(true)
        clone?.setAttribute('id', 'new-window-container-static')
        this.window.document.body.appendChild(clone)
      }
    }
    this.window?.removeEventListener('beforeunload', this.beforeUnloadListener, { capture: true })
  }

  beforeUnloadListener(e) {
    e.preventDefault()
    const { showPrompt } = this.props

    if (showPrompt) {
      // eslint-disable-next-line no-return-assign
      return (e.returnValue = 'blocked')
    }

    return null
  }

  /**
   * Create the new window when NewWindow component mount.
   */
  openChild() {
    const { center, copyStyles, features, name, onBlock, onOpen, title, url } = this.props
    // Prepare position of the new window to be centered against the 'parent' window or 'screen'.
    if (typeof center === 'string' && (features.width === undefined || features.height === undefined)) {
      // eslint-disable-next-line no-console
      console.warn('width and height window features must be present when a center prop is provided')
    } else if (center === 'parent') {
      features.left = window.top.outerWidth / 2 + window.top.screenX - features.width / 2
      features.top = window.top.outerHeight / 2 + window.top.screenY - features.height / 2
    } else if (center === 'screen') {
      const screenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screen.left
      const screenTop = window.screenTop !== undefined ? window.screenTop : window.screen.top

      const width = window.innerWidth
        ? window.innerWidth
        : document.documentElement.clientWidth
        ? document.documentElement.clientWidth
        : window.screen.width
      const height = window.innerHeight
        ? window.innerHeight
        : document.documentElement.clientHeight
        ? document.documentElement.clientHeight
        : window.screen.height

      features.left = width / 2 - features.width / 2 + screenLeft
      features.top = height / 2 - features.height / 2 + screenTop
    }

    // Open a new window.
    this.window = window.open(url, name, toWindowFeatures(features))
    this.container = this.window?.document.createElement('div')
    // When a new window use content from a cross-origin there's no way we can attach event
    // to it. Therefore, we need to detect in a interval when the new window was destroyed
    // or was closed.
    this.windowCheckerInterval = setInterval(() => {
      if (!this.window || this.window.closed) {
        this.release()
      }
    }, 50)

    // Check if the new window was succesfully opened.
    if (this.window) {
      this.window.document.title = title

      // Check if the container already exists as the window may have been already open
      this.container = this.window.document.getElementById('new-window-container')
      if (this.container === null) {
        this.container = this.window.document.createElement('div')
        this.container.setAttribute('id', 'new-window-container')
        this.window.document.body.appendChild(this.container)
      } else {
        // Remove any existing content
        const staticContainer = this.window.document.getElementById('new-window-container-static')
        this.window.document.body.removeChild(staticContainer)
      }

      // If specified, copy styles from parent window's document.
      if (copyStyles) {
        setTimeout(() => onCopyStyles(document, this.window?.document), 0)
      }

      if (typeof onOpen === 'function') {
        onOpen(this.window)
      }

      // Release anything bound to this component before the new window unload.
    } else {
      // Handle error on opening of new window.
      if (typeof onBlock === 'function') {
        onBlock(null)
      } else {
        // eslint-disable-next-line no-console
        console.warn('A new window could not be opened. Maybe it was blocked.')
      }
    }
  }

  /**
   * Release the new window and anything that was bound to it.
   */
  release() {
    // This method can be called once.
    if (this.released) {
      return
    }
    this.released = true

    // Remove checker interval.
    clearInterval(this.windowCheckerInterval)

    // Call any function bound to the `onUnload` prop.
    const { onUnload } = this.props

    if (typeof onUnload === 'function') {
      onUnload(null)
    }
  }

  /**
   * Render the NewWindow component.
   * @override
   */
  render() {
    const { mounted } = this.state
    const { children } = this.props
    if (!mounted) {
      return null
    }

    return ReactDOM.createPortal(children, this.container)
  }
}

LegacyNewWindow.defaultProps = {
  center: 'parent',
  closeOnUnmount: true,
  copyStyles: true,
  features: { height: '640px', width: '600px' },
  name: '',
  onBlock: null,
  onChangeFocus: () => {},
  onOpen: null,
  onUnload: null,
  shouldHaveFocus: false,
  showPrompt: false,
  title: '',
  url: ''
}
/**
 * Utility functions.
 * @private
 */

/**
 * Copy styles from a source document to a target.
 * @param {Object} source
 * @param {Object} target
 * @private
 */

function onCopyStyles(source, target) {
  // Store style tags, avoid reflow in the loop
  const headFrag = target.createDocumentFragment()

  Array.from(source.styleSheets).forEach(styleSheet => {
    // For <style> elements
    let rules
    try {
      rules = styleSheet.cssRules
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    }
    if (rules) {
      // IE11 is very slow for appendChild, so use plain string here
      const ruleText = []

      // Write the text of each rule into the body of the style element
      Array.from(styleSheet.cssRules).forEach(cssRule => {
        const { type } = cssRule

        let returnText = ''

        if (type === CSSRule.KEYFRAMES_RULE) {
          // IE11 will throw error when trying to access cssText property, so we
          // need to assemble them
          returnText = getKeyFrameText(cssRule)
        } else if ([CSSRule.IMPORT_RULE, CSSRule.FONT_FACE_RULE].includes(type)) {
          // Check if the cssRule type is CSSImportRule (3) or CSSFontFaceRule (5)
          // to handle local imports on a about:blank page
          // '/custom.css' turns to 'http://my-site.com/custom.css'
          returnText = fixUrlForRule(cssRule)
        } else {
          returnText = cssRule.cssText
        }
        ruleText.push(returnText)
      })

      const newStyleEl = target.createElement('style')
      newStyleEl.textContent = ruleText.join('\n')
      headFrag.appendChild(newStyleEl)
    } else if (styleSheet.href) {
      // for <link> elements loading CSS from a URL
      const newLinkEl = target.createElement('link')

      newLinkEl.rel = 'stylesheet'
      newLinkEl.href = styleSheet.href
      headFrag.appendChild(newLinkEl)
    }
  })

  target.head.appendChild(headFrag)
}

/**
 * Make keyframe rules.
 * @param {CSSRule} cssRule
 * @return {String}
 * @private
 */

function getKeyFrameText(cssRule) {
  const tokens = ['@keyframes', cssRule.name, '{']
  Array.from(cssRule.cssRules).forEach(cssRule => {
    // type === CSSRule.KEYFRAME_RULE should always be true
    tokens.push(cssRule.keyText, '{', cssRule.style.cssText, '}')
  })
  tokens.push('}')

  return tokens.join(' ')
}

/**
 * Handle local import urls.
 * @param {CSSRule} cssRule
 * @return {String}
 * @private
 */

function fixUrlForRule(cssRule) {
  return cssRule.cssText
    .split('url(')
    .map(line => {
      if (line[1] === '/') {
        return `${line.slice(0, 1)}${window.location.origin}${line.slice(1)}`
      }

      return line
    })
    .join('url(')
}

/**
 * Convert features props to window features format (name=value,other=value).
 * @param {Object} obj
 * @return {String}
 * @private
 */

function toWindowFeatures(obj) {
  return Object.keys(obj)
    .reduce((features, name) => {
      const value = obj[name]
      if (typeof value === 'boolean') {
        features.push(`${name}=${value ? 'yes' : 'no'}`)
      } else {
        features.push(`${name}=${value}`)
      }

      return features
    }, [])
    .join(',')
}
