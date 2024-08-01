import { Fragment } from 'react'

export function TextWithLineBreaks({ text }) {
  const textWithBreaks = text?.split('\n').map(line => (
    <Fragment key={Math.random()}>
      {line}
      <br />
    </Fragment>
  ))

  return <>{textWithBreaks}</>
}
