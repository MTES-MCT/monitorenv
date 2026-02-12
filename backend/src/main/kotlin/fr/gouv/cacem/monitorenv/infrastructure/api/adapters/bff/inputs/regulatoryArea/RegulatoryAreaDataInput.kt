package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.regulatoryArea

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.OtherRefRegEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaNewEntity
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
    val dureeValidite: String? = null,
    val editeur: String? = null,
    val editionBo: ZonedDateTime? = null,
    val editionCacem: ZonedDateTime? = null,
    val facade: String? = null,
    val geom: MultiPolygon? = null,
    val layerName: String? = null,
    val observation: String? = null,
    val othersRefReg: List<OtherRefRegEntity>? = listOf(),
    val plan: String? = null,
    val polyName: String? = null,
    val prohibitionPeriods: String? = null,
    val refReg: String? = null,
    val resume: String? = null,
    val source: String? = null,
    val tags: List<TagInput>,
    val temporalite: String? = null,
    val themes: List<ThemeInput>,
    val type: String? = null,
    val url: String? = null,
) {
    fun toRegulatoryAreaEntity(): RegulatoryAreaNewEntity =
        RegulatoryAreaNewEntity(
            id = this.id,
            authorizationPeriods = this.authorizationPeriods,
            creation = this.creation,
            date = this.date,
            dateFin = this.dateFin,
            dureeValidite = this.dureeValidite,
            editeur = this.editeur,
            editionBo = this.editionBo,
            editionCacem = this.editionCacem,
            facade = this.facade,
            geom = this.geom,
            layerName = this.layerName,
            observation = this.observation,
            othersRefReg = this.othersRefReg,
            plan = this.plan,
            polyName = this.polyName,
            prohibitionPeriods = this.prohibitionPeriods,
            refReg = this.refReg,
            resume = this.resume,
            source = this.source,
            tags = this.tags.map { it.toTagEntity() },
            temporalite = this.temporalite,
            themes = this.themes.map { it.toThemeEntity() },
            type = this.type,
            url = this.url,
        )
}
