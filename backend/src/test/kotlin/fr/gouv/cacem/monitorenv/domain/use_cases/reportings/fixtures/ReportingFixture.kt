package fr.gouv.cacem.monitorenv.domain.use_cases.reportings.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingSourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingSourceDTO
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import java.time.ZonedDateTime

class ReportingFixture {

    companion object {
        fun aReporting(
            id: Int? = null,
            reportingSources: List<ReportingSourceEntity> = listOf(),
            missionId: Int? = null,
            attachedToMissionAtUtc: ZonedDateTime? = null,
        ): ReportingEntity {
            val wktReader = WKTReader()

            val multipolygonString =
                "MULTIPOLYGON(((-2.7335 47.6078, -2.7335 47.8452, -3.6297 47.8452, -3.6297 47.6078, -2.7335 47.6078)))"
            val polygon = wktReader.read(multipolygonString) as MultiPolygon

            return ReportingEntity(
                id = id,
                targetType = TargetTypeEnum.VEHICLE,
                reportingSources = reportingSources,
                vehicleType = VehicleTypeEnum.VESSEL,
                geom = polygon,
                seaFront = "Facade 1",
                description = "description",
                reportType = ReportingTypeEnum.INFRACTION_SUSPICION,
                themeId = 1,
                subThemeIds = listOf(10, 11),
                actionTaken = "actions effectuées ",
                isControlRequired = true,
                hasNoUnitAvailable = true,
                createdAt = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                validityTime = 10,
                isArchived = false,
                isDeleted = false,
                updatedAtUtc = ZonedDateTime.now(),
                openBy = "CDA",
                isInfractionProven = true,
                missionId = missionId,
                attachedToMissionAtUtc = attachedToMissionAtUtc,
            )
        }

        fun aReportingDTO(): ReportingDTO {
            return ReportingDTO(
                reporting = aReporting(id = 1),
                reportingSources = listOf(
                    ReportingSourceDTO(
                        reportingSource = aReportingSourceSemaphore(),
                        semaphore = null,
                        controlUnit = null,
                    ),
                ),
            )
        }

        fun aReportingSourceSemaphore(reportingId: Int? = null, semaphoreId: Int = 1): ReportingSourceEntity {
            return ReportingSourceEntity(
                id = null,
                reportingId = reportingId,
                sourceType = SourceTypeEnum.SEMAPHORE,
                semaphoreId = semaphoreId,
                controlUnitId = null,
                sourceName = null,
            )
        }

        fun aReportingSourceControlUnit(reportingId: Int? = null, controlUnitId: Int = 1): ReportingSourceEntity {
            return ReportingSourceEntity(
                id = null,
                reportingId = reportingId,
                sourceType = SourceTypeEnum.CONTROL_UNIT,
                semaphoreId = null,
                controlUnitId = controlUnitId,
                sourceName = null,
            )
        }
    }
}
