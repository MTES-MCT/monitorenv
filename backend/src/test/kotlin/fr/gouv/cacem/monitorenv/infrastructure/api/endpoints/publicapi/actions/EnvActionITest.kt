package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.actions

import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.eq
import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.WebSecurityConfig
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.PatchEnvAction
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture.Companion.anEnvAction
import fr.gouv.cacem.monitorenv.infrastructure.exceptions.BackendRequestErrorCode
import fr.gouv.cacem.monitorenv.infrastructure.exceptions.BackendRequestException
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.util.UUID

@Import(WebSecurityConfig::class, MapperConfiguration::class)
@WebMvcTest(value = [EnvAction::class])
class EnvActionITest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var patchEnvAction: PatchEnvAction

    private val objectMapper = MapperConfiguration().objectMapper()

    @Test
    fun `patch() should call the usecase to patch the data then return the updated resources`() {
        // Given
        val id = UUID.randomUUID()
        val yesterday = ZonedDateTime.now(ZoneOffset.UTC).minusDays(1)
        val today = ZonedDateTime.now(ZoneOffset.UTC)
        val tomorrow = ZonedDateTime.now(ZoneOffset.UTC).plusDays(1)
        val partialEnvActionAsJson = """
            { "actionEndDateTimeUtc": "$tomorrow",
              "actionStartDateTimeUtc": "$today" }
        """.trimIndent()
        val patchedEnvAction = anEnvAction(objectMapper, id, yesterday, today)

        given(patchEnvAction.execute(eq(id), any())).willReturn(patchedEnvAction)

        // When
        mockMvc.perform(
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
            )
            .andExpect(
                jsonPath(
                    "$.actionStartDateTimeUtc",
                    equalTo(patchedEnvAction.actionStartDateTimeUtc?.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)),
                ),
            )
    }

    @Test
    fun `patch() should return 422 when the use case throw BackendRequestException`() {
        // Given
        val id = UUID.randomUUID()
        val partialEnvActionAsJson = """
            { "unknownProperty": null }
        """.trimIndent()

        given(
            patchEnvAction.execute(
                eq(id),
                any(),
            ),
        ).willThrow(BackendRequestException(BackendRequestErrorCode.BODY_ID_MISMATCH_REQUEST_PATH_ID))

        // When
        mockMvc.perform(
            patch("/api/v1/actions/$id")
                .content(partialEnvActionAsJson)
                .contentType(MediaType.APPLICATION_JSON),
        )
            // Then
            .andExpect(MockMvcResultMatchers.status().isUnprocessableEntity())
    }

    @Test
    fun `patch() should return 400 when the use case throw BackendUsageException`() {
        // Given
        val unknownId = UUID.randomUUID()
        val partialEnvActionAsJson = """
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
        mockMvc.perform(
            patch("/api/v1/actions/$unknownId")
                .content(partialEnvActionAsJson)
                .contentType(MediaType.APPLICATION_JSON),
        )
            // Then
            .andExpect(MockMvcResultMatchers.status().isBadRequest())
    }
}
