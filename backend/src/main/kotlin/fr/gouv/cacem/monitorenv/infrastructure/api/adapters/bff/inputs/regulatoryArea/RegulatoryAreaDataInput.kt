package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.regulatoryArea

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.AdditionalRefRegEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.AreaTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.tags.TagInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.themes.ThemeInput
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class RegulatoryAreaDataInput(
    val id: Int,
    val authorizationPeriods: String? = null,
    val creation: ZonedDateTime? = null,
    val date: ZonedDateTime? = null,
    val dateFin: ZonedDateTime? = null,
    val editeur: String? = null,
    val editionBo: ZonedDateTime? = null,
    val editionCacem: ZonedDateTime? = null,
    val facade: String? = null,
    val geom: MultiPolygon? = null,
    val layerName: String? = null,
    val observation: String? = null,
    val additionalRefReg: List<AdditionalRefRegEntity>? = listOf(),
    val location: String?,
    val plan: String? = null,
    val polyName: String? = null,
    val prohibitionPeriods: String? = null,
    val refReg: String? = null,
    val resume: String? = null,
    val source: String? = null,
    val tags: List<TagInput>,
    val themes: List<ThemeInput>,
    val type: String? = null,
    val url: String? = null,
) {
    fun toRegulatoryAreaEntity(): RegulatoryAreaEntity =
        RegulatoryAreaEntity(
            id = this.id,
            areaType = AreaTypeEnum.ZONE,
            authorizationPeriods = this.authorizationPeriods,
            creation = this.creation,
            date = this.date,
            dateFin = this.dateFin,
            editeur = this.editeur,
            editionBo = this.editionBo,
            editionCacem = this.editionCacem,
            facade = this.facade,
            geom = this.geom,
            layerName = this.layerName,
            observation = this.observation,
            additionalRefReg = this.additionalRefReg,
            location = location,
            plan = this.plan,
            polyName = this.polyName,
            prohibitionPeriods = this.prohibitionPeriods,
            refReg = this.refReg,
            resume = this.resume,
            source = this.source,
            tags = this.tags.map { it.toTagEntity() },
            themes = this.themes.map { it.toThemeEntity() },
            type = this.type,
            url = this.url,
        )
}
