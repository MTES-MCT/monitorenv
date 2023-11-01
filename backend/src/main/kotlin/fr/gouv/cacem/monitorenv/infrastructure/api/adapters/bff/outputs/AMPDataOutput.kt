package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import org.locationtech.jts.geom.MultiPolygon

data class AMPDataOutput(
    val id: Int,
    val geom: MultiPolygon,
    val name: String,
    val designation: String,
    val type: String
) {
    companion object {
        fun fromAMPEntity(amp: AMPEntity) = AMPDataOutput(
            id = amp.id,
            geom = amp.geom,
            name = amp.name,
            designation = amp.designation,
            type = amp.type
        )
    }
}
