package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import org.locationtech.jts.geom.MultiPolygon

data class AMPDataOutput(
    val id: Int,
    val geom: MultiPolygon,
    val name: String,
    val designation: String,
    val ref_reg: String? = null,
    val type: String,
    val type_cacem: String? = null,
    val url_legicem: String? = null,
) {
    companion object {
        fun fromAMPEntity(amp: AMPEntity) = AMPDataOutput(
            id = amp.id,
            geom = amp.geom,
            name = amp.name,
            designation = amp.designation,
            ref_reg = amp.ref_reg,
            type = amp.type,
            type_cacem = amp.type_cacem,
            url_legicem = amp.url_legicem,
        )
    }
}
