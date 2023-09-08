import { type ButtonProps, Button } from '@mtes-mct/monitor-ui'
import { useCallback } from 'react'
import { useNavigate } from 'react-router'

export type NavButtonProps = Omit<ButtonProps, 'onClick'> & {
  to: string
}
export function NavButton({ to, ...originalProps }: NavButtonProps) {
  const navigate = useNavigate()

  const handleClick = useCallback(() => {
    navigate(to)
  }, [navigate, to])

  return <Button onClick={handleClick} {...originalProps} />
}
