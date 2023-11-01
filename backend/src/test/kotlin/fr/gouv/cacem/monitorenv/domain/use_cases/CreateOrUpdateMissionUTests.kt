@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases

import com.nhaarman.mockitokotlin2.*
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionNoteEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IDepartmentAreaRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IFacadeAreasRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.CreateOrUpdateMission
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
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
    @MockBean private lateinit var departmentRepository: IDepartmentAreaRepository

    @MockBean private lateinit var missionRepository: IMissionRepository

    @MockBean private lateinit var facadeAreasRepository: IFacadeAreasRepository

    @Test
    fun `execute Should throw an exception when input mission is null`() {
        // When
        val throwable =
            Assertions.catchThrowable {
                CreateOrUpdateMission(
                    departmentRepository = departmentRepository,
                    missionRepository = missionRepository,
                    facadeRepository = facadeAreasRepository
                )
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

        val missionToCreate =
            MissionEntity(
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
                envActions =
                listOf(
                    EnvActionControlEntity(
                        id =
                        UUID.fromString(
                            "33310163-4e22-4d3d-b585-dac4431eb4b5"
                        ),
                        geom = point
                    ),
                    EnvActionSurveillanceEntity(
                        id =
                        UUID.fromString(
                            "a6c4bd17-eb45-4504-ab15-7a18ea714a10"
                        ),
                        geom = polygon
                    ),
                    EnvActionNoteEntity(
                        id =
                        UUID.fromString(
                            "a6c4bd17-eb45-4504-ab15-7a18ea714a10"
                        ),
                        observations =
                        "Quelqu'un aurait vu quelque chose quelque part à un certain moment."
                    )
                ),
                isGeometryComputedFromControls = false
            )

        val expectedCreatedMission =
            MissionEntity(
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
                envActions =
                listOf(
                    EnvActionControlEntity(
                        id =
                        UUID.fromString(
                            "33310163-4e22-4d3d-b585-dac4431eb4b5"
                        ),
                        geom = point,
                        facade = "La Face Ade",
                        department = "Quequ'part"
                    ),
                    EnvActionSurveillanceEntity(
                        id =
                        UUID.fromString(
                            "a6c4bd17-eb45-4504-ab15-7a18ea714a10"
                        ),
                        geom = polygon,
                        facade = "La Face Ade",
                        department = "Quequ'part"
                    ),
                    EnvActionNoteEntity(
                        id =
                        UUID.fromString(
                            "a6c4bd17-eb45-4504-ab15-7a18ea714a10"
                        ),
                        observations =
                        "Quelqu'un aurait vu quelque chose quelque part à un certain moment."
                    )
                )
            )

        given(facadeAreasRepository.findFacadeFromGeometry(anyOrNull())).willReturn("La Face Ade")
        given(departmentRepository.findDepartmentFromGeometry(anyOrNull())).willReturn("Quequ'part")
        given(missionRepository.save(anyOrNull()))
            .willReturn(MissionDTO(mission = expectedCreatedMission))
        given(missionRepository.findById(100)).willReturn(expectedCreatedMission)

        // When
        val createdMission =
            CreateOrUpdateMission(
                departmentRepository = departmentRepository,
                missionRepository = missionRepository,
                facadeRepository = facadeAreasRepository
            )
                .execute(
                    missionToCreate
                )

        // Then
        verify(facadeAreasRepository, times(2)).findFacadeFromGeometry(argThat { this == polygon })
        verify(facadeAreasRepository, times(1)).findFacadeFromGeometry(argThat { this == point })

        verify(missionRepository, times(1))
            .save(
                argThat {
                    this ==
                        missionToCreate.copy(
                            facade = "La Face Ade",
                            envActions =
                            missionToCreate.envActions?.map {
                                when (it) {
                                    is EnvActionControlEntity ->
                                        it.copy(
                                            facade = "La Face Ade",
                                            department =
                                            "Quequ'part"
                                        )
                                    is EnvActionSurveillanceEntity ->
                                        it.copy(
                                            facade = "La Face Ade",
                                            department =
                                            "Quequ'part"
                                        )
                                    else -> it
                                }
                            }
                        )
                }
            )
        verify(missionRepository, times(1)).findById(100)
        assertThat(createdMission).isEqualTo(expectedCreatedMission)
    }
}
