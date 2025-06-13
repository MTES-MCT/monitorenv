import React from 'react'

type ErrorBoundaryProps = {
  children: React.ReactNode
}
type ErrorBoundaryState = {
  hasError: boolean
}
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // eslint-disable-next-line no-console
    console.log(error)

    return { hasError: true }
  }

  override componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.log(error, errorInfo)
  }

  override render() {
    const { children } = this.props
    const { hasError } = this.state

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
        </div>
      )
    }

    return children
  }
}
