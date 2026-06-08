package fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.fixtures.ControlUnitFixture.Companion.aLegacyControlUnit
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDetailsDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionListDTO
import java.time.ZonedDateTime
import kotlin.random.Random

class MissionFixture {
    companion object {
        fun aMissionEntity(
            id: Int? = Random.nextInt(),
            startDateTimeUtc: ZonedDateTime = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            endDateTimeUtc: ZonedDateTime? = ZonedDateTime.now().plusDays(1),
            controlUnits: List<LegacyControlUnitEntity> = listOf(aLegacyControlUnit()),
            observationsByUnit: String? = null,
            missionTypes: List<MissionTypeEnum> = listOf(MissionTypeEnum.LAND),
            openBy: String? = null,
            completedBy: String? = null,
            envActions: List<EnvActionEntity> = emptyList(),
            isUnderJdp: Boolean = false,
        ): MissionEntity =
            MissionEntity(
                id = id,
                controlUnits = controlUnits,
                completedBy = completedBy,
                createdAtUtc = null,
                envActions = envActions,
                endDateTimeUtc = endDateTimeUtc,
                facade = "Outre-Mer",
                hasMissionOrder = false,
                isDeleted = false,
                isNoteworthy = false,
                isUnderJdp = isUnderJdp,
                isGeometryComputedFromControls = false,
                missionSource = MissionSourceEnum.MONITORENV,
                missionTypes = missionTypes,
                missionTags = mutableListOf(),
                observationsByUnit = observationsByUnit,
                openBy = openBy,
                startDateTimeUtc = startDateTimeUtc,
                updatedAtUtc = null,
            )

        fun aMissionDetailsDTO(
            missionEntity: MissionEntity = aMissionEntity(),
            attachedReportingIds: List<Int> = listOf(),
        ): MissionDetailsDTO = MissionDetailsDTO(mission = missionEntity, attachedReportingIds = attachedReportingIds)

        fun aMissionListDTO(
            missionEntity: MissionEntity = aMissionEntity(),
            attachedReportingIds: List<Int> = listOf(),
        ): MissionListDTO = MissionListDTO(mission = missionEntity, attachedReportingIds = attachedReportingIds)
    }
}
