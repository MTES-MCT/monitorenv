package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import com.nhaarman.mockitokotlin2.*
import fr.gouv.cacem.monitorenv.domain.entities.ErrorCode
import fr.gouv.cacem.monitorenv.domain.entities.mission.CanDeleteMissionResponse
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDTO
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension
import java.time.ZonedDateTime
import java.util.*

@ExtendWith(SpringExtension::class)
class DeleteMissionUTests {
    @MockBean
    private lateinit var missionRepository: IMissionRepository

    @MockBean
    private lateinit var reportingRepository: IReportingRepository

    @MockBean
    private lateinit var canDeleteMission: CanDeleteMission

    @Test
    fun `execute Should detach reporting attached to mission and action attached to reporting`() {
        val missionId = 100
        val reporting = ReportingEntity(
            id = 1,
            attachedEnvActionId = UUID.fromString("33310163-4e22-4d3d-b585-dac4431eb4b5"),
            detachedFromMissionAtUtc = null,
            isArchived = false,
            createdAt = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
            isDeleted = false,
        )
        val envActions = listOf(
            EnvActionControlEntity(
                id =
                UUID.fromString(
                    "33310163-4e22-4d3d-b585-dac4431eb4b5",
                ),
                geom = null,
            ),
        )
        val missionToDelete = MissionEntity(
            id = missionId,
            endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
            envActions = envActions,
            facade = "Outre-Mer",
            geom = null,
            hasMissionOrder = false,
            isClosed = false,
            isDeleted = false,
            isGeometryComputedFromControls = false,
            isUnderJdp = false,
            missionSource = MissionSourceEnum.MONITORENV,
            missionTypes = listOf(MissionTypeEnum.LAND),
            startDateTimeUtc = ZonedDateTime.parse("2022-01-27T20:29:03Z"),
        )

        val expectedUpdatedReporting = ReportingEntity(
            id = 1,
            attachedEnvActionId = null,
            createdAt = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
            detachedFromMissionAtUtc = ZonedDateTime.now(),
            isArchived = false,
            isDeleted = false,
        )
        given(canDeleteMission.execute(missionId, MissionSourceEnum.MONITORFISH))
            .willReturn(CanDeleteMissionResponse(true, listOf()))
        given(missionRepository.findFullMissionById(missionId)).willReturn(
            MissionDTO(
                mission = missionToDelete,
                attachedReportingIds = listOf(1),
            ),

        )
        given(reportingRepository.findById(1)).willReturn(ReportingDTO(reporting = reporting))
        given(reportingRepository.save(expectedUpdatedReporting)).willReturn(
            ReportingDTO(reporting = expectedUpdatedReporting),
        )

        DeleteMission(
            missionRepository = missionRepository,
            reportingRepository = reportingRepository,
            canDeleteMission = canDeleteMission,
        ).execute(missionId, MissionSourceEnum.MONITORFISH)

        argumentCaptor<ReportingEntity>().apply {
            verify(reportingRepository).save(capture())

            Assertions.assertThat(allValues.first().detachedFromMissionAtUtc).isNotNull()
            Assertions.assertThat(allValues.first().attachedEnvActionId).isNull()
        }

        verify(missionRepository).delete(missionId)
    }

    @Test
    fun `execute should throw BackendUsageException when canDeleteMission returns false`() {
        val missionId = 100

        val wktReader = WKTReader()

        val multipolygonString =
            "MULTIPOLYGON(((-2.7335 47.6078, -2.7335 47.8452, -3.6297 47.8452, -3.6297 47.6078, -2.7335 47.6078)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon
        val envActionControl =
            EnvActionControlEntity(
                id = UUID.fromString("33310163-4e22-4d3d-b585-dac4431eb4b5"),
                geom = polygon,
            )

        val missionToDelete = MissionEntity(
            id = missionId,
            missionTypes = listOf(MissionTypeEnum.LAND),
            facade = "Outre-Mer",
            geom = null,
            startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
            isClosed = false,
            isDeleted = false,
            missionSource = MissionSourceEnum.MONITORENV,
            hasMissionOrder = false,
            isUnderJdp = false,
            isGeometryComputedFromControls = false,
            envActions = listOf(envActionControl),
        )
        given(canDeleteMission.execute(missionId, MissionSourceEnum.MONITORFISH))
            .willReturn(CanDeleteMissionResponse(false, listOf(MissionSourceEnum.MONITORENV)))
        given(missionRepository.findFullMissionById(missionId)).willReturn(
            MissionDTO(
                mission = missionToDelete,
                attachedReportingIds = null,
            ),

        )

        val throwable = Assertions.catchThrowable {
            DeleteMission(
                missionRepository = missionRepository,
                reportingRepository = reportingRepository,
                canDeleteMission = canDeleteMission,
            ).execute(missionId, MissionSourceEnum.MONITORFISH)
        }

        val errorSources = object {
            var sources = listOf(MissionSourceEnum.MONITORENV)
        }
        Assertions.assertThat(throwable).isInstanceOf(
            BackendUsageException(
                ErrorCode.EXISTING_MISSION_ACTION,
                errorSources,
            )::class.java,
        )
    }

    @Test
    fun `execute should delete mission when canDeleteMission returns true`() {
        val missionId = 100

        val missionToDelete = MissionEntity(
            id = missionId,
            missionTypes = listOf(MissionTypeEnum.LAND),
            facade = "Outre-Mer",
            geom = null,
            startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
            isClosed = false,
            isDeleted = false,
            missionSource = MissionSourceEnum.MONITORENV,
            hasMissionOrder = false,
            isUnderJdp = false,
            isGeometryComputedFromControls = false,
            envActions = listOf(),
        )

        given(canDeleteMission.execute(missionId, MissionSourceEnum.MONITORFISH))
            .willReturn(CanDeleteMissionResponse(true, listOf()))
        given(missionRepository.findFullMissionById(missionId)).willReturn(
            MissionDTO(
                mission = missionToDelete,
                attachedReportingIds = listOf(),
            ),
        )

        DeleteMission(
            missionRepository = missionRepository,
            reportingRepository = reportingRepository,
            canDeleteMission = canDeleteMission,
        ).execute(missionId, MissionSourceEnum.MONITORFISH)

        verify(missionRepository).delete(missionId)
    }
}
