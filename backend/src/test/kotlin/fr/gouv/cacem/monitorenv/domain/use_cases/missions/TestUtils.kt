package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDTO
import org.locationtech.jts.io.WKTReader
import java.time.ZonedDateTime

object TestUtils {
    fun getReportingDTO(id: Int): ReportingDTO {
        val polygon =
            WKTReader()
                .read(
                    "MULTIPOLYGON (((-61.0 14.0, -61.0 15.0, -60.0 15.0, -60.0 14.0, -61.0 14.0)))",
                )

        return ReportingDTO(
            reporting =
            ReportingEntity(
                id = id,
                sourceType = SourceTypeEnum.SEMAPHORE,
                semaphoreId = 1,
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
            ),
        )
    }

    fun getReportingDTOWithAttachedMission(id: Int): ReportingDTO {
        val polygon =
            WKTReader()
                .read(
                    "MULTIPOLYGON (((-61.0 14.0, -61.0 15.0, -60.0 15.0, -60.0 14.0, -61.0 14.0)))",
                )

        return ReportingDTO(
            reporting =
            ReportingEntity(
                id = id,
                sourceType = SourceTypeEnum.SEMAPHORE,
                semaphoreId = 1,
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
            ),
        )
    }
}
