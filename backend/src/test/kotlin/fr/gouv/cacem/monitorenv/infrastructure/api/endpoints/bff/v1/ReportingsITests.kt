package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.anyOrNull
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.semaphore.SemaphoreEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.*
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDetailsDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingListDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingSourceDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.events.UpdateReportingEvent
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.fixtures.ReportingFixture
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.fixtures.ReportingFixture.Companion.aReportingDetailsDTO
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.reportings.CreateOrUpdateReportingDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.reportings.ReportingSourceDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1.reportings.Reportings
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1.reportings.SSEReporting
import org.assertj.core.api.Assertions
import org.hamcrest.Matchers
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.Point
import org.locationtech.jts.io.WKTReader
import org.mockito.BDDMockito.given
import org.mockito.Mockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.context.ApplicationEventPublisher
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.ZonedDateTime

@Import(SentryConfig::class, MapperConfiguration::class)
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(value = [Reportings::class, SSEReporting::class])
class ReportingsITests {
    @Autowired
    private lateinit var mockedApi: MockMvc

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @MockitoBean
    private lateinit var createOrUpdateReporting: CreateOrUpdateReporting

    @MockitoBean
    private lateinit var getReportings: GetReportings

    @MockitoBean
    private lateinit var getReportingById: GetReportingById

    @MockitoBean
    private lateinit var getReportingsByIds: GetReportingsByIds

    @MockitoBean
    private lateinit var deleteReporting: DeleteReporting

    @MockitoBean
    private lateinit var deleteReportings: DeleteReportings

    @MockitoBean
    private lateinit var archiveReportings: ArchiveReportings

    @Autowired
    private lateinit var applicationEventPublisher: ApplicationEventPublisher

    @Autowired
    private lateinit var sseReporting: SSEReporting

