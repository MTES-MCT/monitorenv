package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import com.fasterxml.jackson.annotation.JsonManagedReference
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO
import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.Instant

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_area_insee_dep")
    @JsonBackReference
    var departmentArea: DepartmentAreaModel? = null,

    @Column(name = "archived", nullable = false)
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
         * @param controlUnitContactModels Return control unit contacts relations when provided.
         * @param controlUnitResourceModels Return control unit resources relations when provided.
         */
        fun fromControlUnit(
            controlUnit: ControlUnitEntity,
            administrationModel: AdministrationModel,
            departmentAreaModel: DepartmentAreaModel? = null,
            controlUnitContactModels: List<ControlUnitContactModel>? = null,
            controlUnitResourceModels: List<ControlUnitResourceModel>? = null
        ): ControlUnitModel {
            return ControlUnitModel(
                id = controlUnit.id,
                areaNote = controlUnit.areaNote,
                administration = administrationModel,
                controlUnitContacts = controlUnitContactModels,
                controlUnitResources = controlUnitResourceModels,
                departmentArea = departmentAreaModel,
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
            departmentAreaInseeCode = departmentArea?.inseeCode,
            isArchived,
            name,
            termsNote,
        )
    }

    fun toFullControlUnit(): FullControlUnitDTO {
        return FullControlUnitDTO(
            administration = administration.toAdministration(),
            departmentArea = departmentArea?.toDepartmentArea(),
            controlUnit = toControlUnit(),
            controlUnitContacts = requireNotNull(controlUnitContacts).map { it.toControlUnitContact() },
            controlUnitResources = requireNotNull(controlUnitResources).map { it.toFullControlUnitResource() },
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
