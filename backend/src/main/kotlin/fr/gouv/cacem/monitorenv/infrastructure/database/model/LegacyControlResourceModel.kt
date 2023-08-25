package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlResourceEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table

@Entity
@Table(name = "legacy_control_resources")
data class LegacyControlResourceModel(
    @Id
    @Column(name = "id")
    val id: Int,

    @Column(name = "name")
    val name: String,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "unit_id")
    @JsonBackReference
    val controlUnit: LegacyControlUnitModel? = null,
) {
    companion object {
        fun fromControlEntity(
            legacyControlResourceEntity: LegacyControlResourceEntity,
            legacyControlUnitModel: LegacyControlUnitModel
        ) =
            LegacyControlResourceModel(
                id = legacyControlResourceEntity.id,
                name = legacyControlResourceEntity.name,
                controlUnit = legacyControlUnitModel,
            )
    }

    fun toControlResource() = LegacyControlResourceEntity(
        id = id,
        name = name,
    )
}
