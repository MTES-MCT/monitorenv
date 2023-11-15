import { Component } from 'react'

type ErrorBoundaryState = {
  hasError: boolean
}
type ErrorBoundaryProps = {
  children: any
}
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: unknown) {
    // eslint-disable-next-line no-console
    console.log(error)

    return { hasError: true }
  }

  override componentDidCatch(error: unknown, errorInfo: any) {
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
