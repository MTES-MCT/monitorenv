package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.regulatoryArea

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaGroupEntity

data class RegulatoryAreaGroupDataInput(
    val id: Int,
    val location: String?,
    val regulatoryAreaIds: List<Int>,
    val type: String?,
) {
    fun toRegulatoryAreaGroup(): RegulatoryAreaGroupEntity =
        RegulatoryAreaGroupEntity(id = id, location = location, regulatoryAreaIds = regulatoryAreaIds, type = type)
}
