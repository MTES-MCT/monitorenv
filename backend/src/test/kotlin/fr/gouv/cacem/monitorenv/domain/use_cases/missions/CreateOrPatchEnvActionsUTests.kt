@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import com.nhaarman.mockitokotlin2.anyOrNull
import com.nhaarman.mockitokotlin2.argThat
import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.times
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionNoteEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IDepartmentAreaRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IFacadeAreasRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IPostgisFunctionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.locationtech.jts.geom.MultiPoint
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.test.context.junit.jupiter.SpringExtension
import java.time.ZonedDateTime
import java.util.UUID

@ExtendWith(SpringExtension::class)
class CreateOrPatchEnvActionsUTests {
    @Mock
    private val departmentRepository: IDepartmentAreaRepository = mock()

    @Mock
    private val missionRepository: IMissionRepository = mock()

    @Mock
    private val facadeAreasRepository: IFacadeAreasRepository = mock()

    @Mock
    private val postgisFunctionRepository: IPostgisFunctionRepository = mock()

    @Test
    fun `should return the mission to update with computed facade and department info for envActions`() {
        // Given
        val wktReader = WKTReader()

        val multipolygonString =
            "MULTIPOLYGON(((-2.7335 47.6078, -2.7335 47.8452, -3.6297 47.8452, -3.6297 47.6078, -2.7335 47.6078)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon

        val multipointString = "MULTIPOINT((49.354105 -0.427455))"
        val point = wktReader.read(multipointString) as MultiPoint

        val envActions =
            listOf(
                EnvActionControlEntity(
                    id =
                    UUID.fromString(
                        "33310163-4e22-4d3d-b585-dac4431eb4b5",
                    ),
                    geom = point,
                ),
                EnvActionSurveillanceEntity(
                    id =
                    UUID.fromString(
                        "a6c4bd17-eb45-4504-ab15-7a18ea714a10",
                    ),
                    geom = polygon,
                    awareness = null,
                ),
                EnvActionNoteEntity(
                    id =
                    UUID.fromString(
                        "a6c4bd17-eb45-4504-ab15-7a18ea714a10",
                    ),
                    observations =
                    "Quelqu'un aurait vu quelque chose quelque part à un certain moment.",
                ),
            )

        val updatedEnvActions =
            listOf(
                EnvActionControlEntity(
                    id =
                    UUID.fromString(
                        "33310163-4e22-4d3d-b585-dac4431eb4b5",
                    ),
                    geom = point,
                    facade = "La Face Ade",
                    department = "Quequ'part",
                ),
                EnvActionSurveillanceEntity(
                    id =
                    UUID.fromString(
                        "a6c4bd17-eb45-4504-ab15-7a18ea714a10",
                    ),
                    geom = polygon,
                    facade = "La Face Ade",
                    department = "Quequ'part",
                    awareness = null,
                ),
                EnvActionNoteEntity(
                    id =
                    UUID.fromString(
                        "a6c4bd17-eb45-4504-ab15-7a18ea714a10",
                    ),
                    observations =
                    "Quelqu'un aurait vu quelque chose quelque part à un certain moment.",
                ),
            )

        val missionToUpdate =
            MissionEntity(
                id = 100,
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                envActions = envActions,
                facade = "Outre-Mer",
                geom = polygon,
                hasMissionOrder = false,
                isDeleted = false,
                isGeometryComputedFromControls = false,
                isUnderJdp = false,
                missionSource = MissionSourceEnum.MONITORENV,
                missionTypes = listOf(MissionTypeEnum.LAND),
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            )

        val expectedUpdatedMission =
            MissionEntity(
                id = 100,
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                envActions = updatedEnvActions,
                facade = "Outre-Mer",
                geom = polygon,
                hasMissionOrder = false,
                isDeleted = false,
                isGeometryComputedFromControls = false,
                isUnderJdp = false,
                missionSource = MissionSourceEnum.MONITORENV,
                missionTypes = listOf(MissionTypeEnum.LAND),
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            )

        given(postgisFunctionRepository.normalizeGeometry(point)).willReturn(point)
        given(postgisFunctionRepository.normalizeGeometry(polygon)).willReturn(polygon)
        given(facadeAreasRepository.findFacadeFromGeometry(anyOrNull())).willReturn("La Face Ade")
        given(departmentRepository.findDepartmentFromGeometry(anyOrNull())).willReturn("Quequ'part")
        given(missionRepository.save(anyOrNull()))
            .willReturn(MissionDTO(mission = expectedUpdatedMission))

        // When
        val createdMission =
            CreateOrUpdateEnvActions(
                departmentRepository = departmentRepository,
                missionRepository = missionRepository,
                facadeRepository = facadeAreasRepository,
                postgisFunctionRepository = postgisFunctionRepository,
            )
                .execute(
                    mission = missionToUpdate,
                    envActions = envActions,
                )

        // Then
        verify(facadeAreasRepository, times(1)).findFacadeFromGeometry(argThat { this == point })
        verify(departmentRepository, times(1)).findDepartmentFromGeometry(argThat { this == polygon })
        verify(departmentRepository, times(1)).findDepartmentFromGeometry(argThat { this == point })
        verify(postgisFunctionRepository, times(1)).normalizeGeometry(argThat { this == point })
        verify(postgisFunctionRepository, times(1)).normalizeGeometry(argThat { this == polygon })

        verify(missionRepository, times(1))
            .save(
                argThat {
                    this ==
                            missionToUpdate.copy(
                                envActions =
                                missionToUpdate.envActions?.map {
                                    when (it) {
                                        is EnvActionControlEntity ->
                                            it.copy(
                                                facade = "La Face Ade",
                                                department =
                                                "Quequ'part",
                                            )

                                        is EnvActionSurveillanceEntity ->
                                            it.copy(
                                                facade = "La Face Ade",
                                                department =
                                                "Quequ'part",
                                            )

                                        else -> it
                                    }
                                },
                            )
                },
            )
        assertThat(createdMission).isEqualTo(expectedUpdatedMission)
    }
}
