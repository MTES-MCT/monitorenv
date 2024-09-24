import { useAppSelector } from '@hooks/useAppSelector'

export function DashboardForm() {
  const extractedArea = useAppSelector(state => state.dashboard.extractedArea)

  return (
    <div>
      <h1>Dashboard Form</h1>
      {JSON.stringify(extractedArea)}
    </div>
  )
}
