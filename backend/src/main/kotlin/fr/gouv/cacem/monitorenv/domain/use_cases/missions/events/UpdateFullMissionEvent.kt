package fr.gouv.cacem.monitorenv.domain.use_cases.missions.events

import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDetailsDTO

data class UpdateFullMissionEvent(
    val mission: MissionDetailsDTO,
)
