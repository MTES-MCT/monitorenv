import React from 'react'

import type { Mission } from '../domain/entities/missions'

export const MissionEventContext = React.createContext<Mission | undefined>(undefined)
