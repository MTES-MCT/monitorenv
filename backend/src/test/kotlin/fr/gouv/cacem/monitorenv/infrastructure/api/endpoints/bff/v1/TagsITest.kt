package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.use_cases.tags.GetTags
import fr.gouv.cacem.monitorenv.domain.use_cases.tags.GetTagsByRegulatoryAreas
import fr.gouv.cacem.monitorenv.domain.use_cases.tags.fixtures.TagFixture.Companion.aTag
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
@WebMvcTest(value = [(Tags::class)])
class TagsITest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @MockitoBean
    private lateinit var getTags: GetTags

    @MockitoBean
    private lateinit var getTagsByRegulatoryAreas: GetTagsByRegulatoryAreas

    @Test
    fun `Should get all tags`() {
        // Given
        val tags =
            listOf(
                aTag(
                    id = 1,
                    name = "tag1",
                    startedAt = ZonedDateTime.parse("2025-01-01T12:00:00Z"),
                    endedAt = ZonedDateTime.parse("2025-12-31T12:00:00Z"),
                    subTags =
                        listOf(
                            aTag(
                                id = 2,
                                name = "subTag1",
                                startedAt = ZonedDateTime.parse("2024-01-01T12:00:00Z"),
                                endedAt = ZonedDateTime.parse("2026-12-31T12:00:00Z"),
                            ),
                        ),
                ),
            )
        given(getTags.execute()).willReturn(tags)
        // When
        mockMvc
            .perform(get("/bff/v1/tags"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id", equalTo(1)))
            .andExpect(jsonPath("$[0].name", equalTo("tag1")))
            .andExpect(jsonPath("$[0].startedAt", equalTo("2025-01-01T12:00:00Z")))
            .andExpect(jsonPath("$[0].endedAt", equalTo("2025-12-31T12:00:00Z")))
            .andExpect(jsonPath("$[0].subTags[0].id", equalTo(2)))
            .andExpect(jsonPath("$[0].subTags[0].name", equalTo("subTag1")))
            .andExpect(jsonPath("$[0].subTags[0].startedAt", equalTo("2024-01-01T12:00:00Z")))
            .andExpect(jsonPath("$[0].subTags[0].endedAt", equalTo("2026-12-31T12:00:00Z")))
    }

    @Test
    fun `Should get all tags by regulatory area ids`() {
        // Given
        val ids = listOf(1, 2)
        val tags =
            listOf(
                aTag(
                    id = 1,
                    name = "tag1",
                    startedAt = ZonedDateTime.parse("2025-01-01T12:00:00Z"),
                    endedAt = ZonedDateTime.parse("2025-12-31T12:00:00Z"),
                    subTags =
                        listOf(
                            aTag(
                                id = 2,
                                name = "subTag1",
                                startedAt = ZonedDateTime.parse("2024-01-01T12:00:00Z"),
                                endedAt = ZonedDateTime.parse("2026-12-31T12:00:00Z"),
                            ),
                        ),
                ),
            )
        given(getTagsByRegulatoryAreas.execute(ids)).willReturn(tags)
        // When
        mockMvc
            .perform(
                post("/bff/v1/tags/regulatoryAreas")
                    .content(objectMapper.writeValueAsString(ids))
                    .contentType(MediaType.APPLICATION_JSON),
            )
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id", equalTo(1)))
            .andExpect(jsonPath("$[0].name", equalTo("tag1")))
            .andExpect(jsonPath("$[0].startedAt", equalTo("2025-01-01T12:00:00Z")))
            .andExpect(jsonPath("$[0].endedAt", equalTo("2025-12-31T12:00:00Z")))
            .andExpect(jsonPath("$[0].subTags[0].id", equalTo(2)))
            .andExpect(jsonPath("$[0].subTags[0].name", equalTo("subTag1")))
            .andExpect(jsonPath("$[0].subTags[0].startedAt", equalTo("2024-01-01T12:00:00Z")))
            .andExpect(jsonPath("$[0].subTags[0].endedAt", equalTo("2026-12-31T12:00:00Z")))
    }
}
