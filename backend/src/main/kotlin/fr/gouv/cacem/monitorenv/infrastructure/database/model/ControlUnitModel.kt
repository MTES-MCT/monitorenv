package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonManagedReference
import fr.gouv.cacem.monitorenv.domain.entities.controlResources.ControlUnitEntity
import jakarta.persistence.*

@Entity
@Table(name = "control_units")
data class ControlUnitModel(
    @Id
    @Column(name = "id")
    var id: Int,
    @Column(name = "name")
    var name: String,
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "administration_id")
    var administration: AdministrationModel,
    @Column(name = "archived")
    var isArchived: Boolean,
    @OneToMany(
        fetch = FetchType.EAGER,
        mappedBy = "controlUnit",
        cascade = [CascadeType.ALL],
        orphanRemoval = true
    )
    @JsonManagedReference
    var resources: MutableList<ControlResourceModel>? = ArrayList()
) {
    fun toControlUnit() = ControlUnitEntity(
        id = id,
        administration = administration.name,
        isArchived = isArchived,
        name = name,
        resources = resources?.map { it.toControlResource() } ?: listOf()
    )
}
