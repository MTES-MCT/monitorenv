package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import org.locationtech.jts.geom.MultiPolygon

data class RegulatoryAreaDataOutput(
    val id: Int,
    val geom: MultiPolygon? = null,
    val entity_name: String? = null,
    val url: String? = null,
    val layer_name: String? = null,
    val facade: String? = null,
    val ref_reg: String? = null,
    val thematique: String? = null,
    val type: String? = null,
) {
    companion object {
        fun fromRegulatoryAreaEntity(regulatoryArea: RegulatoryAreaEntity) = RegulatoryAreaDataOutput(
            id = regulatoryArea.id,
            entity_name = regulatoryArea.entity_name,
            url = regulatoryArea.url,
            layer_name = regulatoryArea.layer_name,
            facade = regulatoryArea.facade,
            ref_reg = regulatoryArea.ref_reg,
            thematique = regulatoryArea.thematique,
            geom = regulatoryArea.geom,
            type = regulatoryArea.type,
        )
    }
}
