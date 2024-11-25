package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import com.fasterxml.jackson.annotation.JsonManagedReference
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO
import jakarta.persistence.*
import jakarta.persistence.Table
import org.hibernate.annotations.*
import org.hibernate.annotations.Cache
import java.time.Instant

@Entity
@Cache(
    usage = CacheConcurrencyStrategy.READ_WRITE,
)
@Table(name = "control_units")
data class ControlUnitModel(
    @Id
    @Column(name = "id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int? = null,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "administration_id", nullable = false)
    @JsonBackReference
    val administration: AdministrationModel,
    @Column(name = "area_note")
    val areaNote: String? = null,
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "controlUnit")
    @JsonManagedReference
    @Fetch(FetchMode.SUBSELECT)
    val controlUnitContacts: MutableSet<ControlUnitContactModel>? = LinkedHashSet(),
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "controlUnit")
    @JsonManagedReference
    @Fetch(FetchMode.SUBSELECT)
    val controlUnitResources: MutableSet<ControlUnitResourceModel>? = LinkedHashSet(),
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
            controlUnitContactModels: MutableSet<ControlUnitContactModel>? = null,
            controlUnitResourceModels: MutableSet<ControlUnitResourceModel>? = null,
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
            resources = requireNotNull(controlUnitResources).map { it.toLegacyControlUnitResource() },
            contact = "",
        )
    }

    @Override
    override fun toString(): String {
        return this::class.simpleName + "(id = $id , administrationId = ${administration.id} , areaNote = $areaNote , departmentAreaInseeCode = ${departmentArea?.inseeCode} , isArchived = $isArchived, name = $name , termsNote = $termsNote)"
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as ControlUnitModel

        if (id != other.id) return false
        if (administration != other.administration) return false
        if (areaNote != other.areaNote) return false
        if (controlUnitContacts != other.controlUnitContacts) return false
        if (controlUnitResources != other.controlUnitResources) return false
        if (departmentArea != other.departmentArea) return false
        if (isArchived != other.isArchived) return false
        if (name != other.name) return false
        if (termsNote != other.termsNote) return false
        if (createdAtUtc != other.createdAtUtc) return false
        if (updatedAtUtc != other.updatedAtUtc) return false

        return true
    }

    override fun hashCode(): Int = javaClass.hashCode()
}
