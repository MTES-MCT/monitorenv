package fr.gouv.cacem.monitorenv.domain.use_cases.missions.events

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity

data class UpdateMissionEvent(
    val mission: MissionEntity,
)
