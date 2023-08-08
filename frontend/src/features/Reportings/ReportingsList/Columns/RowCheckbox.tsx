import { useRef, type HTMLProps, useEffect } from 'react'

export function RowCheckbox({
  className = '',
  indeterminate,
  ...props
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !props.checked && indeterminate
    }
  }, [ref, indeterminate, props.checked])

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <input ref={ref} className={`${className} cursor-pointer`} type="checkbox" {...props} />
}
