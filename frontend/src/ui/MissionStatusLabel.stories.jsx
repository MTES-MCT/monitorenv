import { missionStatusEnum } from '../domain/entities/missions'
import { MissionStatusLabel } from './MissionStatusLabel'

export default {
  component: MissionStatusLabel,
  title: 'MonitorEnv/Labels'
}

function Template({ missionStatus, ...args }) {
  return (
    <>
      <MissionStatusLabel missionStatus={missionStatusEnum.UPCOMING.code} {...args} />
      <MissionStatusLabel missionStatus={missionStatusEnum.PENDING.code} {...args} />
      <MissionStatusLabel missionStatus={missionStatusEnum.ENDED.code} {...args} />
      <MissionStatusLabel missionStatus={missionStatusEnum.CLOSED.code} {...args} />
      <MissionStatusLabel missionStatus={missionStatus} {...args} />
    </>
  )
}

export const MissionStatus = Template.bind({})
