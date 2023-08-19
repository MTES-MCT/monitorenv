import { Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import { useNavigate } from 'react-router'

export type EditButtonProps = {
  basePath: string
  id: number
  title: string
}
export function EditButton({ basePath, id, title }: EditButtonProps) {
  const navigate = useNavigate()

  return (
    <IconButton
      Icon={Icon.Edit}
      onClick={() => {
        navigate(`${basePath}/${id}`)
      }}
      size={Size.SMALL}
      title={title}
    />
  )
}
