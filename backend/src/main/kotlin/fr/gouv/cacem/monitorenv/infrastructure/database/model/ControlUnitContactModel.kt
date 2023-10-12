package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitContactDTO
import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.Instant

@Entity
@Table(name = "control_unit_contacts")
data class ControlUnitContactModel(
    @Id
    @Column(name = "id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Int? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "control_unit_id", nullable = false)
    @JsonBackReference
    var controlUnit: ControlUnitModel,

    @Column(name = "email")
    var email: String? = null,

    @Column(name = "name")
    var name: String,

    @Column(name = "phone")
    var phone: String? = null,

    @Column(name = "created_at_utc", nullable = false, updatable = false)
    @CreationTimestamp
    var createdAtUtc: Instant? = null,

    @Column(name = "updated_at_utc", nullable = false)
    @UpdateTimestamp
    var updatedAtUtc: Instant? = null,
) {
    companion object {
        fun fromControlUnitContact(
            controlUnitContact: ControlUnitContactEntity,
            controlUnitModel: ControlUnitModel,
        ): ControlUnitContactModel {
            return ControlUnitContactModel(
                id = controlUnitContact.id,
                controlUnit = controlUnitModel,
                email = controlUnitContact.email,
                name = controlUnitContact.name,
                phone = controlUnitContact.phone,
            )
        }
    }

    fun toControlUnitContact(): ControlUnitContactEntity {
        return ControlUnitContactEntity(
            id,
            controlUnitId = requireNotNull(controlUnit.id),
            email,
            name,
            phone,
        )
    }

    fun toFullControlUnitContact(): FullControlUnitContactDTO {
        return FullControlUnitContactDTO(
            controlUnit = controlUnit.toControlUnit(),
            controlUnitContact = toControlUnitContact(),
        )
    }
}
