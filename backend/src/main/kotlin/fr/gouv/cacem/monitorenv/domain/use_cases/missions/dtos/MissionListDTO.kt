package fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity

data class MissionListDTO(
    val mission: MissionEntity,
    val attachedReportingIds: List<Int>,
)
