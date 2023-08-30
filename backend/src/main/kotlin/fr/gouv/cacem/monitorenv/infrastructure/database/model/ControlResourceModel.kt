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
@Table(name = "control_resources")
data class ControlResourceModel(
    @Id
    @Column(name = "id")
    val id: Int,
    @Column(name = "name")
    val name: String,
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "unit_id")
    @JsonBackReference
    val controlUnit: ControlUnitModel? = null,
) {
    companion object {
        fun fromControlEntity(controlResourceEntity: ControlResourceEntity, controlUnitModel: ControlUnitModel) = ControlResourceModel(
            id = controlResourceEntity.id,
            name = controlResourceEntity.name,
            controlUnit = controlUnitModel,
        )
    }

    fun toControlResource() = ControlResourceEntity(
        id = id,
        name = name,
    )
}
