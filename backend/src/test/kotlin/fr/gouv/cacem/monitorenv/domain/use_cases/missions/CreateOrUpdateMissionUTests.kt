package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import com.nhaarman.mockitokotlin2.*
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionNoteEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IFacadeAreasRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IPostgisFunctionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDetailsDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.events.UpdateMissionEvent
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.locationtech.jts.geom.MultiPoint
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import org.springframework.context.ApplicationEventPublisher
import org.springframework.test.context.junit.jupiter.SpringExtension
import java.time.ZonedDateTime
import java.util.*

@ExtendWith(SpringExtension::class)
@ExtendWith(OutputCaptureExtension::class)
class CreateOrUpdateMissionUTests {
    @Mock
    private val missionRepository: IMissionRepository = mock()

    @Mock
    private val facadeAreasRepository: IFacadeAreasRepository = mock()

    @Mock
    private val postgisFunctionRepository: IPostgisFunctionRepository = mock()

    @Mock
    private val applicationEventPublisher: ApplicationEventPublisher = mock()

    @Test
    fun `should return the mission to update with computed facade and observationsByUnit`(log: CapturedOutput) {
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
                missionSource = MissionSourceEnum.MONITORENV,
                hasMissionOrder = false,
                isDeleted = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
                createdAtUtc = null,
                updatedAtUtc = null,
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

        val expectedCreatedMission =
            MissionEntity(
                id = 100,
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                createdAtUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                updatedAtUtc = ZonedDateTime.now(),
                facade = "La Face Ade",
                hasMissionOrder = false,
                isDeleted = false,
                isGeometryComputedFromControls = false,
                isUnderJdp = false,
                missionSource = MissionSourceEnum.MONITORENV,
                missionTypes = listOf(MissionTypeEnum.LAND),
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                observationsByUnit = "observations",
            )

        given(postgisFunctionRepository.normalizeMultipolygon(polygon)).willReturn(polygon)
        given(facadeAreasRepository.findFacadeFromGeometry(anyOrNull())).willReturn("La Face Ade")
        val storedMission =
            missionToUpdate.copy(
                facade = "La Face Ade",
                envActions = existingEnvActions,
                observationsByUnit = "observations",
            )
        given(missionRepository.findById(100)).willReturn(storedMission)
        given(
            missionRepository.save(
                argThat {
                    this ==
                        missionToUpdate.copy(
                            facade = "La Face Ade",
                            envActions = existingEnvActions,
                            observationsByUnit = "observations",
                        )
                },
            ),
        )
            .willReturn(MissionDetailsDTO(mission = expectedCreatedMission))

        // When
        val createdMission =
            CreateOrUpdateMission(
                missionRepository = missionRepository,
                facadeRepository = facadeAreasRepository,
                eventPublisher = applicationEventPublisher,
                postgisFunctionRepository = postgisFunctionRepository,
            )
                .execute(
                    missionToUpdate,
                )

        // Then
        verify(facadeAreasRepository, times(1)).findFacadeFromGeometry(argThat { this == polygon })
        verify(postgisFunctionRepository, times(1)).normalizeMultipolygon(argThat { this == polygon })

        verify(missionRepository, times(1))
            .save(
                argThat {
                    this ==
                        missionToUpdate.copy(
                            facade = "La Face Ade",
                            envActions = existingEnvActions,
                            observationsByUnit = "observations",
                        )
                },
            )
        assertThat(createdMission).isEqualTo(expectedCreatedMission)
        assertThat(log.out).contains("Attempt to CREATE or UPDATE mission ${missionToUpdate.id}")
        assertThat(log.out).contains("Mission ${missionToUpdate.id} created or updated")
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
                missionSource = MissionSourceEnum.MONITORENV,
                hasMissionOrder = false,
                isDeleted = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
                createdAtUtc = null,
                updatedAtUtc = null,
            )

        val returnedSavedMission =
            MissionEntity(
                id = 100,
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                createdAtUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                updatedAtUtc = ZonedDateTime.now(),
                facade = "La Face Ade",
                hasMissionOrder = false,
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
            .willReturn(MissionDetailsDTO(mission = returnedSavedMission))

        // When
        val createdMission =
            CreateOrUpdateMission(
                missionRepository = missionRepository,
                facadeRepository = facadeAreasRepository,
                eventPublisher = applicationEventPublisher,
                postgisFunctionRepository = postgisFunctionRepository,
            )
                .execute(
                    missionToUpdate,
                )

        // Then
        assertThat(createdMission.createdAtUtc).isEqualTo(ZonedDateTime.parse("2022-01-23T20:29:03Z"))
    }

    @Test
    fun `should return the saved mission even if publish throw an exception`() {
        // Given
        val missionToUpdate =
            MissionEntity(
                id = 10,
                createdAtUtc = ZonedDateTime.parse("2025-01-01T20:29:03Z"),
                endDateTimeUtc = ZonedDateTime.parse("2025-01-25T20:29:03Z"),
                facade = "Outre-Mer",
                geom = null,
                hasMissionOrder = false,
                isDeleted = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
                missionSource = MissionSourceEnum.MONITORENV,
                missionTypes = listOf(MissionTypeEnum.LAND),
                startDateTimeUtc = ZonedDateTime.parse("2025-01-23T04:50:09Z"),
                updatedAtUtc = null,
            )

        val returnedSavedMission =
            MissionEntity(
                id = 10,
                createdAtUtc = ZonedDateTime.parse("2025-01-01T20:29:03Z"),
                endDateTimeUtc = ZonedDateTime.parse("2025-01-25T20:29:03Z"),
                facade = "Outre-Mer",
                geom = null,
                hasMissionOrder = false,
                isDeleted = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
                missionSource = MissionSourceEnum.MONITORENV,
                missionTypes = listOf(MissionTypeEnum.LAND, MissionTypeEnum.SEA),
                startDateTimeUtc = ZonedDateTime.parse("2025-01-23T04:50:09Z"),
                updatedAtUtc = ZonedDateTime.parse("2025-01-10T22:00:03Z"),
            )

        given(missionRepository.save(anyOrNull()))
            .willReturn(MissionDetailsDTO(mission = returnedSavedMission))
        given(applicationEventPublisher.publishEvent(UpdateMissionEvent(returnedSavedMission))).willThrow(
            Exception("Failed to send event"),
        )
        // When
        val createdMission =
            CreateOrUpdateMission(
                missionRepository = missionRepository,
                facadeRepository = facadeAreasRepository,
                eventPublisher = applicationEventPublisher,
                postgisFunctionRepository = postgisFunctionRepository,
            )
                .execute(
                    missionToUpdate,
                )

        // Then
        assertThat(createdMission).isEqualTo(returnedSavedMission)
    }
}
