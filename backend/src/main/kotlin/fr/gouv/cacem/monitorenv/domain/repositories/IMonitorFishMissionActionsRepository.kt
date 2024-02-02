package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.mission.monitorfish.MonitorFishMissionActionEntity

interface IMonitorFishMissionActionsRepository {
    fun findFishMissionActionsById(missionId: Int): List<MonitorFishMissionActionEntity>
}
