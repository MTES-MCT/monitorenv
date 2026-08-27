package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.regulatoryArea

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.AdditionalRefRegEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaGroupEntity
import java.time.ZonedDateTime

data class RegulatoryAreaGroupDataInput(
    val id: Int?,
    val additionalRefReg: List<AdditionalRefRegEntity>?,
    val date: ZonedDateTime?,
    val dateFin: ZonedDateTime?,
    val layerName: String?,
    val location: String?,
    val regulatoryAreaIds: List<Int>,
    val refReg: String?,
    val type: String?,
    val url: String?,
) {
    fun toRegulatoryAreaGroup(): RegulatoryAreaGroupEntity =
        RegulatoryAreaGroupEntity(
            id = id,
            additionalRefReg = additionalRefReg,
            date = date,
            dateFin = dateFin,
            layerName = layerName,
            location = location,
            regulatoryAreaIds = regulatoryAreaIds,
            refReg = refReg,
            type = type,
            url = url,
        )
}