    @Test
    fun `Should create a new Reporting`() {
        // Given
        val polygon =
            WKTReader()
                .read(
                    "MULTIPOLYGON (((-61.0 14.0, -61.0 15.0, -60.0 15.0, -60.0 14.0, -61.0 14.0)))",
                )
        val reporting =
            ReportingDetailsDTO(
                reporting =
                    ReportingEntity(
                        id = 1,
                        reportingSources = listOf(),
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
                        updatedAtUtc =
                            ZonedDateTime.parse(
                                "2022-01-15T14:50:09Z",
                            ),
                        withVHFAnswer = null,
                        isInfractionProven = true,
                    ),
                reportingSources =
                    listOf(
                        ReportingSourceDTO(
                            reportingSource = ReportingFixture.aReportingSourceSemaphore(),
                            semaphore =
                                SemaphoreEntity(
                                    id = 1,
                                    name = "name",
                                    geom =
                                        WKTReader()
                                            .read(
                                                "POINT (-61.0 14.0)",
                                            ) as
                                            Point,
                                ),
                            controlUnit = null,
                        ),
                    ),
            )

        val request =
            CreateOrUpdateReportingDataInput(
                reportingSources =
                    listOf(
                        ReportingSourceDataInput(
                            id = null,
                            sourceType = SourceTypeEnum.SEMAPHORE,
                            semaphoreId = 1,
                            reportingId = null,
                            controlUnitId = null,
                            sourceName = null,
                        ),
                    ),
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
                updatedAtUtc =
                    ZonedDateTime.parse(
                        "2022-01-15T14:50:09Z",
                    ),
                isInfractionProven = true,
            )

        given(createOrUpdateReporting.execute(any())).willReturn(reporting)
        // When
        mockedApi
            .perform(
                put("/bff/v1/reportings")
                    .contentType(
                        MediaType.APPLICATION_JSON,
                    ).content(
                        objectMapper.writeValueAsString(
                            request,
                        ),
                    ),
            )
            // Then
            .andExpect(status().isCreated)
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.reportingSources[0].sourceType").value("SEMAPHORE"))
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
            ).andExpect(jsonPath("$.isControlRequired").value(true))
            .andExpect(jsonPath("$.hasNoUnitAvailable").value(true))
            .andExpect(jsonPath("$.createdAt").value("2022-01-15T04:50:09Z"))
            .andExpect(jsonPath("$.validityTime").value(10))
            .andExpect(jsonPath("$.isArchived").value(false))
            .andExpect(jsonPath("$.updatedAtUtc").value("2022-01-15T14:50:09Z"))
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
            ReportingDetailsDTO(
                reporting =
                    ReportingEntity(
                        id = 1,
                        reportingSources = listOf(),
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
                        updatedAtUtc =
                            ZonedDateTime.parse(
                                "2022-01-15T14:50:09Z",
                            ),
                        isInfractionProven = true,
                    ),
                reportingSources =
                    listOf(
                        ReportingSourceDTO(
                            reportingSource = ReportingFixture.aReportingSourceSemaphore(),
                            semaphore =
                                SemaphoreEntity(
                                    id = 1,
                                    name = "name",
                                    geom =
                                        WKTReader()
                                            .read(
                                                "POINT (-61.0 14.0)",
                                            ) as
                                            Point,
                                ),
                            controlUnit = null,
                        ),
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
            .andExpect(jsonPath("$.reportingSources[0].sourceType").value("SEMAPHORE"))
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
            ).andExpect(jsonPath("$.isControlRequired").value(true))
            .andExpect(jsonPath("$.hasNoUnitAvailable").value(true))
            .andExpect(jsonPath("$.createdAt").value("2022-01-15T04:50:09Z"))
            .andExpect(jsonPath("$.validityTime").value(10))
            .andExpect(jsonPath("$.isArchived").value(false))
            .andExpect(jsonPath("$.updatedAtUtc").value("2022-01-15T14:50:09Z"))
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
            ReportingListDTO(
                reporting =
                    ReportingEntity(
                        id = 1,
                        reportingSources = listOf(),
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
                        isInfractionProven = true,
                    ),
                reportingSources = listOf(),
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
                targetTypes = any(),
                isAttachedToMission = any(),
                searchQuery = any(),
            ),
        ).willReturn(listOf(reporting))

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
            ReportingDetailsDTO(
                reporting =
                    ReportingEntity(
                        id = 1,
                        reportingSources = listOf(),
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
                        updatedAtUtc =
                            ZonedDateTime.parse(
                                "2022-01-15T14:50:09Z",
                            ),
                        isInfractionProven = true,
                    ),
                reportingSources =
                    listOf(
                        ReportingSourceDTO(
                            reportingSource = ReportingFixture.aReportingSourceSemaphore(),
                            SemaphoreEntity(id = 1, geom = polygon.centroid, name = ""),
                            null,
                        ),
                    ),
            )
        val updateRequestBody =
            objectMapper.writeValueAsString(
                CreateOrUpdateReportingDataInput(
                    id = 1,
                    reportingSources = listOf(),
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
                    updatedAtUtc =
                        ZonedDateTime.parse(
                            "2022-01-15T14:50:09Z",
                        ),
                    isInfractionProven = true,
                ),
            )

