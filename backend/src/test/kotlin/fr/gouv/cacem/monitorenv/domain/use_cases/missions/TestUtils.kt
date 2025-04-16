package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingSourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.semaphore.SemaphoreEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDetailsDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingSourceDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.themes.fixtures.ThemeFixture.Companion.aTheme
import org.locationtech.jts.io.WKTReader
import java.time.ZonedDateTime
import java.util.UUID

object TestUtils {
    fun getReportingDTO(id: Int): ReportingDetailsDTO {
        val polygon =
            WKTReader()
                .read(
                    "MULTIPOLYGON (((-61.0 14.0, -61.0 15.0, -60.0 15.0, -60.0 14.0, -61.0 14.0)))",
                )

        val reportingSourceEntity =
            ReportingSourceEntity(
                id = UUID.randomUUID(),
                reportingId = id,
                sourceType = SourceTypeEnum.SEMAPHORE,
                semaphoreId = 1,
                controlUnitId = null,
                sourceName = null,
            )
        return ReportingDetailsDTO(
            reporting =
                ReportingEntity(
                    id = id,
                    reportingSources =
                        listOf(
                            reportingSourceEntity,
                        ),
                    targetType = TargetTypeEnum.VEHICLE,
                    vehicleType = VehicleTypeEnum.VESSEL,
                    geom = polygon,
                    seaFront = "Facade 1",
                    description = "description",
                    reportType = ReportingTypeEnum.INFRACTION_SUSPICION,
                    themeId = 12,
                    subThemeIds = listOf(82),
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
                    tags = emptyList(),
                    theme = aTheme(),
                ),
            reportingSources =
                listOf(
                    ReportingSourceDTO(
                        reportingSource = reportingSourceEntity,
                        semaphore =
                            SemaphoreEntity(
                                id = 1,
                                geom = polygon.centroid,
                                name = "Semaphore de tonnerre de Brest",
                            ),
                        controlUnit = null,
                    ),
                ),
        )
    }

    fun getReportingDTOWithAttachedMission(id: Int): ReportingDetailsDTO {
        val polygon =
            WKTReader()
                .read(
                    "MULTIPOLYGON (((-61.0 14.0, -61.0 15.0, -60.0 15.0, -60.0 14.0, -61.0 14.0)))",
                )
        val reportingSourceEntity =
            ReportingSourceEntity(
                id = UUID.randomUUID(),
                reportingId = id,
                sourceType = SourceTypeEnum.SEMAPHORE,
                semaphoreId = 1,
                controlUnitId = null,
                sourceName = null,
            )
        return ReportingDetailsDTO(
            reporting =
                ReportingEntity(
                    id = id,
                    reportingSources =
                        listOf(
                            reportingSourceEntity,
                        ),
                    targetType = TargetTypeEnum.VEHICLE,
                    vehicleType = VehicleTypeEnum.VESSEL,
                    geom = polygon,
                    seaFront = "Facade 1",
                    description = "description",
                    reportType = ReportingTypeEnum.INFRACTION_SUSPICION,
                    themeId = 12,
                    subThemeIds = listOf(82),
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
                    missionId = 1,
                    attachedToMissionAtUtc =
                        ZonedDateTime.parse(
                            "2022-01-15T04:50:09Z",
                        ),
                    detachedFromMissionAtUtc = null,
                    isInfractionProven = true,
                    tags = emptyList(),
                    theme = aTheme(),
                ),
            reportingSources =
                listOf(
                    ReportingSourceDTO(
                        reportingSource = reportingSourceEntity,
                        semaphore =
                            SemaphoreEntity(
                                id = 1,
                                geom = polygon.centroid,
                                name = "Semaphore de tonnerre de Brest",
                            ),
                        controlUnit = null,
                    ),
                ),
        )
    }
}
