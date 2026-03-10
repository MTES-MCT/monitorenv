import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'

type NatinfSelectedOptionProps = {
  label: string | undefined
  onRemove: (value: string) => void
  value: string
}

export function NatinfSelectedOption({ label, onRemove, value }: NatinfSelectedOptionProps) {
  return (
    <div aria-selected className="rs-tag rs-tag-md rs-tag-default rs-tag-closable" role="option">
      <span className="rs-tag-text" title={label}>
        {value}
      </span>
      <IconButton
        accent={Accent.TERTIARY}
        className="rs-tag-icon-close rs-btn-close"
        Icon={Icon.Close}
        iconSize={13}
        onClick={event => {
          event.stopPropagation()
          onRemove(value)
        }}
        title="Supprimer"
      />
    </div>
  )
}
