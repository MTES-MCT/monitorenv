package fr.gouv.cacem.monitorenv.domain.entities.reporting

data class TargetDetailsEntity(
    val registrationNumber: String? = null,
    val imo: String? = null,
    val mmsi: String? = null,
    val controlledPersonIdentity: String? = null,
    val vesselSize: Int? = null,
    val vesselBatchId: Int? = null,
    val vesselName: String? = null,
    val vesselRowNumber: Int? = null,
    val vesselShipId: Int? = null,
    val vesselType: String? = null,
)
