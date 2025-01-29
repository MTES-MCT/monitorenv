package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import org.locationtech.jts.geom.MultiPolygon

data class RegulatoryAreaDataOutput(
    val id: Int,
    val entityName: String? = null,
    val geom: MultiPolygon? = null,
    val layerName: String? = null,
    val refReg: String? = null,
    val thematique: String? = null,
    val type: String? = null,
) {
    companion object {
        fun fromRegulatoryAreaEntity(regulatoryArea: RegulatoryAreaEntity) =
            RegulatoryAreaDataOutput(
                id = regulatoryArea.id,
                entityName = regulatoryArea.entityName,
                geom = regulatoryArea.geom,
                layerName = regulatoryArea.layerName,
                refReg = regulatoryArea.refReg,
                thematique = regulatoryArea.thematique,
                type = regulatoryArea.type,
            )
    }
}
