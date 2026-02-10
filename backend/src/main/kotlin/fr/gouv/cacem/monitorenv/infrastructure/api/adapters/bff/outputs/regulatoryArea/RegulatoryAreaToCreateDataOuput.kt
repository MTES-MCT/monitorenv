package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.regulatoryArea

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaNewEntity
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

class RegulatoryAreaToCreateDataOuput(
    val id: Int,
    val editionCacem: ZonedDateTime? = null,
    val geom: MultiPolygon? = null,
    val refReg: String? = null,
) {
    companion object {
        fun fromRegulatoryAreaToCreateEntity(regulatoryArea: RegulatoryAreaNewEntity) =
            RegulatoryAreaToCreateDataOuput(
                id = regulatoryArea.id,
                editionCacem = regulatoryArea.editionCacem,
                geom = regulatoryArea.geom,
                refReg = regulatoryArea.refReg,
            )
    }
}
