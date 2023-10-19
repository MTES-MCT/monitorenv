@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases

import com.nhaarman.mockitokotlin2.anyOrNull
import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.times
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.entities.mission.*
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.CreateOrUpdateMission
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.CreateOrUpdateMissionWithAttachedReporting
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension
import java.time.ZonedDateTime
import java.util.*

@ExtendWith(SpringExtension::class)
class CreateOrUpdateMissionWithAttachedReportingUTests {

    @MockBean
    private lateinit var createOrUpdateMission: CreateOrUpdateMission

    @MockBean
    private lateinit var missionRepository: IMissionRepository

    @MockBean
    private lateinit var reportingRepository: IReportingRepository

    @Test
    fun `should attach mission to specified reportings`() {
        // Given
        val wktReader = WKTReader()

        val multipolygonString = "MULTIPOLYGON(((-2.7335 47.6078, -2.7335 47.8452, -3.6297 47.8452, -3.6297 47.6078, -2.7335 47.6078)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon

        val missionToCreate = MissionEntity(
            missionTypes = listOf(MissionTypeEnum.LAND),
            facade = "Outre-Mer",
            geom = polygon,
            startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
            isClosed = false,
            isDeleted = false,
            missionSource = MissionSourceEnum.MONITORENV,
            hasMissionOrder = false,
            isUnderJdp = false,
            isGeometryComputedFromControls = false,

        )
        val attachedReportingIds = listOf(1, 2, 3)

        val expectedCreatedMission =
            MissionDTO(
                mission = MissionEntity(
                    id = 100,
                    missionTypes = listOf(MissionTypeEnum.LAND),
                    facade = "Outre-Mer",
                    startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                    endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                    isClosed = false,
                    isDeleted = false,
                    missionSource = MissionSourceEnum.MONITORENV,
                    hasMissionOrder = false,
                    isUnderJdp = false,
                    isGeometryComputedFromControls = false,
                ),
                attachedReportingIds = attachedReportingIds,
            )

        given(createOrUpdateMission.execute(anyOrNull())).willReturn(missionToCreate.copy(id = 100))
        given(missionRepository.save(anyOrNull())).willReturn(MissionDTO(mission = missionToCreate.copy(id = 100)))
        given(missionRepository.findFullMissionById(100)).willReturn(expectedCreatedMission)

        // When
        val createdMissionDTO = CreateOrUpdateMissionWithAttachedReporting(
            createOrUpdateMission = createOrUpdateMission,
            missionRepository = missionRepository,
            reportingRepository = reportingRepository,
        ).execute(
            mission = missionToCreate,
            attachedReportingIds = attachedReportingIds,
            envActionsAttachedToReportingIds = listOf(),
        )

        // Then

        verify(reportingRepository, times(1)).attachReportingsToMission(attachedReportingIds, 100)
        verify(missionRepository, times(1)).findFullMissionById(100)
        assertThat(createdMissionDTO).isEqualTo(expectedCreatedMission)
    }
}
