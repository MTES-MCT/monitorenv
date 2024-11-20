package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitContactDTO
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.Instant

@Entity
@Table(name = "control_unit_contacts")
data class ControlUnitContactModel(
    @Id
    @Column(name = "id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int? = null,
    @ManyToOne
    @JoinColumn(name = "control_unit_id", nullable = false)
    @JsonBackReference
    val controlUnit: ControlUnitModel,
    @Column(name = "email")
    val email: String?,
    @Column(name = "is_email_subscription_contact")
    val isEmailSubscriptionContact: Boolean,
    @Column(name = "is_sms_subscription_contact")
    val isSmsSubscriptionContact: Boolean,
    @Column(name = "name")
    val name: String,
    @Column(name = "phone")
    val phone: String?,
    @Column(name = "created_at_utc", nullable = false, updatable = false)
    @CreationTimestamp
    val createdAtUtc: Instant? = null,
    @Column(name = "updated_at_utc", nullable = false)
    @UpdateTimestamp
    val updatedAtUtc: Instant? = null,
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
                isEmailSubscriptionContact = controlUnitContact.isEmailSubscriptionContact,
                isSmsSubscriptionContact = controlUnitContact.isSmsSubscriptionContact,
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
            isEmailSubscriptionContact,
            isSmsSubscriptionContact,
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

    @Override
    override fun toString(): String {
        return this::class.simpleName + "(id = $id , controlUnitId = ${controlUnit.id} , email = $email , name = $name , phone = $phone, isEmailSubscriptionContact = $isEmailSubscriptionContact, isSmsSubscriptionContact = $isSmsSubscriptionContact)"
    }
}