        given(createOrUpdateReporting.execute(any())).willReturn(updatedReporting)

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
            .andExpect(jsonPath("$.reportingSources[0].sourceType").value("SEMAPHORE"))
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
            ).andExpect(jsonPath("$.isControlRequired").value(true))
            .andExpect(jsonPath("$.hasNoUnitAvailable").value(true))
            .andExpect(jsonPath("$.createdAt").value("2022-01-15T04:50:09Z"))
            .andExpect(jsonPath("$.validityTime").value(10))
            .andExpect(jsonPath("$.isArchived").value(false))
            .andExpect(jsonPath("$.createdAt").value("2022-01-15T04:50:09Z"))
            .andExpect(jsonPath("$.updatedAtUtc").value("2022-01-15T14:50:09Z"))
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

    @Test
    fun `Should retrieve reportings that match ids`() {
        // Given
        val ids = listOf(1, 2, 3)
        given(getReportingsByIds.execute(ids)).willReturn(
            listOf(
                aReportingDetailsDTO(1),
                aReportingDetailsDTO(2),
                aReportingDetailsDTO(3),
            ),
        )
        // When
        mockedApi
            .perform(
                post("/bff/v1/reportings")
                    .content(objectMapper.writeValueAsString(ids))
                    .contentType(MediaType.APPLICATION_JSON),
            )
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[1].id").value(2))
            .andExpect(jsonPath("$[2].id").value(3))
    }

    @Test
    fun `Should receive an event When listening to reporting updates`() {
        // Given
        val polygon =
            WKTReader()
                .read(
                    "MULTIPOLYGON (((-61.0 14.0, -61.0 15.0, -60.0 15.0, -60.0 14.0, -61.0 14.0)))",
                )
        val updateReportingEvent =
            UpdateReportingEvent(
                ReportingDetailsDTO(
                    reporting =
                        ReportingEntity(
                            id = 1,
                            reportingSources = listOf(ReportingFixture.aReportingSourceSemaphore()),
                            geom = polygon,
                            description = "description",
                            reportType = ReportingTypeEnum.INFRACTION_SUSPICION,
                            themeId = 12,
                            subThemeIds = listOf(64, 82),
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
                            updatedAtUtc =
                                ZonedDateTime.parse(
                                    "2022-01-15T14:50:09Z",
                                ),
                            isInfractionProven = true,
                        ),
                    reportingSources =
                        listOf(
                            ReportingSourceDTO(
                                reportingSource = ReportingFixture.aReportingSourceSemaphore(),
                                SemaphoreEntity(id = 1, geom = polygon.centroid, name = ""),
                                null,
                            ),
                        ),
                ),
            )

        // When we send an event from another thread
        object : Thread() {
            override fun run() {
                try {
                    sleep(250)
                    applicationEventPublisher.publishEvent(updateReportingEvent)
                } catch (ex: InterruptedException) {
                    println(ex)
                }
            }
        }.start()

        // Then
        val reportingUpdateEvent =
            mockedApi
                .perform(get("/bff/reportings/sse"))
                .andExpect(status().isOk)
                .andExpect(MockMvcResultMatchers.request().asyncStarted())
                .andExpect(
                    MockMvcResultMatchers.request().asyncResult(Matchers.nullValue()),
                ).andExpect(
                    MockMvcResultMatchers
                        .header()
                        .string("Content-Type", "text/event-stream"),
                ).andDo(MockMvcResultHandlers.log())
                .andReturn()
                .response
                .contentAsString

        Assertions.assertThat(reportingUpdateEvent).contains("event:REPORTING_UPDATE")
        Assertions
            .assertThat(reportingUpdateEvent)
            .containsIgnoringWhitespaces(
                """
                {
                  "id": 1,
                  "reportingId": null,
                  "reportingSources" : [{"id": null, "reportingId": null, "sourceType": "SEMAPHORE", "semaphoreId": 1, "controlUnitId": null, "sourceName": null, "displayedSource": ""}],
                  "targetType": null,
                  "vehicleType": null,
                  "targetDetails": [],
                  "geom": {
                    "type": "MultiPolygon",
                    "coordinates": [[[[-61, 14], [-61, 15], [-60, 15], [-60, 14], [-61, 14]]]]
                  },
                  "seaFront": null,
                  "description": "description",
                  "reportType": "INFRACTION_SUSPICION",
                  "themeId": 12,
                  "subThemeIds": [64, 82],
                  "actionTaken": null,
                  "isControlRequired": true,
                  "hasNoUnitAvailable": true,
                  "createdAt": "2022-01-15T04:50:09Z",
                  "validityTime": 10,
                  "isArchived": false,
                  "openBy": "CDA",
                  "missionId": null,
                  "attachedToMissionAtUtc": null,
                  "detachedFromMissionAtUtc": null,
                  "attachedEnvActionId": null,
                  "attachedMission": null,
                  "controlStatus": "CONTROL_TO_BE_DONE",
                  "updatedAtUtc": "2022-01-15T14:50:09Z",
                  "withVHFAnswer": null,
                  "isInfractionProven": true
                    }""",
            )
    }
}
