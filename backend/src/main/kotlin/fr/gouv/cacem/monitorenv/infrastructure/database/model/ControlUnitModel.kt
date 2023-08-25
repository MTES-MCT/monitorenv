package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import com.fasterxml.jackson.annotation.JsonManagedReference
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.NextControlUnitEntity
import fr.gouv.cacem.monitorenv.utils.requireNonNull
import fr.gouv.cacem.monitorenv.utils.requireIds
import jakarta.persistence.CascadeType
import jakarta.persistence.*
import java.time.LocalDateTime
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp

@Entity
@Table(name = "control_units")
data class ControlUnitModel(
    @Id
    @Column(name = "id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Int? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "administration_id", nullable = false)
    @JsonBackReference
    var administration: AdministrationModel,

    @Column(name = "area_note")
    var areaNote: String? = null,

    @OneToMany(cascade = [CascadeType.ALL], fetch = FetchType.LAZY, mappedBy = "controlUnit")
    @JsonManagedReference
    var controlUnitContacts: List<ControlUnitContactModel>,

    @OneToMany(cascade = [CascadeType.ALL], fetch = FetchType.LAZY, mappedBy = "controlUnit")
    @JsonManagedReference
    var controlUnitResources: List<ControlUnitResourceModel>,

    @Column(name = "is_archived")
    var isArchived: Boolean,

    @Column(name = "name", nullable = false)
    var name: String,

    @Column(name = "terms_note")
    var termsNote: String? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    var createdAt: LocalDateTime? = null,

    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    var updatedAt: LocalDateTime? = null,
) {
    companion object {
        fun fromNextControlUnitEntity(
            controlUnit: NextControlUnitEntity,
            administrationModel: AdministrationModel,
            controlUnitContactModels: List<ControlUnitContactModel>,
            controlUnitResourceModels: List<ControlUnitResourceModel>
        ): ControlUnitModel {
            return ControlUnitModel(
                id = controlUnit.id,
                areaNote = controlUnit.areaNote,
                administration = administrationModel,
                controlUnitContacts = controlUnitContactModels,
                controlUnitResources = controlUnitResourceModels,
                isArchived = controlUnit.isArchived,
                name = controlUnit.name,
                termsNote = controlUnit.termsNote,
            )
        }
    }

    fun toNextControlUnitEntity(): NextControlUnitEntity {
        val administrationId = requireNonNull(administration.id)
        val controlUnitContactIds = requireIds(controlUnitContacts) { it.id }
        val controlUnitResourceIds = requireIds(controlUnitResources) { it.id }

        return NextControlUnitEntity(
            id = id,
            administrationId,
            areaNote = areaNote,
            controlUnitContactIds,
            controlUnitResourceIds,
            isArchived = isArchived,
            name = name,
            termsNote = termsNote,
        )
    }
}
