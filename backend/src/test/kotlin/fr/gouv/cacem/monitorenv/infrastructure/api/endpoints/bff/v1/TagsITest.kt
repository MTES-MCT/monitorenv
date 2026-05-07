package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.use_cases.tags.GetTags
import fr.gouv.cacem.monitorenv.domain.use_cases.tags.GetTagsByRegulatoryAreas
import fr.gouv.cacem.monitorenv.domain.use_cases.tags.SaveTag
import fr.gouv.cacem.monitorenv.domain.use_cases.tags.fixtures.TagFixture.Companion.aTag
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.tags.CreaterOrUpdateTagInput
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import tools.jackson.databind.json.JsonMapper
import java.time.ZonedDateTime

@Import(SentryConfig::class, MapperConfiguration::class)
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(value = [(Tags::class)])
class TagsITest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var jsonMapper: JsonMapper

    @MockitoBean
    private lateinit var getTags: GetTags

    @MockitoBean
    private lateinit var getTagsByRegulatoryAreas: GetTagsByRegulatoryAreas

    @MockitoBean
    private lateinit var saveTag: SaveTag

    @Test
    fun `Should get all tags`() {
        val startedAt = ZonedDateTime.now()
        val endedAt = ZonedDateTime.now()
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
        given(getTags.execute(startedAt, endedAt)).willReturn(tags)
        // When
        mockMvc
            .perform(get("/bff/v1/tags").param("startedAt", startedAt.toString()).param("endedAt", endedAt.toString()))
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
                    .content(jsonMapper.writeValueAsString(ids))
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

    @Test
    fun `Should save tag and return entity`() {
        // Given
        val id = 1
        val tagName = "tag1"
        val startedAt = ZonedDateTime.parse("2025-01-01T12:00:00Z")
        val endedAt = ZonedDateTime.parse("2025-12-31T12:00:00Z")
        val tagInput =
            CreaterOrUpdateTagInput(
                id = id,
                name = tagName,
                startedAt = startedAt,
                endedAt = endedAt,
                parentId = null,
            )

        val tag =
            aTag(
                id = id,
                name = tagName,
                startedAt = startedAt,
                endedAt = endedAt,
            )
        given(saveTag.execute(tag, null)).willReturn(tag)
        // When
        mockMvc
            .perform(
                put("/bff/v1/tags")
                    .content(jsonMapper.writeValueAsString(tagInput))
                    .contentType(MediaType.APPLICATION_JSON),
            )
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id", equalTo(id)))
            .andExpect(jsonPath("$.name", equalTo(tagName)))
            .andExpect(jsonPath("$.startedAt", equalTo("2025-01-01T12:00:00Z")))
            .andExpect(jsonPath("$.endedAt", equalTo("2025-12-31T12:00:00Z")))
    }
}
