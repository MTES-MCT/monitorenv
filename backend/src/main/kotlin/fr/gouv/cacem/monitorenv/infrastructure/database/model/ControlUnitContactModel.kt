package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.utils.requireNonNull
import jakarta.persistence.*
import java.time.LocalDateTime
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp

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

    @Column(name = "note")
    var note: String? = null,

    @Column(name = "phone")
    var phone: String? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    var createdAt: LocalDateTime? = null,

    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    var updatedAt: LocalDateTime? = null,
) {
    companion object {
        fun fromNextControlUnitContactEntity(
            controlUnitContact: ControlUnitContactEntity,
            controlUnitModel: ControlUnitModel
        ): ControlUnitContactModel {
            return ControlUnitContactModel(
                id = controlUnitContact.id,
                controlUnit = controlUnitModel,
                email = controlUnitContact.email,
                name = controlUnitContact.name,
                note = controlUnitContact.note,
                phone = controlUnitContact.phone,
            )
        }
    }

    fun toNextControlUnitContactEntity(): ControlUnitContactEntity {
        val controlUnitId = requireNonNull(controlUnit.id)

        return ControlUnitContactEntity(
            id = id,
            controlUnitId,
            email = email,
            name = name,
            note = note,
            phone = phone,
        )
    }
}
