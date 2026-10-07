package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.amps

import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import org.locationtech.jts.geom.MultiPolygon

data class AMPDataOutput(
    val id: Int,
    val designation: String,
    val extent: DoubleArray? = null,
    val geom: MultiPolygon?,
    val name: String,
    val refReg: String? = null,
    val type: String? = null,
    val urlLegicem: String? = null,
    val updatedAt: String? = null,
    val isNew: Boolean = false,
) {
    companion object {
        fun fromAMPEntity(
            amp: AMPEntity,
            withGeom: Boolean = true,
        ) = AMPDataOutput(
            id = amp.id,
            designation = amp.designation,
            extent = amp.extent,
            geom = if (withGeom) amp.geom else null,
            name = amp.name,
            refReg = amp.refReg,
            type = amp.type,
            urlLegicem = amp.urlLegicem,
            updatedAt = amp.updatedAt,
            isNew = amp.isNew(),
        )
    }
}
