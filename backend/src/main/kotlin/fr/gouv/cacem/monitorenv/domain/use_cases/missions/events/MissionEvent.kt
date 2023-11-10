package fr.gouv.cacem.monitorenv.domain.use_cases.missions.events

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity

data class MissionEvent(
    val id: Int,
    val mission: MissionEntity? = null,
)
