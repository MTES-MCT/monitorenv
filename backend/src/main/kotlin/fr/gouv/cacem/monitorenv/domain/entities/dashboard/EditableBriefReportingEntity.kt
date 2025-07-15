package fr.gouv.cacem.monitorenv.domain.entities.dashboard

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum

data class EditableBriefReportingEntity(
    val id: Int? = null,
    val iconColor: String,
    val reportingId: String,
    val reportingSources: String,
    val targetType: TargetTypeEnum? = null,
    val vehicleType: VehicleTypeEnum? = null,
    val targetDetails: List<EditableBriefTargetDetailsEntity>? = listOf(),
    val localization: String,
    val reportType: String,
    val theme: String,
    val subThemes: String,
    val createdAt: String,
    val isArchived: Boolean,
) : DetailRenderable {
    override fun buildDetailsRows(): List<List<String>> =
        listOf(
            listOf("Thématique", "$theme / $subThemes"),
            listOf("Localisation", localization),
            listOf("Source", reportingSources),
        )
}
