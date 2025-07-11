import React from 'react'

type ErrorBoundaryProps = {
  children: React.ReactNode
}
type ErrorBoundaryState = {
  error: Error | undefined
  hasError: boolean
}

const style = {
  alignItems: 'center',
  display: 'flex',
  flexGrow: 1,
  height: '100%',
  justifyContent: 'center',
  padding: '30px',
  width: '100%'
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
      return <div style={style}>Une erreur est survenue.</div>
    }

    return children
  }
}
