package fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea

import java.time.ZonedDateTime

data class RegulatoryAreaGroupEntity(
    val id: Int?,
    val additionalRefReg: List<AdditionalRefRegEntity>? = listOf(),
    val date: ZonedDateTime?,
    val dateFin: ZonedDateTime?,
    val layerName: String?,
    val location: String?,
    val regulatoryAreaIds: List<Int>,
    val refReg: String?,
    val type: String?,
    val url: String?,
)
