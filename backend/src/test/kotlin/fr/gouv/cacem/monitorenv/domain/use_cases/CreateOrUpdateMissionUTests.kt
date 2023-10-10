package fr.gouv.cacem.monitorenv.domain.use_cases // ktlint-disable package-name

import com.nhaarman.mockitokotlin2.anyOrNull
import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.times
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.entities.mission.*
import fr.gouv.cacem.monitorenv.domain.repositories.IBaseRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IDepartmentAreaRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IFacadeAreasRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.CreateOrUpdateMission
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.locationtech.jts.geom.MultiPoint
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension
import java.time.ZonedDateTime
import java.util.*

@ExtendWith(SpringExtension::class)
class CreateOrUpdateMissionUTests {
    @MockBean
    private lateinit var baseRepository: IBaseRepository

    @MockBean
    private lateinit var departmentRepository: IDepartmentAreaRepository

    @MockBean
    private lateinit var missionRepository: IMissionRepository

    @MockBean
    private lateinit var facadeAreasRepository: IFacadeAreasRepository

    @Test
    fun `execute Should throw an exception When input mission is null`() {
        // When
        val throwable = Assertions.catchThrowable {
            CreateOrUpdateMission(baseRepository, departmentRepository, missionRepository, facadeAreasRepository)
                .execute(null)
        }

        // Then
        assertThat(throwable).isInstanceOf(IllegalArgumentException::class.java)
        assertThat(throwable.message).contains("No mission to create or update")
    }

    @Test
    fun `should return the mission to create or update with computed facade and department info`() {
        // Given
        val wktReader = WKTReader()

        val multipolygonString =
            "MULTIPOLYGON(((-2.7335 47.6078, -2.7335 47.8452, -3.6297 47.8452, -3.6297 47.6078, -2.7335 47.6078)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon

        val multipointString = "MULTIPOINT((49.354105 -0.427455))"
        val point = wktReader.read(multipointString) as MultiPoint

        val missionToCreate = MissionEntity(
            missionTypes = listOf(MissionTypeEnum.LAND),
            facade = "Outre-Mer",
            startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
            isClosed = false,
            isDeleted = false,
            missionSource = MissionSourceEnum.MONITORENV,
            hasMissionOrder = false,
            isUnderJdp = false,
            envActions = listOf(
                EnvActionControlEntity(
                    id = UUID.fromString("33310163-4e22-4d3d-b585-dac4431eb4b5"),
                    geom = point,
                ),
                EnvActionSurveillanceEntity(
                    id = UUID.fromString("a6c4bd17-eb45-4504-ab15-7a18ea714a10"),
                    geom = polygon,
                ),
                EnvActionNoteEntity(
                    id = UUID.fromString("a6c4bd17-eb45-4504-ab15-7a18ea714a10"),
                    observations = "Quelqu'un aurait vu quelque chose quelque part à un certain moment.",
                ),
            ),
            isGeometryComputedFromControls = false,
        )

        val expectedCreatedMission = missionToCreate.copy(
            facade = null,
            envActions = listOf(
                EnvActionControlEntity(
                    id = UUID.fromString("33310163-4e22-4d3d-b585-dac4431eb4b5"),
                    geom = point,
                    facade = "La Face Ade",
                    department = "Quequ'part",
                ),
                EnvActionSurveillanceEntity(
                    id = UUID.fromString("a6c4bd17-eb45-4504-ab15-7a18ea714a10"),
                    geom = polygon,
                    facade = "La Face Ade",
                    department = "Quequ'part",
                ),
                EnvActionNoteEntity(
                    id = UUID.fromString("a6c4bd17-eb45-4504-ab15-7a18ea714a10"),
                    observations = "Quelqu'un aurait vu quelque chose quelque part à un certain moment.",
                ),
            ),
        )

        given(missionRepository.save(expectedCreatedMission)).willReturn(expectedCreatedMission)
        given(facadeAreasRepository.findFacadeFromGeometry(anyOrNull())).willReturn("La Face Ade")
        given(departmentRepository.findDepartmentFromGeometry(anyOrNull())).willReturn("Quequ'part")

        // When
        val createdMission =
            CreateOrUpdateMission(
                baseRepository,
                departmentRepository,
                missionRepository,
                facadeAreasRepository
            ).execute(
                missionToCreate
            )

        // Then
        verify(missionRepository, times(1)).save(expectedCreatedMission)
        assertThat(createdMission).isEqualTo(expectedCreatedMission)
    }
}
