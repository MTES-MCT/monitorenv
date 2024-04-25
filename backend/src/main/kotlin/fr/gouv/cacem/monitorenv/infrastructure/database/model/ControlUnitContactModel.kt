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
    val id: Int? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "control_unit_id", nullable = false)
    @JsonBackReference
    val controlUnit: ControlUnitModel,

    @Column(name = "email")
    val email: String? = null,

    @Column(name = "name")
    val name: String,

    @Column(name = "phone")
    val phone: String? = null,

    @Column(name = "created_at_utc", nullable = false, updatable = false)
    @CreationTimestamp
    val createdAtUtc: Instant? = null,

    @Column(name = "updated_at_utc", nullable = false)
    @UpdateTimestamp
    val updatedAtUtc: Instant? = null,

    @Column(name = "is_email_distribution_contact", nullable = false)
    val isEmailDistributionContact: Boolean? = false,

    @Column(name = "is_sms_distribution_contact", nullable = false)
    val isSmsDistributionContact: Boolean? = false,

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
                isEmailDistributionContact = controlUnitContact.isEmailDistributionContact,
                isSmsDistributionContact = controlUnitContact.isSmsDistributionContact,
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
            isEmailDistributionContact,
            isSmsDistributionContact,
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
        return this::class.simpleName + "(id = $id , controlUnitId = ${controlUnit.id} , email = $email , name = $name , phone = $phone, isEmailDistributionContact = $isEmailDistributionContact, isSmsDistributionContact = $isSmsDistributionContact)"
    }
}
