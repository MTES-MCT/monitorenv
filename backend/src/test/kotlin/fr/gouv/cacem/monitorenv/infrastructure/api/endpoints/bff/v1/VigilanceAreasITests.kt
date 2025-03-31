package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.any
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.EndingConditionEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.FrequencyEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.ImageEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VisibilityEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.tags.fixtures.TagFixture.Companion.aSubTag
import fr.gouv.cacem.monitorenv.domain.use_cases.tags.fixtures.TagFixture.Companion.aTag
import fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.CreateOrUpdateVigilanceArea
import fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.DeleteVigilanceArea
import fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.GetTrigrams
import fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.GetVigilanceAreaById
import fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.GetVigilanceAreas
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.tags.SubTagInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.tags.TagInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.vigilanceArea.ImageDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.vigilanceArea.VigilanceAreaDataInput
import org.hamcrest.Matchers.equalTo
import org.hamcrest.Matchers.nullValue
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.ZonedDateTime

@Import(SentryConfig::class, MapperConfiguration::class)
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(value = [(VigilanceAreas::class)])
class VigilanceAreasITests {
    val createdAt = "2025-12-31T23:59:59Z"

    val updatedAt = "2026-12-31T23:59:59Z"

    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private lateinit var getAllVigilanceAreas: GetVigilanceAreas

    @MockitoBean
    private lateinit var getVigilanceAreaById: GetVigilanceAreaById

    @MockitoBean
    private lateinit var createOrUpdateVigilanceArea: CreateOrUpdateVigilanceArea

    @MockitoBean
    private lateinit var deleteVigilanceArea: DeleteVigilanceArea

    @MockitoBean
    private lateinit var getTrigrams: GetTrigrams

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    private val polygon =
        WKTReader()
            .read(
                "MULTIPOLYGON (((-4.54877817 48.30555988, -4.54997332 48.30597601, -4.54998501 48.30718823, -4.5487929 48.30677461, -4.54877817 48.30555988)))",
            ) as
            MultiPolygon

    private val vigilanceArea1 =
        VigilanceAreaEntity(
            id = 1,
            name = "Vigilance Area 1",
            isArchived = false,
            isDeleted = false,
            isDraft = false,
            comments = "Commentaires sur la zone de vigilance",
            createdBy = "ABC",
            endingCondition = EndingConditionEnum.OCCURENCES_NUMBER,
            endingOccurrenceDate = null,
            endingOccurrencesNumber = 2,
            frequency = FrequencyEnum.ALL_WEEKS,
            endDatePeriod = ZonedDateTime.parse("2024-08-08T23:59:59Z"),
            geom = polygon,
            images =
                listOf(
                    ImageEntity(
                        name = "image1.jpg",
                        content = byteArrayOf(1, 2, 3),
                        mimeType = "image/jpeg",
                        size = 1024,
                    ),
                    ImageEntity(
                        name = "image2.png",
                        content = byteArrayOf(4, 5, 6),
                        mimeType = "image/png",
                        size = 2048,
                    ),
                ),
            links = null,
            seaFront = "MED",
            source = "Source de la zone de vigilance",
            startDatePeriod = ZonedDateTime.parse("2024-08-18T00:00:00Z"),
            themes = null,
            visibility = VisibilityEnum.PRIVATE,
            createdAt = ZonedDateTime.parse(createdAt),
            updatedAt = ZonedDateTime.parse(updatedAt),
            isAtAllTimes = false,
            tags =
                listOf(
                    aTag(
                        id = 1,
                        name = "tag1",
                        startedAt = ZonedDateTime.parse("2024-01-01T00:00:00Z"),
                        endedAt = null,
                        subTags =
                            listOf(
                                aSubTag(
                                    id = 1,
                                    name = "subTag1",
                                    startedAt = ZonedDateTime.parse("2024-01-01T00:00:00Z"),
                                    endedAt = null,
                                ),
                            ),
                    ),
                ),
        )

