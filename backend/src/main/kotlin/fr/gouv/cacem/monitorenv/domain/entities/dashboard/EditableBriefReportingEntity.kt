package fr.gouv.cacem.monitorenv.domain.entities.dashboard

import java.time.ZonedDateTime
import java.util.*

data class EditableBriefReportingEntity(
    val id: Int? = null,
    val reportingId: String,
    val reportingSources: String,
    val targetType: String? = null,
    val vehicleType: String? = null,
    val targetDetails: List<EditableBriefTargetDetailsEntity>? = listOf(),
    val geom: String,
    val seaFront: String? = null,
    val description: String? = null,
    val reportType: String,
    val themeId: String,
    val subThemeIds: String,
    val actionTaken: String? = null,
    val isControlRequired: Boolean? = null,
    val hasNoUnitAvailable: Boolean? = null,
    val createdAt: String,
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
)
