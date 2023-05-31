
package fr.gouv.cacem.monitorenv.domain.use_cases // ktlint-disable package-name

import com.nhaarman.mockitokotlin2.anyOrNull
import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.times
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.entities.missions.*
import fr.gouv.cacem.monitorenv.domain.repositories.IDepartmentAreasRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IFacadeAreasRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.UpdateMission
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.catchThrowable
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
class UpdateMissionUTests {

    @MockBean
    private lateinit var departmentRepository: IDepartmentAreasRepository

    @MockBean
    private lateinit var missionRepository: IMissionRepository

    @MockBean
    private lateinit var facadeAreasRepository: IFacadeAreasRepository

    @Test
    fun `execute Should throw an exception When no mission to update is given`() {
        // When
        val throwable = catchThrowable {
            UpdateMission(departmentRepository, missionRepository, facadeAreasRepository)
                .execute(null)
        }

        // Then
        assertThat(throwable).isInstanceOf(IllegalArgumentException::class.java)
        assertThat(throwable.message).contains("No mission to update")
    }

    @Test
    fun `execute Should return the updated mission When a field to update is given`() {
        // Given
        val wktReader = WKTReader()

        val multipolygonString = "MULTIPOLYGON(((-2.7335 47.6078, -2.7335 47.8452, -3.6297 47.8452, -3.6297 47.6078, -2.7335 47.6078)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon

        val multipointString = "MULTIPOINT((49.354105 -0.427455))"
        val point = wktReader.read(multipointString) as MultiPoint

        val missionToUpdate = MissionEntity(
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
                    geom = polygon
                ),
                EnvActionNoteEntity(
                    id = UUID.fromString("a6c4bd17-eb45-4504-ab15-7a18ea714a10"),
                    observations = "Quelqu'un aurait vu quelque chose quelque part à un certain moment."
                )
            )
        )

        val expectedUpdatedMission = missionToUpdate.copy(
            facade = null,
            envActions = listOf(
                EnvActionControlEntity(
                    id = UUID.fromString("33310163-4e22-4d3d-b585-dac4431eb4b5"),
                    geom = point,
                    facade = "La Face Ade",
                    department = "Quequ'part"
                ),
                EnvActionSurveillanceEntity(
                    id = UUID.fromString("a6c4bd17-eb45-4504-ab15-7a18ea714a10"),
                    geom = polygon,
                    facade = "La Face Ade",
                    department = "Quequ'part"
                ),
                EnvActionNoteEntity(
                    id = UUID.fromString("a6c4bd17-eb45-4504-ab15-7a18ea714a10"),
                    observations = "Quelqu'un aurait vu quelque chose quelque part à un certain moment."
                )
            )
        )

        given(missionRepository.save(expectedUpdatedMission)).willReturn(
            expectedUpdatedMission,
        )
        given(facadeAreasRepository.findFacadeFromGeometry(anyOrNull())).willReturn("La Face Ade")
        given(departmentRepository.findDepartmentFromGeometry(anyOrNull())).willReturn("Quequ'part")

        // When
        val updatedMission = UpdateMission(departmentRepository, missionRepository, facadeAreasRepository)
            .execute(missionToUpdate)

        // Then
        verify(missionRepository, times(1)).save(expectedUpdatedMission)
        assertThat(updatedMission).isEqualTo(expectedUpdatedMission)
    }
}
