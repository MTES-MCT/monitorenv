package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import com.fasterxml.jackson.annotation.JsonManagedReference
import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitEntity
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

    @Column(name = "area_note")
    var areaNote: String? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "control_unit_administration_id", nullable = false)
    @JsonBackReference
    var controlUnitAdministration: ControlUnitAdministrationModel,

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
            nextControlUnitEntity: NextControlUnitEntity,
            controlUnitAdministrationModel: ControlUnitAdministrationModel,
            controlUnitContactModels: List<ControlUnitContactModel>,
            controlUnitResourceModels: List<ControlUnitResourceModel>
        ): ControlUnitModel {
            return ControlUnitModel(
                id = nextControlUnitEntity.id,
                areaNote = nextControlUnitEntity.areaNote,
                controlUnitAdministration = controlUnitAdministrationModel,
                controlUnitContacts = controlUnitContactModels,
                controlUnitResources = controlUnitResourceModels,
                isArchived = nextControlUnitEntity.isArchived,
                name = nextControlUnitEntity.name,
                termsNote = nextControlUnitEntity.termsNote,
            )
        }
    }

    fun toNextControlUnitEntity(): NextControlUnitEntity {
        val controlUnitAdministrationId = requireNonNull(controlUnitAdministration.id)
        val controlUnitContactIds = requireIds(controlUnitContacts) { it.id }
        val controlUnitResourceIds = requireIds(controlUnitResources) { it.id }

        return NextControlUnitEntity(
            id = id,
            areaNote = areaNote,
            controlUnitAdministrationId,
            controlUnitContactIds,
            controlUnitResourceIds,
            isArchived = isArchived,
            name = name,
            termsNote = termsNote,
        )
    }
}
