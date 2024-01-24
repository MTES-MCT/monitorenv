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
      return <h1>Something went wrong.</h1>
    }

    return children
  }
}
