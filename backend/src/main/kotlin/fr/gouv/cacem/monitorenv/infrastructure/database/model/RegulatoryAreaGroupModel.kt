package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import jakarta.persistence.Embeddable
import jakarta.persistence.EmbeddedId
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.MapsId
import jakarta.persistence.Table
import tools.jackson.databind.json.JsonMapper
import java.io.Serializable

@Entity
@Table(name = "regulatory_areas_group")
class RegulatoryAreaGroupModel(
    @EmbeddedId
    var id: RegulatoryAreaGroupPk,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "regulatory_area_id")
    @MapsId("regulatoryAreaId")
    val regulatoryArea: RegulatoryAreaModel,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    @MapsId("groupId")
    val group: RegulatoryAreaModel,
) {
    fun toRegulatoryAreas(mapper: JsonMapper): List<RegulatoryAreaEntity> =
        listOf(group.toRegulatoryArea(mapper = mapper), regulatoryArea.toRegulatoryArea(mapper = mapper))
}

@Embeddable
class RegulatoryAreaGroupPk(
    val regulatoryAreaId: Int?,
    val groupId: Int?,
) : Serializable
