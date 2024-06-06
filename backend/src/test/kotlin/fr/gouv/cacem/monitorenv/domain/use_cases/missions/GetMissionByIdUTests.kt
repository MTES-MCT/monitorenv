package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.rapportnav.RapportNavMissionActionEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IRapportNavMissionActionsRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension
import java.time.ZonedDateTime

@ExtendWith(SpringExtension::class)
class GetMissionByIdUTests {
    @MockBean
    private lateinit var missionRepository: IMissionRepository

    @MockBean
    private lateinit var rapportNavMissionActionsRepository: IRapportNavMissionActionsRepository

    @Test
    fun `execute should return mission with rapportNavActions`() {
        val missionId = 10
        val wktReader = WKTReader()

        val multipolygonString =
            "MULTIPOLYGON(((-2.7335 47.6078, -2.7335 47.8452, -3.6297 47.8452, -3.6297 47.6078, -2.7335 47.6078)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon

        val mission = MissionDTO(
            mission =
            MissionEntity(
                id = 10,
                missionTypes = listOf(MissionTypeEnum.LAND),
                facade = "Outre-Mer",
                geom = polygon,
                observationsCacem = null,
                startDateTimeUtc =
                ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                endDateTimeUtc =
                ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                createdAtUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                updatedAtUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                isDeleted = false,
                missionSource = MissionSourceEnum.MONITORENV,
                hasMissionOrder = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
            ),
        )
        val rapportNavActions = RapportNavMissionActionEntity(
            id = 1,
            containsActionsAddedByUnit = true,
        )

        given(missionRepository.findFullMissionById(missionId)).willReturn(mission)
        given(rapportNavMissionActionsRepository.findRapportNavMissionActionsById(missionId)).willReturn(
            rapportNavActions,
        )

        val result = GetMissionById(missionRepository, rapportNavMissionActionsRepository).execute(missionId)

        assertThat(result).isEqualTo(mission.copy(hasRapportNavActions = rapportNavActions))
    }

    @Test
    fun `execute should return mission with hasRapportNavActions null on exception`() {
        val missionId = 10
        val wktReader = WKTReader()

        val multipolygonString =
            "MULTIPOLYGON(((-2.7335 47.6078, -2.7335 47.8452, -3.6297 47.8452, -3.6297 47.6078, -2.7335 47.6078)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon

        val mission = MissionDTO(
            mission =
            MissionEntity(
                id = 10,
                missionTypes = listOf(MissionTypeEnum.LAND),
                facade = "Outre-Mer",
                geom = polygon,
                observationsCacem = null,
                startDateTimeUtc =
                ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                endDateTimeUtc =
                ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                createdAtUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                updatedAtUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                isDeleted = false,
                missionSource = MissionSourceEnum.MONITORENV,
                hasMissionOrder = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
            ),
        )

        given(missionRepository.findFullMissionById(missionId)).willReturn(mission)
        given(rapportNavMissionActionsRepository.findRapportNavMissionActionsById(missionId)).willThrow(
            RuntimeException::class.java,
        )

        val result = GetMissionById(missionRepository, rapportNavMissionActionsRepository).execute(missionId)

        assertThat(mission.copy(hasRapportNavActions = null)).isEqualTo(result)
    }

    @Test
    fun `execute should return mission with hasRapportNavActions false when no actions are found`() {
        val missionId = 10
        val wktReader = WKTReader()

        val multipolygonString =
            "MULTIPOLYGON(((-2.7335 47.6078, -2.7335 47.8452, -3.6297 47.8452, -3.6297 47.6078, -2.7335 47.6078)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon

        val mission = MissionDTO(
            mission =
            MissionEntity(
                id = 10,
                missionTypes = listOf(MissionTypeEnum.LAND),
                facade = "Outre-Mer",
                geom = polygon,
                observationsCacem = null,
                startDateTimeUtc =
                ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                endDateTimeUtc =
                ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                createdAtUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                updatedAtUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                isDeleted = false,
                missionSource = MissionSourceEnum.MONITORENV,
                hasMissionOrder = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
            ),
        )
        val rapportNavActions = RapportNavMissionActionEntity(
            id = 1,
            containsActionsAddedByUnit = false,
        )

        given(missionRepository.findFullMissionById(missionId)).willReturn(mission)
        given(rapportNavMissionActionsRepository.findRapportNavMissionActionsById(missionId)).willReturn(
            rapportNavActions,
        )

        val result = GetMissionById(missionRepository, rapportNavMissionActionsRepository).execute(missionId)

        assertThat(mission.copy(hasRapportNavActions = rapportNavActions)).isEqualTo(result)
    }
}
