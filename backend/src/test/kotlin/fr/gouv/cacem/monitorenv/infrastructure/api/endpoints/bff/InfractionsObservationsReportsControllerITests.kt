package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.any
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.WebSecurityConfig
import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.InfractionsObservationsReportEntity
import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.ReportTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.infractionsObservationsReports.CreateOrUpdateInfractionsObservationsReport
import fr.gouv.cacem.monitorenv.domain.use_cases.infractionsObservationsReports.DeleteInfractionsObservationsReport
import fr.gouv.cacem.monitorenv.domain.use_cases.infractionsObservationsReports.GetAllInfractionsObservationsReports
import fr.gouv.cacem.monitorenv.domain.use_cases.infractionsObservationsReports.GetInfractionsObservationsReportById
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.inputs.CreateOrUpdateInfractionsObservationsReportDataInput
import org.junit.jupiter.api.Test
import org.locationtech.jts.io.WKTReader
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.ZonedDateTime

@Import(WebSecurityConfig::class, MapperConfiguration::class)
@WebMvcTest(value = [(InfractionsObservationsReportsController::class)])
class InfractionsObservationsReportsControllerITests {

    @Autowired
    private lateinit var mockedApi: MockMvc

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @MockBean
    private lateinit var createOrUpdateInfractionsObservationsReport: CreateOrUpdateInfractionsObservationsReport

    @MockBean
    private lateinit var getAllInfractionsObservationsReports: GetAllInfractionsObservationsReports

    @MockBean
    private lateinit var getInfractionsObservationsReportById: GetInfractionsObservationsReportById

    @MockBean
    private lateinit var deleteInfractionsObservationsReport: DeleteInfractionsObservationsReport

    @Test
    fun `Should create a new InfractionsObservationsReport`() {
        // Given
        val polygon = WKTReader().read("MULTIPOLYGON (((-61.0 14.0, -61.0 15.0, -60.0 15.0, -60.0 14.0, -61.0 14.0)))")
        val infractionsObservationsReport = InfractionsObservationsReportEntity(
            id = 1,
            sourceType = SourceTypeEnum.SEMAPHORE,
            targetType = TargetTypeEnum.VEHICLE,
            vehicleType = VehicleTypeEnum.VESSEL,
            geom = polygon,
            description = "description",
            reportType = ReportTypeEnum.INFRACTION,
            theme = "theme",
            subThemes = listOf("subTheme1", "subTheme2"),
            actionTaken = "actions effectuées blabla",
            isInfractionProven = true,
            isControlRequired = true,
            isUnitAvailable = true,
            createdAt = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            validityTime = 10,
            isDeleted = false,
        )

        val request = CreateOrUpdateInfractionsObservationsReportDataInput(
            sourceType = SourceTypeEnum.SEMAPHORE,
            targetType = TargetTypeEnum.VEHICLE,
            vehicleType = VehicleTypeEnum.VESSEL,
            geom = polygon,
            description = "description",
            reportType = ReportTypeEnum.INFRACTION,
            theme = "theme",
            subThemes = listOf("subTheme1", "subTheme2"),
            actionTaken = "actions effectuées blabla",
            isInfractionProven = true,
            isControlRequired = true,
            isUnitAvailable = true,
            createdAt = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            validityTime = 10,
        )

        given(this.createOrUpdateInfractionsObservationsReport.execute(any())).willReturn(infractionsObservationsReport)
        // When
        mockedApi.perform(
            put("/bff/v1/infractions-observations-reports")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)),
        )
            // Then
            .andExpect(status().isCreated)
            .andDo(MockMvcResultHandlers.print())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.sourceType").value("SEMAPHORE"))
            .andExpect(jsonPath("$.targetType").value("VEHICLE"))
            .andExpect(jsonPath("$.vehicleType").value("VESSEL"))
            .andExpect(jsonPath("$.geom.type").value("MultiPolygon"))
            .andExpect(jsonPath("$.description").value("description"))
            .andExpect(jsonPath("$.reportType").value("INFRACTION"))
            .andExpect(jsonPath("$.theme").value("theme"))
            .andExpect(jsonPath("$.subThemes[0]").value("subTheme1"))
            .andExpect(jsonPath("$.subThemes[1]").value("subTheme2"))
            .andExpect(jsonPath("$.actionTaken").value("actions effectuées blabla"))
            .andExpect(jsonPath("$.isInfractionProven").value(true))
            .andExpect(jsonPath("$.isControlRequired").value(true))
            .andExpect(jsonPath("$.isUnitAvailable").value(true))
            .andExpect(jsonPath("$.createdAt").value("2022-01-15T04:50:09Z"))
            .andExpect(jsonPath("$.validityTime").value(10))
    }
}
