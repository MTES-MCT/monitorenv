package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.anyOrNull
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.WebSecurityConfig
import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.semaphore.SemaphoreEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.ArchiveReportings
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.CreateOrUpdateReporting
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.DeleteReporting
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.DeleteReportings
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.GetReportingById
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.GetReportings
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDTO
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.CreateOrUpdateReportingDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1.ReportingsController
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.Point
import org.locationtech.jts.io.WKTReader
import org.mockito.BDDMockito.given
import org.mockito.Mockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.ZonedDateTime

@Import(WebSecurityConfig::class, MapperConfiguration::class)
@WebMvcTest(value = [(ReportingsController::class)])
class ReportingsControllerITests {
    @Autowired
    private lateinit var mockedApi: MockMvc

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @MockBean
    private lateinit var createOrUpdateReporting: CreateOrUpdateReporting

    @MockBean
    private lateinit var getReportings: GetReportings

    @MockBean
    private lateinit var getReportingById: GetReportingById

    @MockBean
    private lateinit var deleteReporting: DeleteReporting

    @MockBean private lateinit var deleteReportings: DeleteReportings

    @MockBean private lateinit var archiveReportings: ArchiveReportings

    @Test
    fun `Should create a new Reporting`() {
        // Given
        val polygon =
            WKTReader()
                .read(
                    "MULTIPOLYGON (((-61.0 14.0, -61.0 15.0, -60.0 15.0, -60.0 14.0, -61.0 14.0)))",
                )
        val reporting =
            ReportingDTO(
                reporting = ReportingEntity(
                    id = 1,
                    sourceType = SourceTypeEnum.SEMAPHORE,
                    semaphoreId = 1,
                    targetType = TargetTypeEnum.VEHICLE,
                    vehicleType = VehicleTypeEnum.VESSEL,
                    geom = polygon,
                    seaFront = "Facade 1",
                    description = "description",
                    reportType = ReportingTypeEnum.INFRACTION_SUSPICION,
                    themeId = 12,
                    subThemeIds = listOf(64, 82),
                    actionTaken = "actions effectuées blabla",
                    isControlRequired = true,
                    hasNoUnitAvailable = true,
                    createdAt =
                    ZonedDateTime.parse(
                        "2022-01-15T04:50:09Z",
                    ),
                    validityTime = 10,
                    isArchived = false,
                    isDeleted = false,
                    openBy = "CDA",
                ),
                semaphore = SemaphoreEntity(
                    id = 1,
                    name = "name",
                    geom =
                    WKTReader()
                        .read(
                            "POINT (-61.0 14.0)",
                        ) as
                        Point,
                ),
            )

        val request =
            CreateOrUpdateReportingDataInput(
                sourceType = SourceTypeEnum.SEMAPHORE,
                semaphoreId = 1,
                targetType = TargetTypeEnum.VEHICLE,
                vehicleType = VehicleTypeEnum.VESSEL,
                geom = polygon,
                description = "description",
                reportType = ReportingTypeEnum.INFRACTION_SUSPICION,
                themeId = 12,
                subThemeIds = listOf(64, 82),
                actionTaken = "actions effectuées blabla",
                isControlRequired = true,
                hasNoUnitAvailable = true,
                createdAt =
                ZonedDateTime.parse(
                    "2022-01-15T04:50:09Z",
                ),
                validityTime = 10,
                isArchived = false,
                openBy = "CDA",
            )

        given(createOrUpdateReporting.execute(any())).willReturn(reporting)
        // When
        mockedApi
            .perform(
                put("/bff/v1/reportings")
                    .contentType(
                        MediaType.APPLICATION_JSON,
                    )
                    .content(
                        objectMapper.writeValueAsString(
                            request,
                        ),
                    ),
            )
            // Then
            .andExpect(status().isCreated)
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.sourceType").value("SEMAPHORE"))
            .andExpect(jsonPath("$.targetType").value("VEHICLE"))
            .andExpect(jsonPath("$.vehicleType").value("VESSEL"))
            .andExpect(jsonPath("$.geom.type").value("MultiPolygon"))
            .andExpect(jsonPath("$.seaFront").value("Facade 1"))
            .andExpect(jsonPath("$.description").value("description"))
            .andExpect(jsonPath("$.reportType").value("INFRACTION_SUSPICION"))
            .andExpect(jsonPath("$.themeId").value(12))
            .andExpect(jsonPath("$.subThemeIds[0]").value(64))
            .andExpect(jsonPath("$.subThemeIds[1]").value(82))
            .andExpect(
                jsonPath("$.actionTaken").value("actions effectuées blabla"),
            )
            .andExpect(jsonPath("$.isControlRequired").value(true))
            .andExpect(jsonPath("$.hasNoUnitAvailable").value(true))
            .andExpect(jsonPath("$.createdAt").value("2022-01-15T04:50:09Z"))
            .andExpect(jsonPath("$.validityTime").value(10))
            .andExpect(jsonPath("$.isArchived").value(false))
    }

