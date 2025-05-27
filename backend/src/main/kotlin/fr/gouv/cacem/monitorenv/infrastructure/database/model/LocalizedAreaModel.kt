package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.localizedArea.LocalizedAreaEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.locationtech.jts.geom.MultiPolygon

@Entity
@Table(name = "localized_areas")
class LocalizedAreaModel(
    @Id @Column(name = "id") val id: Int,
    @Column(name = "amp_ids") val ampIds: List<Int> = emptyList(),
    @Column(name = "control_unit_ids") val controlUnitIds: List<Int> = emptyList(),
    @Column(name = "geom") val geom: MultiPolygon,
    @Column(name = "group_name") val groupName: String,
    @Column(name = "name") val name: String,
) {
    fun toLocalizedArea() =
        LocalizedAreaEntity(
            id = id,
            ampIds = ampIds,
            controlUnitIds = controlUnitIds,
            geom = geom,
            groupName = groupName,
            name = name,
        )
}
