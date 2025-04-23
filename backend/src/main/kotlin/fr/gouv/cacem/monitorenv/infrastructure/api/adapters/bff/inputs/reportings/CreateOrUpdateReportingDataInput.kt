package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.reportings

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetDetailsEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.tags.TagInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.themes.ThemeInput
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.*

data class CreateOrUpdateReportingDataInput(
    val id: Int? = null,
    val reportingId: Long? = null,
    val reportingSources: List<ReportingSourceDataInput>,
    val targetType: TargetTypeEnum? = null,
    val vehicleType: VehicleTypeEnum? = null,
    val targetDetails: List<TargetDetailsEntity>? = listOf(),
    val geom: Geometry,
    val description: String? = null,
    val reportType: ReportingTypeEnum,
    val actionTaken: String? = null,
    val isControlRequired: Boolean? = null,
    val hasNoUnitAvailable: Boolean? = null,
    val createdAt: ZonedDateTime,
    val validityTime: Int? = null,
    val isArchived: Boolean,
    val openBy: String? = null,
    val missionId: Int? = null,
    val attachedToMissionAtUtc: ZonedDateTime? = null,
    val detachedFromMissionAtUtc: ZonedDateTime? = null,
    val attachedEnvActionId: UUID? = null,
    val updatedAtUtc: ZonedDateTime? = null,
    val withVHFAnswer: Boolean? = null,
    val isInfractionProven: Boolean,
    val tags: List<TagInput> = listOf(),
    val theme: ThemeInput,
) {
    fun toReportingEntity(): ReportingEntity =
        ReportingEntity(
            id = this.id,
            reportingId = this.reportingId,
            reportingSources = reportingSources.map { it.toReportingSourceEntity() },
            targetType = this.targetType,
            vehicleType = this.vehicleType,
            targetDetails = this.targetDetails,
            geom = this.geom,
            description = this.description,
            reportType = this.reportType,
            actionTaken = this.actionTaken,
            isControlRequired = this.isControlRequired,
            hasNoUnitAvailable = this.hasNoUnitAvailable,
            createdAt = this.createdAt,
            validityTime = this.validityTime,
            isArchived = this.isArchived,
            isDeleted = false,
            openBy = this.openBy,
            missionId = this.missionId,
            attachedToMissionAtUtc = this.attachedToMissionAtUtc,
            detachedFromMissionAtUtc = this.detachedFromMissionAtUtc,
            attachedEnvActionId = this.attachedEnvActionId,
            updatedAtUtc = this.updatedAtUtc,
            withVHFAnswer = this.withVHFAnswer,
            isInfractionProven = this.isInfractionProven,
            tags = this.tags.map { it.toTagEntity() },
            theme = theme.toThemeEntity(),
        )
}