    @Test
    fun `Should return the reporting specified in url`() {
        // Given
        val polygon =
            WKTReader()
                .read(
                    "MULTIPOLYGON (((-61.0 14.0, -61.0 15.0, -60.0 15.0, -60.0 14.0, -61.0 14.0)))",
                )
        val reporting =
            ReportingDTO(
                reporting = ReportingEntity(
                    id = 1,
                    sourceType = SourceTypeEnum.SEMAPHORE,
                    semaphoreId = 1,
                    targetType = TargetTypeEnum.VEHICLE,
                    vehicleType = VehicleTypeEnum.VESSEL,
                    geom = polygon,
                    seaFront = "Facade 1",
                    description = "description",
                    reportType = ReportingTypeEnum.INFRACTION_SUSPICION,
                    themeId = 12,
                    subThemeIds = listOf(64, 82),
                    actionTaken = "actions effectuées blabla",
                    isControlRequired = true,
                    hasNoUnitAvailable = true,
                    createdAt =
                    ZonedDateTime.parse(
                        "2022-01-15T04:50:09Z",
                    ),
                    validityTime = 10,
                    isArchived = false,
                    isDeleted = false,
                    openBy = "CDA",
                ),
                semaphore = SemaphoreEntity(
                    id = 1,
                    name = "name",
                    geom =
                    WKTReader()
                        .read(
                            "POINT (-61.0 14.0)",
                        ) as
                        Point,
                ),
            )

        given(getReportingById.execute(any())).willReturn(reporting)

        // When
        mockedApi
            .perform(
                get("/bff/v1/reportings/1")
                    .contentType(
                        MediaType.APPLICATION_JSON,
                    ),
            )
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.sourceType").value("SEMAPHORE"))
            .andExpect(jsonPath("$.targetType").value("VEHICLE"))
            .andExpect(jsonPath("$.vehicleType").value("VESSEL"))
            .andExpect(jsonPath("$.geom.type").value("MultiPolygon"))
            .andExpect(jsonPath("$.seaFront").value("Facade 1"))
            .andExpect(jsonPath("$.description").value("description"))
            .andExpect(jsonPath("$.reportType").value("INFRACTION_SUSPICION"))
            .andExpect(jsonPath("$.themeId").value(12))
            .andExpect(jsonPath("$.subThemeIds[0]").value(64))
            .andExpect(jsonPath("$.subThemeIds[1]").value(82))
            .andExpect(
                jsonPath("$.actionTaken").value("actions effectuées blabla"),
            )
            .andExpect(jsonPath("$.isControlRequired").value(true))
            .andExpect(jsonPath("$.hasNoUnitAvailable").value(true))
            .andExpect(jsonPath("$.createdAt").value("2022-01-15T04:50:09Z"))
            .andExpect(jsonPath("$.validityTime").value(10))
            .andExpect(jsonPath("$.isArchived").value(false))
    }

    @Test
    fun `Should return all reportings`() {
        // Given
        val polygon =
            WKTReader()
                .read(
                    "MULTIPOLYGON (((-61.0 14.0, -61.0 15.0, -60.0 15.0, -60.0 14.0, -61.0 14.0)))",
                )
        val reporting =
            ReportingDTO(
                reporting = ReportingEntity(
                    id = 1,
                    sourceType = SourceTypeEnum.SEMAPHORE,
                    targetType = TargetTypeEnum.VEHICLE,
                    vehicleType = VehicleTypeEnum.VESSEL,
                    geom = polygon,
                    seaFront = "Facade 1",
                    description = "description",
                    reportType = ReportingTypeEnum.INFRACTION_SUSPICION,
                    themeId = 12,
                    subThemeIds = listOf(64, 82),
                    actionTaken = "actions effectuées blabla",
                    isControlRequired = true,
                    hasNoUnitAvailable = true,
                    createdAt =
                    ZonedDateTime.parse(
                        "2022-01-15T04:50:09Z",
                    ),
                    validityTime = 10,
                    isArchived = false,
                    isDeleted = false,
                    openBy = "CDA",
                ),
            )

        given(
            getReportings.execute(
                pageNumber = anyOrNull(),
                pageSize = anyOrNull(),
                startedAfterDateTime = any(),
                startedBeforeDateTime = any(),
                reportingType = any(),
                seaFronts = any(),
                sourcesType = any(),
                status = any(),
            ),
        )
            .willReturn(listOf(reporting))

        // When
        mockedApi
            .perform(get("/bff/v1/reportings"))
            // Then
            .andExpect(status().isOk)
    }

