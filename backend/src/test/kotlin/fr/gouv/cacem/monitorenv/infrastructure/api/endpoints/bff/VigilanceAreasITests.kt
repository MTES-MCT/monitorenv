package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.WebSecurityConfig
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.EndingConditionEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.FrequencyEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VisibilityEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.CreateOrUpdateVigilanceArea
import fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.DeleteVigilanceArea
import fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.GetVigilanceAreaById
import fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.GetVigilanceAreas
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.vigilanceArea.VigilanceAreaDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1.VigilanceAreas
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.geom.Point
import org.locationtech.jts.io.WKTReader
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.context.annotation.Import
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.ZonedDateTime

@Import(WebSecurityConfig::class, MapperConfiguration::class)
@WebMvcTest(value = [(VigilanceAreas::class)])
class VigilanceAreasITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var getAllVigilanceAreas: GetVigilanceAreas

    @MockBean
    private lateinit var getVigilanceAreaById: GetVigilanceAreaById

    @MockBean
    private lateinit var createOrUpdateVigilanceArea: CreateOrUpdateVigilanceArea

    @MockBean
    private lateinit var deleteVigilanceArea: DeleteVigilanceArea

    @Autowired private lateinit var objectMapper: ObjectMapper

    private val polygon =
        WKTReader()
            .read(
                "MULTIPOLYGON (((-4.54877817 48.30555988, -4.54997332 48.30597601, -4.54998501 48.30718823, -4.5487929 48.30677461, -4.54877817 48.30555988)))",
            ) as
            MultiPolygon
    private val point = WKTReader().read("POINT (-4.54877816747593 48.305559876971)") as Point

    private val vigilanceArea1 = VigilanceAreaEntity(
        id = 1,
        name = "Vigilance Area 1",
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
        links = null,
        source = "Source de la zone de vigilance",
        startDatePeriod = ZonedDateTime.parse("2024-08-18T00:00:00Z"),
        themes = null,
        visibility = VisibilityEnum.PRIVATE,
    )

    @Test
    fun `Should get all vigilance areas`() {
        // Given
        val vigilanceArea2 = VigilanceAreaEntity(
            id = 2,
            name = "Vigilance Area 2",
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
            links = null,
            source = "Un particulier",
            startDatePeriod = ZonedDateTime.parse("2024-12-01T00:00:00Z"),
            themes = null,
            visibility = VisibilityEnum.PUBLIC,
        )
        given(getAllVigilanceAreas.execute()).willReturn(listOf(vigilanceArea1, vigilanceArea2))
        // When
        mockMvc.perform(get("/bff/v1/vigilance_areas"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id", equalTo(1)))
            .andExpect(jsonPath("$[0].name", equalTo("Vigilance Area 1")))
            .andExpect(jsonPath("$[0].isDraft", equalTo(false)))
            .andExpect(jsonPath("$[0].comments", equalTo("Commentaires sur la zone de vigilance")))
            .andExpect(jsonPath("$[0].createdBy", equalTo("ABC")))
            .andExpect(jsonPath("$[0].endingCondition", equalTo("OCCURENCES_NUMBER")))
            .andExpect(jsonPath("$[0].endingOccurrenceDate").doesNotExist())
            .andExpect(jsonPath("$[0].endingOccurrencesNumber", equalTo(2)))
            .andExpect(jsonPath("$[0].frequency", equalTo("ALL_WEEKS")))
            .andExpect(jsonPath("$[0].endDatePeriod", equalTo("2024-08-08T23:59:59Z")))
            .andExpect(jsonPath("$[0].geom.type", equalTo("MultiPolygon"))).andExpect(
                jsonPath("$[0].links").doesNotExist(),
            )
            .andExpect(jsonPath("$[0].source", equalTo("Source de la zone de vigilance")))
            .andExpect(jsonPath("$[0].startDatePeriod", equalTo("2024-08-18T00:00:00Z")))
            .andExpect(jsonPath("$[0].themes").doesNotExist())
            .andExpect(jsonPath("$[0].visibility", equalTo("PRIVATE")))
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
            .andExpect(jsonPath("$[1].geom.type", equalTo("MultiPolygon"))).andExpect(
                jsonPath("$[0].links").doesNotExist(),
            )
            .andExpect(jsonPath("$[1].source", equalTo("Un particulier")))
            .andExpect(jsonPath("$[1].startDatePeriod", equalTo("2024-12-01T00:00:00Z")))
            .andExpect(jsonPath("$[1].themes").doesNotExist())
            .andExpect(jsonPath("$[1].visibility", equalTo("PUBLIC")))
    }

    @Test
    fun `Should get specific vigilance area`() {
        // Given
        given(getVigilanceAreaById.execute(1)).willReturn(vigilanceArea1)
        // When
        mockMvc.perform(get("/bff/v1/vigilance_areas/1"))
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
            .andExpect(jsonPath("$.geom.type", equalTo("MultiPolygon"))).andExpect(
                jsonPath("$[0].links").doesNotExist(),
            )
            .andExpect(jsonPath("$.source", equalTo("Source de la zone de vigilance")))
            .andExpect(jsonPath("$.startDatePeriod", equalTo("2024-08-18T00:00:00Z")))
            .andExpect(jsonPath("$.themes").doesNotExist())
            .andExpect(jsonPath("$.visibility", equalTo("PRIVATE")))
    }

    @Test
    fun `Should create a new vigilance area`() {
        // Given
        val vigilanceAreaDataInput = VigilanceAreaDataInput(
            id = 1,
            name = "Vigilance Area 1",
            isDraft = false,
            comments = "Commentaires sur la zone de vigilance",
            createdBy = "ABC",
            endingCondition = EndingConditionEnum.OCCURENCES_NUMBER,
            endingOccurrenceDate = null,
            endingOccurrencesNumber = 2,
            frequency = FrequencyEnum.ALL_WEEKS,
            endDatePeriod = ZonedDateTime.parse("2024-08-08T23:59:59Z"),
            geom = polygon,
            links = null,
            source = "Source de la zone de vigilance",
            startDatePeriod = ZonedDateTime.parse("2024-08-18T00:00:00Z"),
            themes = null,
            visibility = VisibilityEnum.PRIVATE,
        )
        given(createOrUpdateVigilanceArea.execute(vigilanceArea1)).willReturn(vigilanceArea1)
        // When
        mockMvc.perform(
            put("/bff/v1/vigilance_areas")
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
            .andExpect(jsonPath("$.geom.type", equalTo("MultiPolygon"))).andExpect(
                jsonPath("$[0].links").doesNotExist(),
            )
            .andExpect(jsonPath("$.source", equalTo("Source de la zone de vigilance")))
            .andExpect(jsonPath("$.startDatePeriod", equalTo("2024-08-18T00:00:00Z")))
            .andExpect(jsonPath("$.themes").doesNotExist())
            .andExpect(jsonPath("$.visibility", equalTo("PRIVATE")))
    }

    @Test
    fun `Should update a vigilance area`() {
        // Given
        val vigilanceAreaDataInput = VigilanceAreaDataInput(
            id = 1,
            name = "Vigilance Area 1",
            isDraft = false,
            comments = "Commentaires sur la zone de vigilance",
            createdBy = "ABC",
            endingCondition = EndingConditionEnum.OCCURENCES_NUMBER,
            endingOccurrenceDate = null,
            endingOccurrencesNumber = 2,
            frequency = FrequencyEnum.ALL_WEEKS,
            endDatePeriod = ZonedDateTime.parse("2024-08-08T23:59:59Z"),
            geom = polygon,
            links = null,
            source = "Source de la zone de vigilance",
            startDatePeriod = ZonedDateTime.parse("2024-08-18T00:00:00Z"),
            themes = null,
            visibility = VisibilityEnum.PRIVATE,
        )
        given(createOrUpdateVigilanceArea.execute(vigilanceArea1)).willReturn(vigilanceArea1)
        // When
        mockMvc.perform(
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
            .andExpect(jsonPath("$.geom.type", equalTo("MultiPolygon"))).andExpect(
                jsonPath("$[0].links").doesNotExist(),
            )
            .andExpect(jsonPath("$.source", equalTo("Source de la zone de vigilance")))
            .andExpect(jsonPath("$.startDatePeriod", equalTo("2024-08-18T00:00:00Z")))
            .andExpect(jsonPath("$.themes").doesNotExist())
            .andExpect(jsonPath("$.visibility", equalTo("PRIVATE")))
    }

    @Test
    fun `Should delete vigilance area`() {
        // Given
        val vigilanceAreaId = 20
        // When
        mockMvc.perform(delete("/bff/v1/vigilance_areas/$vigilanceAreaId"))
            // Then
            .andExpect(status().isNoContent())
    }
}
