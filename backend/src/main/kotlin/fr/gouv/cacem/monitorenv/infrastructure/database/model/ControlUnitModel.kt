package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import com.fasterxml.jackson.annotation.JsonManagedReference
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO
import fr.gouv.cacem.monitorenv.utils.requireIds
import jakarta.persistence.*
import java.time.Instant
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

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "controlUnit")
    @JsonManagedReference
    var controlUnitContacts: List<ControlUnitContactModel>? = mutableListOf(),

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "controlUnit")
    @JsonManagedReference
    var controlUnitResources: List<ControlUnitResourceModel>? = mutableListOf(),

    @Column(name = "archived")
    var isArchived: Boolean,

    @Column(name = "name", nullable = false)
    var name: String,

    @Column(name = "terms_note")
    var termsNote: String? = null,

    @Column(name = "created_at_utc", nullable = false, updatable = false)
    @CreationTimestamp
    var createdAtUtc: Instant? = null,

    @Column(name = "updated_at_utc", nullable = false)
    @UpdateTimestamp
    var updatedAtUtc: Instant? = null,
) {
    companion object {
        /**
         * @param controlUnitResourceModels Return control unit contacts relations when provided.
         * @param controlUnitResourceModels Return control unit resources relations when provided.
         */
        fun fromControlUnit(
            controlUnit: ControlUnitEntity,
            administrationModel: AdministrationModel,
            controlUnitContactModels: List<ControlUnitContactModel>? = null,
            controlUnitResourceModels: List<ControlUnitResourceModel>? = null
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

    fun toControlUnit(): ControlUnitEntity {
        return ControlUnitEntity(
            id,
            administrationId = requireNotNull(administration.id),
            areaNote,
            isArchived,
            name,
            termsNote,
        )
    }

    fun toFullControlUnit(): FullControlUnitDTO {
        return FullControlUnitDTO(
            id,
            administration = administration.toAdministration(),
            administrationId = requireNotNull(administration.id),
            areaNote,
            controlUnitContactIds = requireIds(controlUnitContacts) { it.id },
            controlUnitContacts = requireNotNull(controlUnitContacts).map { it.toControlUnitContact() },
            controlUnitResourceIds = requireIds(controlUnitResources) { it.id },
            controlUnitResources = requireNotNull(controlUnitResources).map { it.toFullControlUnitResource() },
            isArchived,
            name,
            termsNote,
        )
    }

    fun toLegacyControlUnit(): LegacyControlUnitEntity {
        return LegacyControlUnitEntity(
            id = requireNotNull(id),
            administration = administration.name,
            isArchived,
            name,
            resources = requireNotNull(controlUnitResources).map { it.toControlUnitResource() },
            contact = "",
        )
    }
}
