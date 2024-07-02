package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import com.nhaarman.mockitokotlin2.argumentCaptor
import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.mock
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.entities.mission.CanDeleteMissionResponse
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture.Companion.aMissionEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDTO
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import java.time.ZonedDateTime
import java.util.*

class DeleteMissionUTests {

    private val getFullMission: GetFullMission = mock()

    private val missionRepository: IMissionRepository = mock()

    private val reportingRepository: IReportingRepository = mock()

    private val canDeleteMission: CanDeleteMission = mock()

    private val deleteMission: DeleteMission =
        DeleteMission(getFullMission, missionRepository, reportingRepository, canDeleteMission)

    @Test
    fun `execute Should detach reporting attached to mission and action attached to reporting`() {
        val missionId = 100
        val reporting =
            ReportingEntity(
                id = 1,
                attachedEnvActionId =
                UUID.fromString("33310163-4e22-4d3d-b585-dac4431eb4b5"),
                detachedFromMissionAtUtc = null,
                isArchived = false,
                createdAt = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                isDeleted = false,
                isInfractionProven = true,
            )
        val missionToDelete = aMissionEntity()

        val expectedUpdatedReporting =
            ReportingEntity(
                id = 1,
                attachedEnvActionId = null,
                createdAt = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                detachedFromMissionAtUtc = ZonedDateTime.now(),
                isArchived = false,
                isDeleted = false,
                isInfractionProven = true,
            )
        given(canDeleteMission.execute(missionId, MissionSourceEnum.MONITORFISH))
            .willReturn(CanDeleteMissionResponse(true, listOf()))
        given(getFullMission.execute(missionId))
            .willReturn(
                MissionDTO(
                    mission = missionToDelete,
                    attachedReportingIds = listOf(1),
                ),
            )
        given(reportingRepository.findById(1)).willReturn(ReportingDTO(reporting = reporting))
        given(reportingRepository.save(expectedUpdatedReporting))
            .willReturn(
                ReportingDTO(reporting = expectedUpdatedReporting),
            )

        deleteMission.execute(missionId, MissionSourceEnum.MONITORFISH)

        argumentCaptor<ReportingEntity>().apply {
            verify(reportingRepository).save(capture())

            assertThat(allValues.first().detachedFromMissionAtUtc).isNotNull()
            assertThat(allValues.first().attachedEnvActionId).isNull()
        }

        verify(missionRepository).delete(missionId)
    }

    @Test
    fun `execute should throw BackendUsageException when canDeleteMission returns false`() {
        val missionId = 100

        val missionToDelete = aMissionEntity()

        given(canDeleteMission.execute(missionId, MissionSourceEnum.MONITORFISH))
            .willReturn(CanDeleteMissionResponse(false, listOf(MissionSourceEnum.MONITORENV)))
        given(getFullMission.execute(missionId))
            .willReturn(
                MissionDTO(
                    mission = missionToDelete,
                    attachedReportingIds = null,
                ),
            )

        val throwable =
            Assertions.catchThrowable {
                deleteMission.execute(missionId, MissionSourceEnum.MONITORFISH)
            }

        val errorSources =
            object {
                var sources = listOf(MissionSourceEnum.MONITORENV)
            }
        assertThat(throwable)
            .isInstanceOf(
                BackendUsageException(
                    code = BackendUsageErrorCode.EXISTING_MISSION_ACTION,
                    data = errorSources,
                )::class
                    .java,
            )
    }

    @Test
    fun `execute should delete mission when canDeleteMission returns true`() {
        val missionId = 100

        val missionToDelete = aMissionEntity()

        given(canDeleteMission.execute(missionId, MissionSourceEnum.MONITORFISH))
            .willReturn(CanDeleteMissionResponse(true, listOf()))
        given(getFullMission.execute(missionId))
            .willReturn(
                MissionDTO(
                    mission = missionToDelete,
                    attachedReportingIds = listOf(),
                ),
            )

        deleteMission.execute(missionId, MissionSourceEnum.MONITORFISH)

        verify(missionRepository).delete(missionId)
    }
}
