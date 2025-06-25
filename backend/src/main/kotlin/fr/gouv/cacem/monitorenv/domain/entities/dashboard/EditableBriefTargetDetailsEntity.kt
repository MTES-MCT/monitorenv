package fr.gouv.cacem.monitorenv.domain.entities.dashboard

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum.Companion.translateVehicleType
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum

data class EditableBriefTargetDetailsEntity(
    val mmsi: String? = null,
    val imo: String? = null,
    val externalReferenceNumber: String? = null,
    val vesselName: String? = null,
    val operatorName: String? = null,
    val size: String? = null,
    val vesselType: String? = null,
) {
    fun buildDetailsRows(reporting: EditableBriefReportingEntity): List<List<String>> {
        val targetLabel = "Type de cible"
        return when (reporting.targetType) {
            TargetTypeEnum.INDIVIDUAL ->
                listOf(
                    listOf(
                        targetLabel,
                        "Personne physique",
                        "Identité de la personne",
                        operatorName ?: "",
                        "",
                        "",
                    ),
                )

            TargetTypeEnum.COMPANY ->
                listOf(
                    listOf(
                        targetLabel,
                        "Personne morale",
                        "Nom de la personne morale",
                        operatorName ?: "",
                        "Identité de la personne contrôlée",
                        vesselName ?: "",
                    ),
                )

            TargetTypeEnum.OTHER ->
                listOf(
                    listOf(targetLabel, "Autre", "", "", "", ""),
                )

            else -> {
                if (reporting.vehicleType != VehicleTypeEnum.VESSEL) {
                    listOf(
                        listOf(
                            targetLabel,
                            "Véhicule",
                            "Immatriculation",
                            externalReferenceNumber ?: "",
                            "Identité de la personne contrôlée",
                            operatorName ?: "",
                        ),
                        listOf(
                            "Type de véhicule",
                            translateVehicleType(reporting.vehicleType),
                            "",
                            "",
                            "",
                            "",
                        ),
                    )
                } else {
                    listOf(
                        listOf(
                            targetLabel,
                            "Véhicule",
                            "Nom du navire",
                            vesselName ?: "",
                            "Immatriculation",
                            externalReferenceNumber ?: "",
                        ),
                        listOf(
                            "Type de véhicule",
                            "Navire",
                            "MMSI",
                            mmsi ?: "",
                            "Taille",
                            size ?: "",
                        ),
                        listOf(
                            "IMO",
                            imo ?: "",
                            "Nom du capitaine",
                            operatorName ?: "",
                            "Type de navire",
                            vesselType ?: "",
                        ),
                    )
                }
            }
        }
    }
}
