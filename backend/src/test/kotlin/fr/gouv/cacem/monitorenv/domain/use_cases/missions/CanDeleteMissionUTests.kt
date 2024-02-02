package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.ErrorCode
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMonitorFishMissionActionsRepository
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
class CanDeleteMissionUTests {
    @MockBean
    private lateinit var missionRepository: IMissionRepository

    @MockBean
    private lateinit var monitorFishMissionActionsRepository: IMonitorFishMissionActionsRepository

    @Test
    fun `execute Should return true when haven't Env Actions and request come from Fish`() {
        val missionId = 57

        given(missionRepository.findById(missionId)).willReturn(
            MissionEntity(
                id = 57,
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
            ),
        )

        val result = CanDeleteMission(
            missionRepository = missionRepository,
            monitorFishMissionActionsRepository = monitorFishMissionActionsRepository,
        ).execute(missionId, MissionSourceEnum.MONITORFISH)

        Assertions.assertThat(result).isEqualTo(true)
    }

    @Test
    fun `execute Should throw an exception when have Env Actions and request come from Fish`() {
        val missionId = 34

        val wktReader = WKTReader()

        val multipolygonString =
            "MULTIPOLYGON(((-2.7335 47.6078, -2.7335 47.8452, -3.6297 47.8452, -3.6297 47.6078, -2.7335 47.6078)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon
        val envActionControl =
            EnvActionControlEntity(
                id = UUID.fromString("33310163-4e22-4d3d-b585-dac4431eb4b5"),
                geom = polygon,
            )
        given(missionRepository.findById(missionId)).willReturn(
            MissionEntity(
                id = 34,
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
            ),
        )

        val throwable = Assertions.catchThrowable {
            CanDeleteMission(
                missionRepository = missionRepository,
                monitorFishMissionActionsRepository = monitorFishMissionActionsRepository,
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
}
