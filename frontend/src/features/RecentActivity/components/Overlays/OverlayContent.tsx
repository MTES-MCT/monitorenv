import { ControlCard } from './ControlCard'

export function OverlayContent({ items }: { items: any[] }) {
  if (items.length === 1) {
    return <ControlCard control={items[0]} />
  }

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <ControlCard control={item} />
        </div>
      ))}
    </div>
  )
}
