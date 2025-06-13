package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitContactRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import org.slf4j.LoggerFactory

@UseCase
class CreateOrUpdateControlUnitContact(
    private val controlUnitRepository: IControlUnitRepository,
    private val controlUnitContactRepository: IControlUnitContactRepository,
) {
    private val logger = LoggerFactory.getLogger(CreateOrUpdateControlUnitContact::class.java)

    fun execute(controlUnitContact: ControlUnitContactEntity): ControlUnitContactEntity {
        logger.info("Attempt to CREATE or UPDATE control unit contact ${controlUnitContact.id}")
        val validControlUnitContact = validateSubscriptions(controlUnitContact)
        validatePhone(validControlUnitContact)

        val createdOrUpdatedControlUnitContact =
            controlUnitContactRepository.save(validControlUnitContact)

        // There can only be one contact per control unit with an email subscription
        if (createdOrUpdatedControlUnitContact.id !== null &&
            createdOrUpdatedControlUnitContact.isEmailSubscriptionContact
        ) {
            unsubscribeOtherContactsFromEmail(
                createdOrUpdatedControlUnitContact.controlUnitId,
                createdOrUpdatedControlUnitContact.id,
            )
        }
        logger.info("Control unit contact ${createdOrUpdatedControlUnitContact.id} created or updated")

        return createdOrUpdatedControlUnitContact
    }

    private fun unsubscribeOtherContactsFromEmail(
        controlUnitId: Int,
        controlUnitContactId: Int,
    ) {
        val fullControlUnit = controlUnitRepository.findFullControlUnitById(controlUnitId)
        val otherContactsWithEmailSubscription =
            fullControlUnit.controlUnitContacts
                // Filter and not find in the spirit of defensive programming
                .filter { it.id != controlUnitContactId && it.isEmailSubscriptionContact }

        otherContactsWithEmailSubscription.forEach {
            val updatedControlUnitContact = it.copy(isEmailSubscriptionContact = false)
            controlUnitContactRepository.save(updatedControlUnitContact)
        }
    }

    /**
     * If the contact is subscribed to emails/sms but has no email/phone, we unsubscribe them from
     * emails/sms.
     */
    private fun validateSubscriptions(controlUnitContact: ControlUnitContactEntity): ControlUnitContactEntity =
        controlUnitContact.copy(
            isEmailSubscriptionContact =
                if (controlUnitContact.isEmailSubscriptionContact &&
                    controlUnitContact.email == null
                ) {
                    false
                } else {
                    controlUnitContact.isEmailSubscriptionContact
                },
            isSmsSubscriptionContact =
                if (controlUnitContact.isSmsSubscriptionContact &&
                    controlUnitContact.phone == null
                ) {
                    false
                } else {
                    controlUnitContact.isSmsSubscriptionContact
                },
        )

    private fun validatePhone(controlUnitContact: ControlUnitContactEntity) {
        val frenchPhoneRegex = Regex("^0[1-9]\\d{8}$")
        val internationalPhoneRegex = Regex("^00\\d{6,15}$")
        controlUnitContact.phone?.let {
            if (it.isNotBlank() &&
                !(frenchPhoneRegex.matches(it) || internationalPhoneRegex.matches(it))
            ) {
                val errorMessage = "Invalid phone number"
                logger.error(errorMessage)
                throw BackendUsageException(
                    BackendUsageErrorCode.UNVALID_PROPERTY,
                    errorMessage,
                    it,
                )
            }
        }
    }
}
