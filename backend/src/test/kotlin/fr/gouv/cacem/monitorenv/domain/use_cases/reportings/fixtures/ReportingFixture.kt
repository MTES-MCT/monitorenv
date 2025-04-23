package fr.gouv.cacem.monitorenv.domain.use_cases.reportings.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.*
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDetailsDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingListDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingSourceDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.themes.fixtures.ThemeFixture.Companion.aTheme
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import java.time.ZonedDateTime
import java.util.*

class ReportingFixture {
    companion object {
        fun aReporting(
            id: Int? = null,
            reportingSources: List<ReportingSourceEntity> = listOf(aReportingSourceSemaphore()),
            missionId: Int? = null,
            attachedToMissionAtUtc: ZonedDateTime? = null,
            attachedEnvActionId: UUID? = null,
            validityTime: Int = 10,
            openBy: String = "CDA",
            targetType: TargetTypeEnum? = TargetTypeEnum.VEHICLE,
            description: String? = "description",
        ): ReportingEntity {
            val wktReader = WKTReader()

            val multipolygonString =
                "MULTIPOLYGON(((-2.7335 47.6078, -2.7335 47.8452, -3.6297 47.8452, -3.6297 47.6078, -2.7335 47.6078)))"
            val polygon = wktReader.read(multipolygonString) as MultiPolygon

            return ReportingEntity(
                id = id,
                targetType = targetType,
                reportingSources = reportingSources,
                vehicleType = VehicleTypeEnum.VESSEL,
                geom = polygon,
                seaFront = "Facade 1",
                description = description,
                reportType = ReportingTypeEnum.INFRACTION_SUSPICION,
                actionTaken = "actions effectuées ",
                isControlRequired = true,
                hasNoUnitAvailable = true,
                createdAt = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                validityTime = validityTime,
                isArchived = false,
                isDeleted = false,
                updatedAtUtc = ZonedDateTime.now(),
                openBy = openBy,
                isInfractionProven = true,
                missionId = missionId,
                attachedToMissionAtUtc = attachedToMissionAtUtc,
                attachedEnvActionId = attachedEnvActionId,
                tags = emptyList(),
                theme = aTheme(),
            )
        }

        fun aReportingDetailsDTO(
            id: Int? = 1,
            attachedEnvActionId: UUID? = null,
            reporting: ReportingEntity = aReporting(id, attachedEnvActionId = attachedEnvActionId),
        ): ReportingDetailsDTO =
            ReportingDetailsDTO(
                reporting = reporting,
                reportingSources =
                    listOf(
                        ReportingSourceDTO(
                            reportingSource = aReportingSourceSemaphore(),
                            semaphore = null,
                            controlUnit = null,
                        ),
                    ),
            )

        fun aReportingListDTO(
            id: Int? = 1,
            attachedEnvActionId: UUID? = null,
            reporting: ReportingEntity = aReporting(id, attachedEnvActionId = attachedEnvActionId),
        ): ReportingListDTO =
            ReportingListDTO(
                reporting = reporting,
                reportingSources =
                    listOf(
                        ReportingSourceDTO(
                            reportingSource = aReportingSourceSemaphore(),
                            semaphore = null,
                            controlUnit = null,
                        ),
                    ),
            )

        fun aReportingSourceSemaphore(
            reportingId: Int? = null,
            semaphoreId: Int = 1,
        ): ReportingSourceEntity =
            ReportingSourceEntity(
                id = null,
                reportingId = reportingId,
                sourceType = SourceTypeEnum.SEMAPHORE,
                semaphoreId = semaphoreId,
                controlUnitId = null,
                sourceName = null,
            )

        fun aReportingSourceControlUnit(
            reportingId: Int? = null,
            controlUnitId: Int = 1,
        ): ReportingSourceEntity =
            ReportingSourceEntity(
                id = null,
                reportingId = reportingId,
                sourceType = SourceTypeEnum.CONTROL_UNIT,
                semaphoreId = null,
                controlUnitId = controlUnitId,
                sourceName = null,
            )

        fun aReportingSourceOther(
            reportingId: Int? = null,
            sourceName: String = "test",
        ): ReportingSourceEntity =
            ReportingSourceEntity(
                id = null,
                reportingId = reportingId,
                sourceType = SourceTypeEnum.OTHER,
                semaphoreId = null,
                controlUnitId = null,
                sourceName = sourceName,
            )
    }
}
