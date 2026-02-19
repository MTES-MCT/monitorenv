package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.actions

import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.eq
import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.PatchableEnvActionEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.PatchEnvAction
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture.Companion.anEnvAction
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.util.Optional
import java.util.UUID

@Import(SentryConfig::class, MapperConfiguration::class)
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(value = [EnvAction::class])
class EnvActionITest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private val patchEnvAction: PatchEnvAction = mock()

    private val jsonMapper = MapperConfiguration().jsonMapper()

    @Test
    fun `patch() should call the usecase to patch the data then return the updated resources`() {
        // Given
        val id = UUID.randomUUID()
        val yesterday = ZonedDateTime.now(ZoneOffset.UTC).minusDays(1)
        val today = ZonedDateTime.now(ZoneOffset.UTC)
        val tomorrow = ZonedDateTime.now(ZoneOffset.UTC).plusDays(1)
        val observationsByUnit = "observationsByUnits"
        val partialEnvActionAsJson =
            """
            { "actionEndDateTimeUtc": "$tomorrow",
              "actionStartDateTimeUtc": "$today",
              "observationsByUnit": "$observationsByUnit"}
            """.trimIndent()
        val patchedEnvAction = anEnvAction(jsonMapper, id, yesterday, today, observationsByUnit)
        val patchableEnvActionEntity =
            PatchableEnvActionEntity(
                actionStartDateTimeUtc = Optional.of(today),
                actionEndDateTimeUtc = Optional.of(tomorrow),
                Optional.of(observationsByUnit),
            )

        given(patchEnvAction.execute(id, patchableEnvActionEntity)).willReturn(patchedEnvAction)

        // When
        mockMvc
            .perform(
                patch("/api/v1/actions/$id")
                    .content(partialEnvActionAsJson)
                    .contentType(MediaType.APPLICATION_JSON),
            )
            // Then
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(
                jsonPath(
                    "$.actionEndDateTimeUtc",
                    equalTo(patchedEnvAction.actionEndDateTimeUtc?.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)),
                ),
            ).andExpect(
                jsonPath(
                    "$.actionStartDateTimeUtc",
                    equalTo(patchedEnvAction.actionStartDateTimeUtc?.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)),
                ),
            ).andExpect(
                jsonPath(
                    "$.observationsByUnit",
                    equalTo(patchedEnvAction.observationsByUnit),
                ),
            )
    }

    // TODO: Uncomment when MapperConfiguration DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES is set
//    @Test
//    fun `patch() should return 400 when the input contains an unknown property`() {
//        // Given
//        val id = UUID.randomUUID()
//        val partialEnvActionAsJson = """
//            { "unknownProperty": null }
//        """.trimIndent()
//
//        // When
//        mockMvc.perform(
//            patch("/api/v1/actions/$id")
//                .content(partialEnvActionAsJson)
//                .contentType(MediaType.APPLICATION_JSON),
//        )
//            // Then
//            .andExpect(MockMvcResultMatchers.status().isBadRequest())
//    }

    @Test
    fun `patch() should return 400 when the input contains an incorrect type`() {
        // Given
        val id = UUID.randomUUID()
        val partialEnvActionAsJson =
            """
            { "actionStartDateTimeUtc": "incorrect type" }
            """.trimIndent()

        // When
        mockMvc
            .perform(
                patch("/api/v1/actions/$id")
                    .content(partialEnvActionAsJson)
                    .contentType(MediaType.APPLICATION_JSON),
            )
            // Then
            .andExpect(MockMvcResultMatchers.status().isBadRequest())
    }

    @Test
    fun `patch() should return 404 when the use case throw BackendUsageException because the target entity doesnt exist`() {
        // Given
        val unknownId = UUID.randomUUID()
        val partialEnvActionAsJson =
            """
            {}
            """.trimIndent()

        val message = "envAction $unknownId not found"
        given(
            patchEnvAction.execute(
                eq(unknownId),
                any(),
            ),
        ).willThrow(BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_FOUND, message))

        // When
        mockMvc
            .perform(
                patch("/api/v1/actions/$unknownId")
                    .content(partialEnvActionAsJson)
                    .contentType(MediaType.APPLICATION_JSON),
            )
            // Then
            .andExpect(MockMvcResultMatchers.status().isNotFound())
    }
}
