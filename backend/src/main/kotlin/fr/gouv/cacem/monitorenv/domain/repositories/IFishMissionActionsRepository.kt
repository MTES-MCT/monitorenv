package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.mission.monitorfish.FishAction

interface IFishMissionActionsRepository {
    fun findFishMissionActionsById(missionId: Int): List<FishAction>
}
