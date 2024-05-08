package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitContactRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository

@UseCase
class CreateOrUpdateControlUnitContact(
    private val controlUnitRepository: IControlUnitRepository,
    private val controlUnitContactRepository: IControlUnitContactRepository,
) {
    fun execute(controlUnitContact: ControlUnitContactEntity): ControlUnitContactEntity {
        val validControlUnitContact = validateSubscriptions(controlUnitContact)

        val createdOrUpdatedControlUnitContact = controlUnitContactRepository.save(validControlUnitContact)

        // There can only be one contact per control unit with an email subscription
        if (controlUnitContact.id != null && controlUnitContact.isEmailSubscriptionContact) {
            unsubscribeOtherContactsFromEmail(controlUnitContact.controlUnitId, controlUnitContact.id)
        }

        return createdOrUpdatedControlUnitContact
    }

    private fun unsubscribeOtherContactsFromEmail(controlUnitId: Int, controlUnitContactId: Int) {
        val fullControlUnit = controlUnitRepository.findById(controlUnitId)
        val otherContactsWithEmailSubscription = fullControlUnit.controlUnitContacts
            // Filter and not find in the spirit of defensive programming
            .filter { it.id != controlUnitContactId && it.isEmailSubscriptionContact }

        otherContactsWithEmailSubscription.forEach {
            val updatedControlUnitContact = it.copy(isEmailSubscriptionContact = false)

            controlUnitContactRepository.save(updatedControlUnitContact)
        }
    }

    /**
     * If the contact is subscribed to emails/sms but has no email/phone, we unsubscribe them from emails/sms.
     */
    private fun validateSubscriptions(controlUnitContact: ControlUnitContactEntity): ControlUnitContactEntity {
        return controlUnitContact.copy(
            isEmailSubscriptionContact = if (controlUnitContact.isEmailSubscriptionContact && controlUnitContact.email == null) {
                false
            } else {
                controlUnitContact.isEmailSubscriptionContact
            },

            isSmsSubscriptionContact = if (controlUnitContact.isSmsSubscriptionContact && controlUnitContact.phone == null) {
                false
            } else {
                controlUnitContact.isSmsSubscriptionContact
            },
        )
    }
}
