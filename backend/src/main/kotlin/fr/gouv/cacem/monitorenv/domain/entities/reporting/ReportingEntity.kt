package fr.gouv.cacem.monitorenv.domain.entities.reporting

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

data class ReportingEntity(
    val id: Int? = null,
    val reportingId: Long? = null,
    val reportingSources: List<ReportingSourceEntity>,
    val targetType: TargetTypeEnum? = null,
    val vehicleType: VehicleTypeEnum? = null,
    val targetDetails: List<TargetDetailsEntity>? = listOf(),
    val geom: Geometry? = null,
    val seaFront: String? = null,
    val description: String? = null,
    val reportType: ReportingTypeEnum? = null,
    val themeId: Int? = null,
    val subThemeIds: List<Int>? = emptyList(),
    val actionTaken: String? = null,
    val isControlRequired: Boolean? = null,
    val hasNoUnitAvailable: Boolean? = null,
    val createdAt: ZonedDateTime,
    val validityTime: Int? = null,
    val isArchived: Boolean,
    val isDeleted: Boolean,
    val openBy: String? = null,
    val missionId: Int? = null,
    val attachedToMissionAtUtc: ZonedDateTime? = null,
    val detachedFromMissionAtUtc: ZonedDateTime? = null,
    val attachedEnvActionId: UUID? = null,
    val updatedAtUtc: ZonedDateTime? = null,
    val withVHFAnswer: Boolean? = null,
    val isInfractionProven: Boolean,
    val tags: List<TagEntity>,
    var theme: ThemeEntity,
) {
    fun validate() {
        reportingSources.forEach { it.validate() }
    }
}
