package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.mission.rapportnav.RapportNavMissionActionEntity

interface IRapportNavMissionActionsRepository {
    fun findRapportnavMissionActionsById(missionId: Int): RapportNavMissionActionEntity
}
