package fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.fixtures.ControlUnitFixture.Companion.aLegacyControlUnit
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDetailsDTO
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
                observationsByUnit = observationsByUnit,
                openBy = openBy,
                completedBy = completedBy,
                missionTypes = missionTypes,
                facade = "Outre-Mer",
                geom = null,
                startDateTimeUtc = startDateTimeUtc,
                endDateTimeUtc = endDateTimeUtc,
                isDeleted = false,
                missionSource = MissionSourceEnum.MONITORENV,
                hasMissionOrder = false,
                isUnderJdp = isUnderJdp,
                isGeometryComputedFromControls = false,
                updatedAtUtc = null,
                createdAtUtc = null,
                envActions = envActions,
            )

        fun aMissionDetailsDTO(
            missionEntity: MissionEntity = aMissionEntity(),
            attachedReportingIds: List<Int> = listOf(),
        ): MissionDetailsDTO = MissionDetailsDTO(mission = missionEntity, attachedReportingIds = attachedReportingIds)
    }
}
