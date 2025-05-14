package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.use_cases.themes.GetThemes
import fr.gouv.cacem.monitorenv.domain.use_cases.themes.GetThemesByRegulatoryAreas
import fr.gouv.cacem.monitorenv.domain.use_cases.themes.fixtures.ThemeFixture.Companion.aTheme
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v1.Themes
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.ZonedDateTime

@Import(SentryConfig::class, MapperConfiguration::class)
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(value = [(Themes::class)])
class ThemesITest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @MockitoBean
    private lateinit var getThemes: GetThemes

    @MockitoBean
    private lateinit var getThemesByRegulatoryAreas: GetThemesByRegulatoryAreas

    @Test
    fun `Should get all themes`() {
        // Given
        val themes =
            listOf(
                aTheme(
                    id = 1,
                    name = "theme1",
                    startedAt = ZonedDateTime.parse("2025-01-01T12:00:00Z"),
                    endedAt = ZonedDateTime.parse("2025-12-31T12:00:00Z"),
                    subThemes =
                        listOf(
                            aTheme(
                                id = 2,
                                name = "subTheme1",
                                startedAt = ZonedDateTime.parse("2024-01-01T12:00:00Z"),
                                endedAt = ZonedDateTime.parse("2026-12-31T12:00:00Z"),
                            ),
                        ),
                ),
            )
        given(getThemes.execute()).willReturn(themes)
        // When
        mockMvc
            .perform(get("/api/v1/themes"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id", equalTo(1)))
            .andExpect(jsonPath("$[0].name", equalTo("theme1")))
            .andExpect(jsonPath("$[0].startedAt", equalTo("2025-01-01T12:00:00Z")))
            .andExpect(jsonPath("$[0].endedAt", equalTo("2025-12-31T12:00:00Z")))
            .andExpect(jsonPath("$[0].subThemes[0].id", equalTo(2)))
            .andExpect(jsonPath("$[0].subThemes[0].name", equalTo("subTheme1")))
            .andExpect(jsonPath("$[0].subThemes[0].startedAt", equalTo("2024-01-01T12:00:00Z")))
            .andExpect(jsonPath("$[0].subThemes[0].endedAt", equalTo("2026-12-31T12:00:00Z")))
    }

    @Test
    fun `Should get all tags by regulatory area ids`() {
        // Given
        val ids = listOf(1, 2)
        val themes =
            listOf(
                aTheme(
                    id = 1,
                    name = "theme1",
                    startedAt = ZonedDateTime.parse("2025-01-01T12:00:00Z"),
                    endedAt = ZonedDateTime.parse("2025-12-31T12:00:00Z"),
                    subThemes =
                        listOf(
                            aTheme(
                                id = 2,
                                name = "subTheme1",
                                startedAt = ZonedDateTime.parse("2024-01-01T12:00:00Z"),
                                endedAt = ZonedDateTime.parse("2026-12-31T12:00:00Z"),
                            ),
                        ),
                ),
            )
        given(getThemesByRegulatoryAreas.execute(ids)).willReturn(themes)
        // When
        mockMvc
            .perform(
                post("/api/v1/themes/regulatoryAreas")
                    .content(objectMapper.writeValueAsString(ids))
                    .contentType(MediaType.APPLICATION_JSON),
            )
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id", equalTo(1)))
            .andExpect(jsonPath("$[0].name", equalTo("theme1")))
            .andExpect(jsonPath("$[0].startedAt", equalTo("2025-01-01T12:00:00Z")))
            .andExpect(jsonPath("$[0].endedAt", equalTo("2025-12-31T12:00:00Z")))
            .andExpect(jsonPath("$[0].subThemes[0].id", equalTo(2)))
            .andExpect(jsonPath("$[0].subThemes[0].name", equalTo("subTheme1")))
            .andExpect(jsonPath("$[0].subThemes[0].startedAt", equalTo("2024-01-01T12:00:00Z")))
            .andExpect(jsonPath("$[0].subThemes[0].endedAt", equalTo("2026-12-31T12:00:00Z")))
    }
}
