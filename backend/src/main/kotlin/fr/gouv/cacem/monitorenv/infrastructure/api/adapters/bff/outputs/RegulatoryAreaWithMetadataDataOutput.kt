package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.tags.TagOutput
import org.locationtech.jts.geom.MultiPolygon

data class RegulatoryAreaWithMetadataDataOutput(
    val id: Int,
    val entityName: String? = null,
    val facade: String? = null,
    val geom: MultiPolygon? = null,
    val layerName: String? = null,
    val refReg: String? = null,
    val tags: List<TagOutput>,
    val type: String? = null,
    val url: String? = null,
) {
    companion object {
        fun fromRegulatoryAreaEntity(regulatoryArea: RegulatoryAreaEntity) =
            RegulatoryAreaWithMetadataDataOutput(
                id = regulatoryArea.id,
                entityName = regulatoryArea.entityName,
                facade = regulatoryArea.facade,
                geom = regulatoryArea.geom,
                layerName = regulatoryArea.layerName,
                refReg = regulatoryArea.refReg,
                tags = regulatoryArea.tags.map { TagOutput.fromTagEntity(it) },
                type = regulatoryArea.type,
                url = regulatoryArea.url,
            )
    }
}
