package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.regulatoryArea

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.v2.RegulatoryAreaEntity
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

class RegulatoryAreaToCompleteDataOuput(
    val id: Int,
    val editionCacem: ZonedDateTime? = null,
    val geom: MultiPolygon? = null,
    val refReg: String? = null,
) {
    companion object {
        fun fromRegulatoryAreaToCompleteEntity(regulatoryArea: RegulatoryAreaEntity) =
            RegulatoryAreaToCompleteDataOuput(
                id = regulatoryArea.id,
                editionCacem = regulatoryArea.editionCacem,
                geom = regulatoryArea.geom,
                refReg = regulatoryArea.refReg,
            )
    }
}
