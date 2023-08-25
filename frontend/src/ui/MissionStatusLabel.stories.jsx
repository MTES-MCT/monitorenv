import { MissionStatusLabel } from './MissionStatusLabel'
import { missionStatusLabels } from '../domain/entities/missions'

export default {
  component: MissionStatusLabel,
  title: 'MonitorEnv/Labels'
}

function Template({ missionStatus, ...args }) {
  return (
    <>
      <MissionStatusLabel missionStatus={missionStatusLabels.UPCOMING.code} {...args} />
      <MissionStatusLabel missionStatus={missionStatusLabels.PENDING.code} {...args} />
      <MissionStatusLabel missionStatus={missionStatusLabels.ENDED.code} {...args} />
      <MissionStatusLabel missionStatus={missionStatusLabels.CLOSED.code} {...args} />
      <MissionStatusLabel missionStatus={missionStatus} {...args} />
    </>
  )
}

export const MissionStatus = Template.bind({})
