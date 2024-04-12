package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import org.locationtech.jts.geom.MultiPolygon

data class AMPDataOutput(
    val id: Int,
    val designation: String,
    val geom: MultiPolygon,
    val name: String,
    val ref_reg: String? = null,
    val type: String? = null,
    val url_legicem: String? = null,
) {
    companion object {
        fun fromAMPEntity(amp: AMPEntity) = AMPDataOutput(
            id = amp.id,
            designation = amp.designation,
            geom = amp.geom,
            name = amp.name,
            ref_reg = amp.ref_reg,
            type = amp.type,
            url_legicem = amp.url_legicem,
        )
    }
}
