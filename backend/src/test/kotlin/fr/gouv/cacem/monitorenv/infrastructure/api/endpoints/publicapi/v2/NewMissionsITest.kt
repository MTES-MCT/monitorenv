package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v2

import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.eq
import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.WebSecurityConfig
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.PatchableMissionEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.DeleteMission
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.PatchMission
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture.Companion.aMissionEntity
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.util.Optional
import kotlin.random.Random

@Import(WebSecurityConfig::class, MapperConfiguration::class)
@WebMvcTest(value = [NewMissions::class])
class NewMissionsITest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var patchMission: PatchMission

    @MockBean
    private lateinit var deleteMission: DeleteMission

    @Test
    fun `Should delete mission with api v2`() {
        mockMvc.perform(delete("/api/v2/missions/20?source=MONITORFISH")).andExpect(status().isOk)
        Mockito.verify(deleteMission).execute(20, MissionSourceEnum.MONITORFISH)
    }

    @Test
    fun `patch() should call the usecase to patch the data then return the updated resources`() {
        // Given
        val id = Random.nextInt()
        val observationsByUnit = "observationsByUnits"
        val partialMissionAsJson = """
            { "observationsByUnit": "$observationsByUnit"}
        """.trimIndent()
        val patchedMission = aMissionEntity(observationsByUnit = "patchedObservations")
        val patchableMissionEntity = PatchableMissionEntity(
            Optional.of(observationsByUnit),
        )

        given(patchMission.execute(id, patchableMissionEntity)).willReturn(MissionDTO(patchedMission))

        // When
        mockMvc.perform(
            patch("/api/v2/missions/$id")
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

    // TODO: Uncomment when MapperConfiguration DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES is set
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
        val partialMissionAsJson = """
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
        val partialMissionAsJson = """
            {}
        """.trimIndent()

        val message = "envAction $unknownId not found"
        given(
            patchMission.execute(
                eq(unknownId),
                any(),
            ),
        ).willThrow(BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_FOUND, message))

        // When
        mockMvc.perform(
            patch("/api/v2/missions/$unknownId")
                .content(partialMissionAsJson)
                .contentType(MediaType.APPLICATION_JSON),
        )
            // Then
            .andExpect(status().isBadRequest())
    }
}
