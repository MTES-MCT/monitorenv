package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import fr.gouv.cacem.monitorenv.domain.entities.controlResource.ControlResourceEntity
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
            controlResourceEntity: ControlResourceEntity,
            legacyControlUnitModel: LegacyControlUnitModel
        ) =
            LegacyControlResourceModel(
                id = controlResourceEntity.id,
                name = controlResourceEntity.name,
                controlUnit = legacyControlUnitModel,
            )
    }

    fun toControlResource() = ControlResourceEntity(
        id = id,
        name = name,
    )
}
