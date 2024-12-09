package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import org.locationtech.jts.geom.MultiPolygon

data class RegulatoryAreaWithMetadataDataOutput(
    val id: Int,
    val entity_name: String? = null,
    val facade: String? = null,
    val geometry_simplified: MultiPolygon? = null,
    val layer_name: String? = null,
    val ref_reg: String? = null,
    val thematique: String? = null,
    val type: String? = null,
    val url: String? = null,
) {
    companion object {
        fun fromRegulatoryAreaEntity(regulatoryArea: RegulatoryAreaEntity) =
            RegulatoryAreaWithMetadataDataOutput(
                id = regulatoryArea.id,
                entity_name = regulatoryArea.entity_name,
                facade = regulatoryArea.facade,
                geometry_simplified = regulatoryArea.geometry_simplified,
                layer_name = regulatoryArea.layer_name,
                ref_reg = regulatoryArea.ref_reg,
                thematique = regulatoryArea.thematique,
                type = regulatoryArea.type,
                url = regulatoryArea.url,
            )
    }
}
