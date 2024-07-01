package fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import java.time.ZonedDateTime
import kotlin.random.Random

class MissionFixture {

    companion object {
        fun aMissionEntity(observationsByUnit: String? = null): MissionEntity {
            return MissionEntity(
                id = Random.nextInt(),
                observationsByUnit = observationsByUnit,
                missionTypes = listOf(MissionTypeEnum.LAND),
                facade = "Outre-Mer",
                geom = null,
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                isDeleted = false,
                missionSource = MissionSourceEnum.MONITORENV,
                hasMissionOrder = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
            )
        }
    }
}