    @Test
    fun `Should get all vigilance areas`() {
        // Given
        val vigilanceArea2 =
            VigilanceAreaEntity(
                id = 2,
                name = "Vigilance Area 2",
                isArchived = false,
                isDeleted = false,
                isDraft = true,
                comments = null,
                createdBy = "DEF",
                endingCondition = EndingConditionEnum.NEVER,
                endingOccurrenceDate = null,
                endingOccurrencesNumber = null,
                frequency = FrequencyEnum.ALL_WEEKS,
                endDatePeriod = ZonedDateTime.parse("2024-12-31T23:59:59Z"),
                geom = polygon,
                images = listOf(),
                links = null,
                seaFront = "MED",
                source = "Un particulier",
                startDatePeriod = ZonedDateTime.parse("2024-12-01T00:00:00Z"),
                themes = null,
                visibility = VisibilityEnum.PUBLIC,
                createdAt = ZonedDateTime.parse(createdAt),
                updatedAt = ZonedDateTime.parse(updatedAt),
                isAtAllTimes = true,
                tags = listOf(),
            )
        given(getAllVigilanceAreas.execute()).willReturn(listOf(vigilanceArea1, vigilanceArea2))
        // When
        mockMvc
            .perform(get("/bff/v1/vigilance_areas"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id", equalTo(1)))
            .andExpect(jsonPath("$[0].name", equalTo("Vigilance Area 1")))
            .andExpect(jsonPath("$[0].isDraft", equalTo(false)))
            .andExpect(
                jsonPath("$[0].comments", equalTo("Commentaires sur la zone de vigilance")),
            ).andExpect(jsonPath("$[0].createdBy", equalTo("ABC")))
            .andExpect(jsonPath("$[0].endingCondition", equalTo("OCCURENCES_NUMBER")))
            .andExpect(jsonPath("$[0].endingOccurrenceDate").doesNotExist())
            .andExpect(jsonPath("$[0].endingOccurrencesNumber", equalTo(2)))
            .andExpect(jsonPath("$[0].frequency", equalTo("ALL_WEEKS")))
            .andExpect(jsonPath("$[0].endDatePeriod", equalTo("2024-08-08T23:59:59Z")))
            .andExpect(jsonPath("$[0].geom.type", equalTo("MultiPolygon")))
            .andExpect(
                jsonPath("$[0].links").doesNotExist(),
            ).andExpect(jsonPath("$[0].source", equalTo("Source de la zone de vigilance")))
            .andExpect(jsonPath("$[0].startDatePeriod", equalTo("2024-08-18T00:00:00Z")))
            .andExpect(jsonPath("$[0].themes").doesNotExist())
            .andExpect(jsonPath("$[0].visibility", equalTo("PRIVATE")))
            .andExpect(jsonPath("$[1].isAtAllTimes", equalTo(true)))
            .andExpect(jsonPath("$[1].id", equalTo(2)))
            .andExpect(jsonPath("$[1].name", equalTo("Vigilance Area 2")))
            .andExpect(jsonPath("$[1].isDraft", equalTo(true)))
            .andExpect(jsonPath("$[1].comments").doesNotExist())
            .andExpect(jsonPath("$[1].createdBy", equalTo("DEF")))
            .andExpect(jsonPath("$[1].endingCondition", equalTo("NEVER")))
            .andExpect(jsonPath("$[1].endingOccurrenceDate").doesNotExist())
            .andExpect(jsonPath("$[1].endingOccurrencesNumber").doesNotExist())
            .andExpect(jsonPath("$[1].frequency", equalTo("ALL_WEEKS")))
            .andExpect(jsonPath("$[1].endDatePeriod", equalTo("2024-12-31T23:59:59Z")))
            .andExpect(jsonPath("$[1].geom.type", equalTo("MultiPolygon")))
            .andExpect(
                jsonPath("$[0].links").doesNotExist(),
            ).andExpect(jsonPath("$[1].source", equalTo("Un particulier")))
            .andExpect(jsonPath("$[1].startDatePeriod", equalTo("2024-12-01T00:00:00Z")))
            .andExpect(jsonPath("$[1].themes").doesNotExist())
            .andExpect(jsonPath("$[1].visibility", equalTo("PUBLIC")))
            .andExpect(jsonPath("$[1].isAtAllTimes", equalTo(true)))
    }

    @Test
    fun `Should get specific vigilance area`() {
        // Given
        given(getVigilanceAreaById.execute(1)).willReturn(vigilanceArea1)
        // When
        mockMvc
            .perform(get("/bff/v1/vigilance_areas/1"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id", equalTo(1)))
            .andExpect(jsonPath("$.name", equalTo("Vigilance Area 1")))
            .andExpect(jsonPath("$.isDraft", equalTo(false)))
            .andExpect(jsonPath("$.comments", equalTo("Commentaires sur la zone de vigilance")))
            .andExpect(jsonPath("$.createdBy", equalTo("ABC")))
            .andExpect(jsonPath("$.endingCondition", equalTo("OCCURENCES_NUMBER")))
            .andExpect(jsonPath("$.endingOccurrenceDate").doesNotExist())
            .andExpect(jsonPath("$.endingOccurrencesNumber", equalTo(2)))
            .andExpect(jsonPath("$.frequency", equalTo("ALL_WEEKS")))
            .andExpect(jsonPath("$.endDatePeriod", equalTo("2024-08-08T23:59:59Z")))
            .andExpect(jsonPath("$.geom.type", equalTo("MultiPolygon")))
            .andExpect(
                jsonPath("$[0].links").doesNotExist(),
            ).andExpect(jsonPath("$.source", equalTo("Source de la zone de vigilance")))
            .andExpect(jsonPath("$.startDatePeriod", equalTo("2024-08-18T00:00:00Z")))
            .andExpect(jsonPath("$.themes").doesNotExist())
            .andExpect(jsonPath("$.visibility", equalTo("PRIVATE")))
            .andExpect(jsonPath("$.images[0].name", equalTo("image1.jpg")))
            .andExpect(jsonPath("$.images[0].mimeType", equalTo("image/jpeg")))
            .andExpect(jsonPath("$.images[0].size", equalTo(1024)))
            .andExpect(jsonPath("$.images[0].content", equalTo("AQID")))
            .andExpect(jsonPath("$.images[1].name", equalTo("image2.png")))
            .andExpect(jsonPath("$.images[1].mimeType", equalTo("image/png")))
            .andExpect(jsonPath("$.images[1].size", equalTo(2048)))
            .andExpect(jsonPath("$.images[1].content", equalTo("BAUG")))
            .andExpect(jsonPath("$.createdAt", equalTo(createdAt)))
            .andExpect(jsonPath("$.updatedAt", equalTo(updatedAt)))
    }

    @Test
    fun `Should create a new vigilance area`() {
        // Given
        val vigilanceAreaDataInput =
            VigilanceAreaDataInput(
                id = 1,
                name = "Vigilance Area 1",
                isArchived = false,
                isDraft = false,
                comments = "Commentaires sur la zone de vigilance",
                createdBy = "ABC",
                endingCondition = EndingConditionEnum.OCCURENCES_NUMBER,
                endingOccurrenceDate = null,
                endingOccurrencesNumber = 2,
                frequency = FrequencyEnum.ALL_WEEKS,
                endDatePeriod = ZonedDateTime.parse("2024-08-08T23:59:59Z"),
                geom = polygon,
                images =
                    listOf(
                        ImageDataInput(
                            name = "image1.jpg",
                            content = "AQID",
                            mimeType = "image/jpeg",
                            size = 1024,
                        ),
                        ImageDataInput(
                            name = "image2.png",
                            content = "BAUG",
                            mimeType = "image/png",
                            size = 2048,
                        ),
                    ),
                links = null,
                seaFront = "MED",
                source = "Source de la zone de vigilance",
                startDatePeriod = ZonedDateTime.parse("2024-08-18T00:00:00Z"),
                themes = null,
                visibility = VisibilityEnum.PRIVATE,
                createdAt = ZonedDateTime.parse(createdAt),
                updatedAt = ZonedDateTime.parse(updatedAt),
                isAtAllTimes = false,
                tags =
                    listOf(
                        TagInput(
                            id = 1,
                            name = "tag1",
                            startedAt = ZonedDateTime.parse("2024-01-01T00:00:00Z"),
                            endedAt = null,
                            subTags =
                                listOf(
                                    SubTagInput(
                                        id = 1,
                                        name = "subTag1",
                                        startedAt = ZonedDateTime.parse("2024-01-01T00:00:00Z"),
                                        endedAt = null,
                                    ),
                                ),
                        ),
                    ),
            )
        given(createOrUpdateVigilanceArea.execute(any())).willReturn(vigilanceArea1)

        // When
        mockMvc
            .perform(
                put("/bff/v1/vigilance_areas")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(vigilanceAreaDataInput)),
            )
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id", equalTo(1)))
            .andExpect(jsonPath("$.name", equalTo("Vigilance Area 1")))
            .andExpect(jsonPath("$.isDraft", equalTo(false)))
            .andExpect(jsonPath("$.comments", equalTo("Commentaires sur la zone de vigilance")))
            .andExpect(jsonPath("$.createdBy", equalTo("ABC")))
            .andExpect(jsonPath("$.endingCondition", equalTo("OCCURENCES_NUMBER")))
            .andExpect(jsonPath("$.endingOccurrenceDate").doesNotExist())
            .andExpect(jsonPath("$.endingOccurrencesNumber", equalTo(2)))
            .andExpect(jsonPath("$.frequency", equalTo("ALL_WEEKS")))
            .andExpect(jsonPath("$.endDatePeriod", equalTo("2024-08-08T23:59:59Z")))
            .andExpect(jsonPath("$.geom.type", equalTo("MultiPolygon")))
            .andExpect(
                jsonPath("$[0].links").doesNotExist(),
            ).andExpect(jsonPath("$.source", equalTo("Source de la zone de vigilance")))
            .andExpect(jsonPath("$.startDatePeriod", equalTo("2024-08-18T00:00:00Z")))
            .andExpect(jsonPath("$.themes").doesNotExist())
            .andExpect(jsonPath("$.visibility", equalTo("PRIVATE")))
            .andExpect(jsonPath("$.images[0].name", equalTo("image1.jpg")))
            .andExpect(jsonPath("$.images[0].mimeType", equalTo("image/jpeg")))
            .andExpect(jsonPath("$.images[0].size", equalTo(1024)))
            .andExpect(jsonPath("$.images[0].content", equalTo("AQID")))
            .andExpect(jsonPath("$.images[1].name", equalTo("image2.png")))
            .andExpect(jsonPath("$.images[1].mimeType", equalTo("image/png")))
            .andExpect(jsonPath("$.images[1].size", equalTo(2048)))
            .andExpect(jsonPath("$.images[1].content", equalTo("BAUG")))
            .andExpect(jsonPath("$.createdAt", equalTo(createdAt)))
            .andExpect(jsonPath("$.updatedAt", equalTo(updatedAt)))
            .andExpect(jsonPath("$.isAtAllTimes", equalTo(false)))
            .andExpect(jsonPath("$.tags[0].id", equalTo(1)))
            .andExpect(jsonPath("$.tags[0].name", equalTo("tag1")))
            .andExpect(jsonPath("$.tags[0].startedAt", equalTo("2024-01-01T00:00:00Z")))
            .andExpect(jsonPath("$.tags[0].endedAt", nullValue()))
            .andExpect(jsonPath("$.tags[0].subTags[0].id", equalTo(1)))
            .andExpect(jsonPath("$.tags[0].subTags[0].name", equalTo("subTag1")))
            .andExpect(jsonPath("$.tags[0].subTags[0].startedAt", equalTo("2024-01-01T00:00:00Z")))
            .andExpect(jsonPath("$.tags[0].subTags[0].endedAt", nullValue()))
    }

    @Test
    fun `Should update a vigilance area`() {
        // Given
        val vigilanceAreaDataInput =
            VigilanceAreaDataInput(
                id = 1,
                name = "Vigilance Area 1",
                isArchived = false,
                isDraft = false,
                comments = "Commentaires sur la zone de vigilance",
                createdBy = "ABC",
                endingCondition = EndingConditionEnum.OCCURENCES_NUMBER,
                endingOccurrenceDate = null,
                endingOccurrencesNumber = 2,
                frequency = FrequencyEnum.ALL_WEEKS,
                endDatePeriod = ZonedDateTime.parse("2024-08-08T23:59:59Z"),
                geom = polygon,
                images = emptyList(),
                links = null,
                seaFront = "MED",
                source = "Source de la zone de vigilance",
                startDatePeriod = ZonedDateTime.parse("2024-08-18T00:00:00Z"),
                themes = null,
                visibility = VisibilityEnum.PRIVATE,
                createdAt = ZonedDateTime.parse(createdAt),
                updatedAt = ZonedDateTime.parse(updatedAt),
                isAtAllTimes = false,
                tags = listOf(),
            )

        val updatedVigilanceArea =
            vigilanceArea1.copy(
                images = emptyList(),
                tags = listOf(),
            )

        given(createOrUpdateVigilanceArea.execute(updatedVigilanceArea)).willReturn(updatedVigilanceArea)
        // When
        mockMvc
            .perform(
                put("/bff/v1/vigilance_areas/1")
                    .contentType("application/json")
                    .content(objectMapper.writeValueAsString(vigilanceAreaDataInput)),
            )
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id", equalTo(1)))
            .andExpect(jsonPath("$.name", equalTo("Vigilance Area 1")))
            .andExpect(jsonPath("$.isDraft", equalTo(false)))
            .andExpect(jsonPath("$.comments", equalTo("Commentaires sur la zone de vigilance")))
            .andExpect(jsonPath("$.createdBy", equalTo("ABC")))
            .andExpect(jsonPath("$.endingCondition", equalTo("OCCURENCES_NUMBER")))
            .andExpect(jsonPath("$.endingOccurrenceDate").doesNotExist())
            .andExpect(jsonPath("$.endingOccurrencesNumber", equalTo(2)))
            .andExpect(jsonPath("$.frequency", equalTo("ALL_WEEKS")))
            .andExpect(jsonPath("$.endDatePeriod", equalTo("2024-08-08T23:59:59Z")))
            .andExpect(jsonPath("$.geom.type", equalTo("MultiPolygon")))
            .andExpect(
                jsonPath("$[0].links").doesNotExist(),
            ).andExpect(jsonPath("$.source", equalTo("Source de la zone de vigilance")))
            .andExpect(jsonPath("$.startDatePeriod", equalTo("2024-08-18T00:00:00Z")))
            .andExpect(jsonPath("$.themes").doesNotExist())
            .andExpect(jsonPath("$.visibility", equalTo("PRIVATE")))
            .andExpect(jsonPath("$.createdAt", equalTo(createdAt)))
            .andExpect(jsonPath("$.updatedAt", equalTo(updatedAt)))
            .andExpect(jsonPath("$.isAtAllTimes", equalTo(false)))
            .andExpect(jsonPath("$.images").isEmpty())
            .andExpect(jsonPath("$.tags").isEmpty())
    }

    @Test
    fun `Should delete vigilance area`() {
        // Given
        val vigilanceAreaId = 20
        // When
        mockMvc
            .perform(delete("/bff/v1/vigilance_areas/$vigilanceAreaId"))
            // Then
            .andExpect(status().isNoContent())
    }

    @Test
    fun `Should getTrigrams for vigilance areas`() {
        // Given
        val trigrams = listOf("ABC", "DEF", "GHI")
        given(getTrigrams.execute()).willReturn(trigrams)
        // When
        mockMvc
            .perform(get("/bff/v1/vigilance_areas/trigrams"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0]", equalTo("ABC")))
            .andExpect(jsonPath("$[1]", equalTo("DEF")))
            .andExpect(jsonPath("$[2]", equalTo("GHI")))
    }
}