    @Test
    fun `Should update a reporting`() {
        // Given
        val polygon =
            WKTReader()
                .read(
                    "MULTIPOLYGON (((-61.0 14.0, -61.0 15.0, -60.0 15.0, -60.0 14.0, -61.0 14.0)))",
                )
        val updatedReporting =
            ReportingDTO(
                reporting = ReportingEntity(
                    id = 1,
                    sourceType = SourceTypeEnum.SEMAPHORE,
                    semaphoreId = 1,

                    targetType = TargetTypeEnum.VEHICLE,
                    vehicleType = VehicleTypeEnum.VESSEL,
                    geom = polygon,
                    seaFront = "Facade 1",
                    description = "description",
                    reportType = ReportingTypeEnum.INFRACTION_SUSPICION,
                    themeId = 12,
                    subThemeIds = listOf(64, 82),
                    actionTaken = "actions effectuées blabla",
                    isControlRequired = true,
                    hasNoUnitAvailable = true,
                    createdAt =
                    ZonedDateTime.parse(
                        "2022-01-15T04:50:09Z",
                    ),
                    validityTime = 10,
                    isArchived = false,
                    isDeleted = false,
                    openBy = "CDA",
                ),
                semaphore = SemaphoreEntity(
                    id = 1,
                    name = "name",
                    geom =
                    WKTReader()
                        .read(
                            "POINT (-61.0 14.0)",
                        ) as
                        Point,
                ),
            )
        val updateRequestBody =
            objectMapper.writeValueAsString(
                CreateOrUpdateReportingDataInput(
                    id = 1,
                    sourceType = SourceTypeEnum.SEMAPHORE,
                    targetType = TargetTypeEnum.VEHICLE,
                    vehicleType = VehicleTypeEnum.VESSEL,
                    geom = polygon,
                    description = "description",
                    reportType = ReportingTypeEnum.INFRACTION_SUSPICION,
                    themeId = 12,
                    subThemeIds = listOf(64, 82),
                    actionTaken = "actions effectuées blabla",
                    isControlRequired = true,
                    hasNoUnitAvailable = true,
                    createdAt =
                    ZonedDateTime.parse(
                        "2022-01-15T04:50:09Z",
                    ),
                    validityTime = 10,
                    isArchived = false,
                    openBy = "CDA",
                ),
            )

        given(createOrUpdateReporting.execute(any()))
            .willReturn(updatedReporting)

        // When
        mockedApi
            .perform(
                put("/bff/v1/reportings/1")
                    .content(updateRequestBody)
                    .contentType(
                        MediaType.APPLICATION_JSON,
                    ),
            )
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.sourceType").value("SEMAPHORE"))
            .andExpect(jsonPath("$.targetType").value("VEHICLE"))
            .andExpect(jsonPath("$.vehicleType").value("VESSEL"))
            .andExpect(jsonPath("$.geom.type").value("MultiPolygon"))
            .andExpect(jsonPath("$.seaFront").value("Facade 1"))
            .andExpect(jsonPath("$.description").value("description"))
            .andExpect(jsonPath("$.reportType").value("INFRACTION_SUSPICION"))
            .andExpect(jsonPath("$.themeId").value(12))
            .andExpect(jsonPath("$.subThemeIds[0]").value(64))
            .andExpect(jsonPath("$.subThemeIds[1]").value(82))
            .andExpect(
                jsonPath("$.actionTaken").value("actions effectuées blabla"),
            )
            .andExpect(jsonPath("$.isControlRequired").value(true))
            .andExpect(jsonPath("$.hasNoUnitAvailable").value(true))
            .andExpect(jsonPath("$.createdAt").value("2022-01-15T04:50:09Z"))
            .andExpect(jsonPath("$.validityTime").value(10))
            .andExpect(jsonPath("$.isArchived").value(false))
    }

    @Test
    fun `Should delete a reporting`() {
        // When
        mockedApi
            .perform(delete("/bff/v1/reportings/123"))
            // Then
            .andExpect(status().isNoContent())

        Mockito.verify(deleteReporting).execute(123)
    }

    @Test
    fun `Should archive multiple reportings`() {
        // When
        mockedApi
            .perform(
                put("/bff/v1/reportings/archive")
                    .content(objectMapper.writeValueAsString(listOf(1, 2, 3)))
                    .contentType(MediaType.APPLICATION_JSON),
            )
            // Then
            .andExpect(status().isNoContent())

        Mockito.verify(archiveReportings).execute(listOf(1, 2, 3))
    }

    @Test
    fun `Should delete multiple reportings`() {
        // When
        mockedApi
            .perform(
                put("/bff/v1/reportings/delete")
                    .content(objectMapper.writeValueAsString(listOf(1, 2, 3)))
                    .contentType(MediaType.APPLICATION_JSON),
            )
            // Then
            .andExpect(status().isNoContent())

        Mockito.verify(deleteReportings).execute(listOf(1, 2, 3))
    }
}
