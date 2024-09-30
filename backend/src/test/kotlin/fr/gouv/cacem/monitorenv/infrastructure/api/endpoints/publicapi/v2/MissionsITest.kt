package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v2

import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.eq
import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.PatchableMissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.rapportnav.RapportNavMissionActionEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture.Companion.aMonitorFishAction
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.DeleteMission
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.GetMissionAndSourceAction
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.PatchMission
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture.Companion.aMissionEntity
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.ZonedDateTime
import java.util.Optional
import kotlin.random.Random

@Import(SentryConfig::class, MapperConfiguration::class)
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(value = [Missions::class])
class MissionsITest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var patchMission: PatchMission

    @MockBean
    private lateinit var deleteMission: DeleteMission

    @MockBean
    private lateinit var getMissionAndSourceAction: GetMissionAndSourceAction

    @Test
    fun `Should delete mission with api v2`() {
        mockMvc.perform(delete("/api/v2/missions/20?source=MONITORFISH")).andExpect(status().isOk)
        Mockito.verify(deleteMission).execute(20, MissionSourceEnum.MONITORFISH)
    }

    @Test
    fun `patch() should call the usecase to patch the data then return the updated resources`() {
        // Given
        val id = Random.nextInt()

        // patched fields
        val observationsByUnit = "patchedObservations"
        val startDateTimeUtc: ZonedDateTime = ZonedDateTime.parse("2024-04-11T07:00:00Z")
        val endDateTimeUtc: ZonedDateTime = ZonedDateTime.parse("2024-04-22T07:00:00Z")

        val partialMissionAsJson =
            """
            { "observationsByUnit": "$observationsByUnit", "startDateTimeUtc": "$startDateTimeUtc", "endDateTimeUtc": "$endDateTimeUtc" }
            """.trimIndent()

        val patchedMission =
            aMissionEntity(
                id = id,
                observationsByUnit = observationsByUnit,
                startDateTimeUtc = startDateTimeUtc,
                endDateTimeUtc = endDateTimeUtc,
            )
        val patchableMissionEntity =
            PatchableMissionEntity(
                observationsByUnit = Optional.of(observationsByUnit),
                startDateTimeUtc = startDateTimeUtc,
                endDateTimeUtc = Optional.of(endDateTimeUtc),
            )

        given(patchMission.execute(id, patchableMissionEntity))
            .willReturn(MissionDTO(mission = patchedMission))

        // When
        mockMvc.perform(
            patch("/api/v2/missions/$id")
                .characterEncoding("utf-8")
                .content(partialMissionAsJson)
                .contentType(MediaType.APPLICATION_JSON),
        )
            // Then
            .andExpect(status().isOk)
            .andExpect(
                jsonPath(
                    "$.observationsByUnit",
                    equalTo(patchedMission.observationsByUnit),
                ),
            )
    }

    // TODO: Uncomment when MapperConfiguration DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES is
    // set
    //    @Test
    //    fun `patch() should return 400 when the input contains an unknown property`() {
    //        // Given
    //        val id = Random.nextInt()
    //        val partialMissionAsJson = """
    //            { "unknownProperty": null }
    //        """.trimIndent()
    //
    //        // When
    //        mockMvc.perform(
    //            patch("/api/v2/missions/$id")
    //                .content(partialEnvActionAsJson)
    //                .contentType(MediaType.APPLICATION_JSON),
    //        )
    //            // Then
    //            .andExpect(MockMvcResultMatchers.status().isBadRequest())
    //    }

    @Test
    fun `patch() should return 400 when the input contains an incorrect type`() {
        // Given
        val id = Random.nextInt()
        val partialMissionAsJson =
            """
            { "observationsByUnit": undefined }
            """.trimIndent()

        // When
        mockMvc.perform(
            patch("/api/v2/missions/$id")
                .content(partialMissionAsJson)
                .contentType(MediaType.APPLICATION_JSON),
        )
            // Then
            .andExpect(status().isBadRequest())
    }

    @Test
    fun `patch() should return 400 when the use case throw BackendUsageException`() {
        // Given
        val unknownId = Random.nextInt()
        val partialMissionAsJson =
            """
            {}
            """.trimIndent()

        val message = "envAction $unknownId not found"
        given(
            patchMission.execute(
                eq(unknownId),
                any(),
            ),
        )
            .willThrow(BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_FOUND, message))

        // When
        mockMvc.perform(
            patch("/api/v2/missions/$unknownId")
                .content(partialMissionAsJson)
                .contentType(MediaType.APPLICATION_JSON),
        )
            // Then
            .andExpect(status().isBadRequest())
    }

    @Test
    fun `get should return ok with the expected mission and rapportNav actions when source is RAPPORT_NAV`() {
        // Given
        val id = Random.nextInt()
        val source = MissionSourceEnum.RAPPORT_NAV

        val mission = aMissionEntity()
        given(getMissionAndSourceAction.execute(id, source))
            .willReturn(
                MissionDTO(
                    mission,
                    hasRapportNavActions = RapportNavMissionActionEntity(1, true),
                ),
            )

        // When
        mockMvc.perform(
            get("/api/v2/missions/$id")
                .param("source", source.name)
                .contentType(MediaType.APPLICATION_JSON),
        )
            // Then
            .andExpect(jsonPath("$.id").value(mission.id))
            .andExpect(jsonPath("$.hasRapportNavActions").isNotEmpty())
            .andExpect(jsonPath("$.fishActions").isEmpty())
            .andExpect(status().isOk())
    }

    @Test
    fun `get should return ok with the expected mission and fish actions when source is MONITOR_FISH`() {
        // Given
        val id = Random.nextInt()
        val source = MissionSourceEnum.MONITORFISH

        val mission = aMissionEntity()
        given(getMissionAndSourceAction.execute(id, source))
            .willReturn(
                MissionDTO(
                    mission,
                    fishActions = listOf(aMonitorFishAction(id)),
                ),
            )

        // When
        mockMvc.perform(
            get("/api/v2/missions/$id")
                .param("source", source.name)
                .contentType(MediaType.APPLICATION_JSON),
        )
            // Then
            .andExpect(jsonPath("$.id").value(mission.id))
            .andExpect(jsonPath("$.hasRapportNavActions").isEmpty())
            .andExpect(jsonPath("$.fishActions").isNotEmpty())
            .andExpect(status().isOk())
    }

    @Test
    fun `get should return ok with the expected mission without source informations when source is not set`() {
        // Given
        val id = Random.nextInt()

        val mission = aMissionEntity()
        given(getMissionAndSourceAction.execute(id, null))
            .willReturn(
                MissionDTO(
                    mission,
                ),
            )
        // When
        mockMvc.perform(
            get("/api/v2/missions/$id").contentType(MediaType.APPLICATION_JSON),
        )
            // Then
            .andExpect(jsonPath("$.id").value(mission.id))
            .andExpect(jsonPath("$.hasRapportNavActions").isEmpty())
            .andExpect(jsonPath("$.fishActions").isEmpty())
            .andExpect(status().isOk())
    }
}
