@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import com.nhaarman.mockitokotlin2.*
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionNoteEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IFacadeAreasRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.locationtech.jts.geom.MultiPoint
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.context.ApplicationEventPublisher
import org.springframework.test.context.junit.jupiter.SpringExtension
import java.time.ZonedDateTime
import java.util.*

@ExtendWith(SpringExtension::class)
class CreateOrUpdateMissionUTests {
    @MockBean private lateinit var missionRepository: IMissionRepository

    @MockBean private lateinit var facadeAreasRepository: IFacadeAreasRepository

    @MockBean private lateinit var applicationEventPublisher: ApplicationEventPublisher

    @Test
    fun `execute Should throw an exception when input mission is null`() {
        // When
        val throwable =
            Assertions.catchThrowable {
                CreateOrUpdateMission(
                    missionRepository = missionRepository,
                    facadeRepository = facadeAreasRepository,
                    eventPublisher = applicationEventPublisher,
                )
                    .execute(null)
            }

        // Then
        assertThat(throwable).isInstanceOf(IllegalArgumentException::class.java)
        assertThat(throwable.message).contains("No mission to create or update")
    }

    @Test
    fun `should return the mission to update with computed facade`() {
        // Given
        val wktReader = WKTReader()

        val multipolygonString =
            "MULTIPOLYGON(((-2.7335 47.6078, -2.7335 47.8452, -3.6297 47.8452, -3.6297 47.6078, -2.7335 47.6078)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon
        val multipointString = "MULTIPOINT((49.354105 -0.427455))"
        val point = wktReader.read(multipointString) as MultiPoint

        val missionToUpdate =
            MissionEntity(
                id = 100,
                missionTypes = listOf(MissionTypeEnum.LAND),
                facade = "Outre-Mer",
                geom = polygon,
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                isClosed = false,
                missionSource = MissionSourceEnum.MONITORENV,
                hasMissionOrder = false,
                isDeleted = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
            )

        val existingEnvActions =
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

        val expectedCreatedMission =
            MissionEntity(
                id = 100,
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                createdAtUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                updatedAtUtc = ZonedDateTime.now(),
                facade = "La Face Ade",
                hasMissionOrder = false,
                isClosed = false,
                isDeleted = false,
                isGeometryComputedFromControls = false,
                isUnderJdp = false,
                missionSource = MissionSourceEnum.MONITORENV,
                missionTypes = listOf(MissionTypeEnum.LAND),
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            )

        given(facadeAreasRepository.findFacadeFromGeometry(anyOrNull())).willReturn("La Face Ade")
        given(missionRepository.findById(100)).willReturn(missionToUpdate.copy(envActions = existingEnvActions))
        given(missionRepository.save(anyOrNull()))
            .willReturn(MissionDTO(mission = expectedCreatedMission))

        // When
        val createdMission =
            CreateOrUpdateMission(
                missionRepository = missionRepository,
                facadeRepository = facadeAreasRepository,
                eventPublisher = applicationEventPublisher,
            )
                .execute(
                    missionToUpdate,
                )

        // Then
        verify(facadeAreasRepository, times(1)).findFacadeFromGeometry(argThat { this == polygon })

        verify(missionRepository, times(1))
            .save(
                argThat {
                    this ==
                        missionToUpdate.copy(
                            facade = "La Face Ade",
                            envActions = existingEnvActions,
                        )
                },
            )
        assertThat(createdMission).isEqualTo(expectedCreatedMission)
    }

    @Test
    fun `should return the stored createAtUtc field When an update returned null createAtUtc`() {
        // Given
        val missionToUpdate =
            MissionEntity(
                id = 100,
                missionTypes = listOf(MissionTypeEnum.LAND),
                facade = "Outre-Mer",
                geom = null,
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                isClosed = false,
                missionSource = MissionSourceEnum.MONITORENV,
                hasMissionOrder = false,
                isDeleted = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
            )

        val returnedSavedMission =
            MissionEntity(
                id = 100,
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                createdAtUtc = null,
                updatedAtUtc = ZonedDateTime.now(),
                facade = "La Face Ade",
                hasMissionOrder = false,
                isClosed = false,
                isDeleted = false,
                isGeometryComputedFromControls = false,
                isUnderJdp = false,
                missionSource = MissionSourceEnum.MONITORENV,
                missionTypes = listOf(MissionTypeEnum.LAND),
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            )

        given(facadeAreasRepository.findFacadeFromGeometry(anyOrNull())).willReturn("La Face Ade")
        given(missionRepository.findById(100))
            .willReturn(missionToUpdate.copy(createdAtUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z")))
        given(missionRepository.save(anyOrNull()))
            .willReturn(MissionDTO(mission = returnedSavedMission))

        // When
        val createdMission =
            CreateOrUpdateMission(
                missionRepository = missionRepository,
                facadeRepository = facadeAreasRepository,
                eventPublisher = applicationEventPublisher,
            )
                .execute(
                    missionToUpdate,
                )

        // Then
        assertThat(createdMission.createdAtUtc).isEqualTo(ZonedDateTime.parse("2022-01-23T20:29:03Z"))
    }
}
