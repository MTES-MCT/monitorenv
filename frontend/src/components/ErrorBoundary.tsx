import React from 'react'

type ErrorBoundaryProps = {
  children: React.ReactNode
}
type ErrorBoundaryState = {
  error: Error | undefined
  hasError: boolean
}
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props) {
    super(props)
    this.state = { error: undefined, hasError: false }
  }

  static getDerivedStateFromError(error) {
    // eslint-disable-next-line no-console
    console.log(error)

    return { error, hasError: true }
  }

  override componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.log(error, errorInfo)
  }

  override render() {
    const { children } = this.props
    const { error, hasError } = this.state

    if (hasError) {
      return (
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flexGrow: 1,
            height: '100%',
            justifyContent: 'center',
            padding: '30px',
            width: '100%'
          }}
        >
          Une erreur est survenue.
          {error?.cause ? String(error.cause) : null}
          {error?.message ? String(error.message) : null}
          {error?.stack ? String(error.stack) : null}
          {error ? String(error) : null}
        </div>
      )
    }

    return children
  }
}
