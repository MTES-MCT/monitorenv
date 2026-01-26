package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import org.locationtech.jts.geom.MultiPolygon

data class AMPDataOutput(
    val id: Int,
    val designation: String,
    val geom: MultiPolygon?,
    val name: String,
    val refReg: String? = null,
    val type: String? = null,
    val urlLegicem: String? = null,
) {
    companion object {
        fun fromAMPEntity(amp: AMPEntity) =
            AMPDataOutput(
                id = amp.id,
                designation = amp.designation,
                geom = amp.geom,
                name = amp.name,
                refReg = amp.refReg,
                type = amp.type,
                urlLegicem = amp.urlLegicem,
            )
    }
}
