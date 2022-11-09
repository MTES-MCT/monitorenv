package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlResources.ControlResourceEntity

data class ControlResourceDataOutput(
    val id: Int,
    val facade: String? = null,
    val administration: String? = null,
    val resourceName: String? = null,
    val size: String? = null,
    val name: String? = null,
    val city: String? = null,
    val type: String? = null,
    val interventionZone: String? = null,
    val telephone: String? = null,
    val mail: String? = null,
    val unit: String? = null
) {
    companion object {
        fun fromControlResourceEntity(controlResource: ControlResourceEntity) = ControlResourceDataOutput(
            id = controlResource.id,
            facade = controlResource.facade,
            administration = controlResource.administration,
            resourceName = controlResource.resourceName,
            size = controlResource.size,
            name = controlResource.name,
            city = controlResource.city,
            type = controlResource.type,
            interventionZone = controlResource.interventionZone,
            telephone = controlResource.telephone,
            mail = controlResource.mail,
            unit = controlResource.unit
        )
    }
}
