package fr.gouv.cacem.monitorenv.domain.entities.dashboard

data class EditableBriefTargetDetailsEntity(
    val mmsi: String? = null,
    val imo: String? = null,
    val externalReferenceNumber: String? = null,
    val vesselName: String? = null,
    val operatorName: String? = null,
    val size: String? = null,
    val vesselType: String? = null,
)
