package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.actions

import fr.gouv.cacem.monitorenv.config.WebSecurityConfig
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.PatchEnvAction
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.mockito.Mock
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter

@Import(WebSecurityConfig::class)
@WebMvcTest(value = [(EnvAction::class)])
class EnvActionITest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Mock
    private lateinit var patchEnvAction: PatchEnvAction

    @Test
    fun `UpdateAction() should call the usecase and return the updated resources`() {
        // Given
        val id = 1
        val yesterday = ZonedDateTime.now().minusDays(1).format(DateTimeFormatter.ISO_INSTANT)
        val tomorrow = ZonedDateTime.now().plusDays(1).format(DateTimeFormatter.ISO_INSTANT)
        val partialAction = """
            { startUtc: $yesterday,
            endUtc: $tomorrow }
        """.trimIndent()
//        given(patchEnvAction.execute(id)).willReturn()

        // When
        mockMvc.perform(
            patch("/api/v1/actions/$id")
                .content(partialAction)
                .contentType(MediaType.APPLICATION_JSON),
        )
            // Then
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(jsonPath("$.startUtc", equalTo(yesterday)))
            .andExpect(jsonPath("$.endUtc", equalTo(tomorrow)))
    }
}
