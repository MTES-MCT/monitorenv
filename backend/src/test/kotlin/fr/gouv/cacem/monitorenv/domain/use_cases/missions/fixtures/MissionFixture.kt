package fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDetailsDTO
import java.time.ZonedDateTime
import kotlin.random.Random

class MissionFixture {
    companion object {
        fun aMissionEntity(
            id: Int? = Random.nextInt(),
            startDateTimeUtc: ZonedDateTime = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            endDateTimeUtc: ZonedDateTime? = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
            observationsByUnit: String? = null,
            envActions: List<EnvActionEntity> = listOf(),
        ): MissionEntity {
            return MissionEntity(
                id = id,
                observationsByUnit = observationsByUnit,
                missionTypes = listOf(MissionTypeEnum.LAND),
                envActions = envActions,
                facade = "Outre-Mer",
                geom = null,
                startDateTimeUtc = startDateTimeUtc,
                endDateTimeUtc = endDateTimeUtc,
                isDeleted = false,
                missionSource = MissionSourceEnum.MONITORENV,
                hasMissionOrder = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
                updatedAtUtc = null,
                createdAtUtc = null,
            )
        }

        fun aMissionDetailsDTO(
            missionEntity: MissionEntity = aMissionEntity(),
            attachedReportingIds: List<Int> = listOf(),
        ): MissionDetailsDTO {
            return MissionDetailsDTO(mission = missionEntity, attachedReportingIds = attachedReportingIds)
        }
    }
}
