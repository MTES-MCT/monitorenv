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
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IFacadeAreasRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IPostgisFunctionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missionTag.fixtures.MissionTagFixture.Companion.aMissionTagEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDetailsDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture.Companion.aMissionEntity
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
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
import java.util.UUID

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
    fun `should save mission with computed facade with monitorenv and rapportNav specific data when it comes from public api`(
        log: CapturedOutput,
    ) {
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
                createdAtUtc = null,
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                facade = "Outre-Mer",
                geom = polygon,
                hasMissionOrder = false,
                isDeleted = false,
                isNoteworthy = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
                missionSource = MissionSourceEnum.MONITORENV,
                missionTypes = listOf(MissionTypeEnum.LAND),
                missionTags = listOf(),
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
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
                    tags = listOf(),
                    themes = listOf(),
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
                    tags = listOf(),
                    themes = listOf(),
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
                createdAtUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                facade = "La Face Ade",
                hasMissionOrder = false,
                isDeleted = false,
                isNoteworthy = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
                missionSource = MissionSourceEnum.MONITORENV,
                missionTypes = listOf(MissionTypeEnum.LAND),
                missionTags = listOf(),
                observationsByUnit = "observations",
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                updatedAtUtc = ZonedDateTime.now(),
            )

        given(postgisFunctionRepository.normalizeMultipolygon(polygon)).willReturn(polygon)
        given(facadeAreasRepository.findFacadeFromGeometry(anyOrNull())).willReturn("La Face Ade")
        val storedMission =
            missionToUpdate.copy(
                facade = "La Face Ade",
                envActions = existingEnvActions,
                observationsByUnit = "observations",
                missionTags = listOf(aMissionTagEntity()),
            )
        given(missionRepository.findById(100)).willReturn(storedMission)
        given(
            missionRepository.save(
                argThat {
                    this ==
                        missionToUpdate.copy(
                            facade = "La Face Ade",
                            envActions = existingEnvActions,
                            isNoteworthy = false,
                            observationsByUnit = "observations",
                            missionTags = listOf(aMissionTagEntity()),
                        )
                },
            ),
        ).willReturn(MissionDetailsDTO(mission = expectedCreatedMission))

        // When
        val createdMission =
            CreateOrUpdateMission(
                missionRepository = missionRepository,
                facadeRepository = facadeAreasRepository,
                eventPublisher = applicationEventPublisher,
                postgisFunctionRepository = postgisFunctionRepository,
            ).execute(
                missionToUpdate,
                fromPublicAPI = true,
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
                            isDeleted = false,
                            missionTags = listOf(aMissionTagEntity()),
                            observationsByUnit = "observations",
                        )
                },
            )
        assertThat(createdMission).isEqualTo(expectedCreatedMission)
        assertThat(log.out).contains("Attempt to CREATE or UPDATE mission ${missionToUpdate.id}")
        assertThat(log.out).contains("Mission ${missionToUpdate.id} created or updated")
    }

    @Test
    fun `should return the mission to update with computed facade with rapportNav specific data when it comes from private api`(
        log: CapturedOutput,
    ) {
        // Given
        val wktReader = WKTReader()

        val multipolygonString =
            "MULTIPOLYGON(((-2.7335 47.6078, -2.7335 47.8452, -3.6297 47.8452, -3.6297 47.6078, -2.7335 47.6078)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon

        val missionToUpdate =
            MissionEntity(
                id = 100,
                createdAtUtc = null,
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                facade = "Outre-Mer",
                geom = polygon,
                hasMissionOrder = false,
                isDeleted = false,
                isNoteworthy = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
                missionSource = MissionSourceEnum.MONITORENV,
                missionTypes = listOf(MissionTypeEnum.LAND),
                missionTags = listOf(),
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                updatedAtUtc = null,
            )

        val expectedCreatedMission =
            MissionEntity(
                id = 100,
                createdAtUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                facade = "La Face Ade",
                hasMissionOrder = false,
                isDeleted = false,
                isNoteworthy = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
                missionSource = MissionSourceEnum.MONITORENV,
                missionTypes = listOf(MissionTypeEnum.LAND),
                missionTags = listOf(),
                observationsByUnit = "observations",
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                updatedAtUtc = ZonedDateTime.now(),
            )

        given(postgisFunctionRepository.normalizeMultipolygon(polygon)).willReturn(polygon)
        given(facadeAreasRepository.findFacadeFromGeometry(anyOrNull())).willReturn("La Face Ade")
        val storedMission =
            missionToUpdate.copy(
                facade = "La Face Ade",
                observationsByUnit = "observations",
            )
        given(missionRepository.findById(100)).willReturn(storedMission)
        given(
            missionRepository.save(
                argThat {
                    this ==
                        missionToUpdate.copy(
                            facade = "La Face Ade",
                            observationsByUnit = "observations",
                        )
                },
            ),
        ).willReturn(MissionDetailsDTO(mission = expectedCreatedMission))

        // When
        val createdMission =
            CreateOrUpdateMission(
                missionRepository = missionRepository,
                facadeRepository = facadeAreasRepository,
                eventPublisher = applicationEventPublisher,
                postgisFunctionRepository = postgisFunctionRepository,
            ).execute(
                missionToUpdate,
                fromPublicAPI = false,
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
                createdAtUtc = null,
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                facade = "Outre-Mer",
                hasMissionOrder = false,
                isDeleted = false,
                isNoteworthy = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
                missionSource = MissionSourceEnum.MONITORENV,
                missionTypes = listOf(MissionTypeEnum.LAND),
                missionTags = listOf(),
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                updatedAtUtc = null,
            )

        val returnedSavedMission =
            MissionEntity(
                id = 100,
                createdAtUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                facade = "La Face Ade",
                hasMissionOrder = false,
                isDeleted = false,
                isNoteworthy = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
                missionSource = MissionSourceEnum.MONITORENV,
                missionTypes = listOf(MissionTypeEnum.LAND),
                missionTags = listOf(),
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                updatedAtUtc = ZonedDateTime.now(),
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
            ).execute(
                missionToUpdate,
                fromPublicAPI = false,
            )

        // Then
        assertThat(createdMission.createdAtUtc).isEqualTo(ZonedDateTime.parse("2022-01-23T20:29:03Z"))
    }

    @Test
    fun `execute should throw BackendUsageException when save failed`() {
        // Given
        val missionToUpdate = aMissionEntity()

        given(facadeAreasRepository.findFacadeFromGeometry(anyOrNull())).willReturn("La Face Ade")
        given(missionRepository.findById(100))
            .willReturn(missionToUpdate.copy(createdAtUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z")))
        given(missionRepository.save(anyOrNull())).willThrow(RuntimeException("Save failed"))

        // When
        assertThatThrownBy {
            CreateOrUpdateMission(
                missionRepository = missionRepository,
                facadeRepository = facadeAreasRepository,
                eventPublisher = applicationEventPublisher,
                postgisFunctionRepository = postgisFunctionRepository,
            ).execute(
                missionToUpdate,
                fromPublicAPI = false,
            )
        }.isInstanceOf(BackendUsageException::class.java)
            .hasMessage("Unable to save mission with `id` = ${missionToUpdate.id}.")
    }
}
