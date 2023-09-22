import { IconButton, type IconButtonProps } from '@mtes-mct/monitor-ui'
import { useCallback } from 'react'
import { useNavigate } from 'react-router'

export type NavIconButtonProps = Omit<IconButtonProps, 'onClick'> & {
  to: string
}
export function NavIconButton({ to, ...originalProps }: NavIconButtonProps) {
  const navigate = useNavigate()

  const handleClick = useCallback(() => {
    navigate(to)
  }, [navigate, to])

  return <IconButton onClick={handleClick} {...originalProps} />
}
