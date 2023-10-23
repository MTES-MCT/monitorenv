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
    val id: Int? = null,

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "administration_id", nullable = false)
    @JsonBackReference
    val administration: AdministrationModel,

    @Column(name = "area_note")
    val areaNote: String? = null,

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "controlUnit")
    @JsonManagedReference
    val controlUnitContacts: List<ControlUnitContactModel>? = mutableListOf(),

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "controlUnit")
    @JsonManagedReference
    val controlUnitResources: List<ControlUnitResourceModel>? = mutableListOf(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_area_insee_dep")
    @JsonBackReference
    val departmentArea: DepartmentAreaModel? = null,

    @Column(name = "archived", nullable = false)
    val isArchived: Boolean,

    @Column(name = "name", nullable = false)
    val name: String,

    @Column(name = "terms_note")
    val termsNote: String? = null,

    @Column(name = "created_at_utc", nullable = false, updatable = false)
    @CreationTimestamp
    val createdAtUtc: Instant? = null,

    @Column(name = "updated_at_utc", nullable = false)
    @UpdateTimestamp
    val updatedAtUtc: Instant? = null,
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
            controlUnitResourceModels: List<ControlUnitResourceModel>? = null,
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

        /**
         * @param controlUnitContactModels Return control unit contacts relations when provided.
         * @param controlUnitResourceModels Return control unit resources relations when provided.
         */
        fun fromFullControlUnit(
            fullControlUnit: FullControlUnitDTO,
            controlUnitContactModels: List<ControlUnitContactModel>? = null,
            controlUnitResourceModels: List<ControlUnitResourceModel>? = null,
        ): ControlUnitModel {
            return ControlUnitModel(
                id = fullControlUnit.controlUnit.id,
                areaNote = fullControlUnit.controlUnit.areaNote,
                administration = AdministrationModel.fromAdministration(fullControlUnit.administration),
                controlUnitContacts = controlUnitContactModels,
                controlUnitResources = controlUnitResourceModels,
                departmentArea = fullControlUnit.departmentArea?.let { DepartmentAreaModel.fromDepartmentArea(it) },
                isArchived = fullControlUnit.controlUnit.isArchived,
                name = fullControlUnit.controlUnit.name,
                termsNote = fullControlUnit.controlUnit.termsNote,
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
            resources = requireNotNull(controlUnitResources).map { it.toLegacyControlUnitResource() },
            contact = "",
        )
    }
}
