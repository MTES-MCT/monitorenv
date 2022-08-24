import React from 'react'
import { missionStatusEnum } from '../domain/entities/missions';
import { MissionStatusLabel } from './MissionStatusLabel'

export default {
  title: 'MonitorEnv/Labels',
  component: MissionStatusLabel,
};

const Template = ({missionStatus, ...args}) => {
  return (<>
    <MissionStatusLabel missionStatus={missionStatusEnum.PENDING.code} {...args} />
    <MissionStatusLabel missionStatus={missionStatusEnum.ENDED.code} {...args} />
    <MissionStatusLabel missionStatus={missionStatusEnum.CLOSED.code} {...args} />
    <MissionStatusLabel missionStatus={missionStatus} {...args} />
  </>
  )
}

export const MissionStatus = Template.bind({})