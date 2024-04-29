package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitContactRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.BDDMockito
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class CreateOrUpdateControlUnitContactUTests {
    @MockBean
    private lateinit var controlUnitRepository: IControlUnitRepository

    @MockBean
    private lateinit var controlUnitContactRepository: IControlUnitContactRepository

    @Test
    fun `execute should return the expected result`() {
        // Given
        val newControlUnitContact = ControlUnitContactEntity(
            controlUnitId = 2,
            email = "bob@example.org",
            isEmailSubscriptionContact = true,
            isSmsSubscriptionContact = true,
            name = "Contact Name",
            phone = "0033123456789",
        )

        val repositoryOutputMock = newControlUnitContact.copy(id = 1)
        given(controlUnitContactRepository.save(newControlUnitContact)).willReturn(repositoryOutputMock)

        // When
        val result = CreateOrUpdateControlUnitContact(controlUnitRepository, controlUnitContactRepository)
            .execute(newControlUnitContact)

        // Then
        assertThat(result).isEqualTo(repositoryOutputMock)

        BDDMockito.verifyNoInteractions(controlUnitRepository)
        BDDMockito.verify(controlUnitContactRepository).save(newControlUnitContact)
    }

    @Test
    fun `execute should unsubscribe the contact from emails or sms if they are subscribed to emails or sms but have no email or phone`() {
        // Given
        val updatedControlUnitContact = ControlUnitContactEntity(
            id = 1,
            controlUnitId = 2,
            email = null,
            isEmailSubscriptionContact = true,
            isSmsSubscriptionContact = true,
            name = "Contact Name",
            phone = null,
        )

        val firstRepositoryOutputMock = FullControlUnitDTO(
            administration = AdministrationEntity(
                id = 3,
                isArchived = false,
                name = "Administration Name",
            ),
            controlUnit = ControlUnitEntity(
                id = 2,
                administrationId = 3,
                areaNote = null,
                departmentAreaInseeCode = null,
                isArchived = false,
                name = "Unit Name",
                termsNote = null,
            ),
            controlUnitContacts = listOf(
                updatedControlUnitContact.copy(
                    email = "bob@example.org",
                    isEmailSubscriptionContact = false,
                    isSmsSubscriptionContact = false,
                    phone = "0033123456789",
                ),
            ),
            controlUnitResources = listOf(),
        )
        given(controlUnitRepository.findById(updatedControlUnitContact.controlUnitId))
            .willReturn(firstRepositoryOutputMock)

        val secondRepositoryInputExpectation = updatedControlUnitContact.copy(
            isEmailSubscriptionContact = false,
            isSmsSubscriptionContact = false,
        )
        val secondRepositoryOutputMock = secondRepositoryInputExpectation
        given(controlUnitContactRepository.save(secondRepositoryInputExpectation)).willReturn(
            secondRepositoryOutputMock,
        )

        // When
        val result = CreateOrUpdateControlUnitContact(controlUnitRepository, controlUnitContactRepository)
            .execute(updatedControlUnitContact)

        // Then
        assertThat(result).isEqualTo(secondRepositoryOutputMock)

        BDDMockito.verify(controlUnitContactRepository).save(secondRepositoryInputExpectation)
    }

    @Test
    fun `execute should unsubscribe other control unit contacts from emails if a new one is subscribing to emails`() {
        // Given
        val updatedControlUnitContact = ControlUnitContactEntity(
            id = 1,
            controlUnitId = 5,
            email = "bob@example.org",
            isEmailSubscriptionContact = true,
            isSmsSubscriptionContact = false,
            name = "Contact Name",
            phone = "0033123456789",
        )

        val firstRepositoryOutputMock = FullControlUnitDTO(
            administration = AdministrationEntity(
                id = 6,
                isArchived = false,
                name = "Administration Name",
            ),
            controlUnit = ControlUnitEntity(
                id = 5,
                administrationId = 6,
                areaNote = null,
                departmentAreaInseeCode = null,
                isArchived = false,
                name = "Unit Name",
                termsNote = null,
            ),
            controlUnitContacts = listOf(
                ControlUnitContactEntity(
                    id = updatedControlUnitContact.id,
                    controlUnitId = 5,
                    email = "contact1@example.org",
                    isEmailSubscriptionContact = false,
                    isSmsSubscriptionContact = false,
                    name = "Contact 1",
                    phone = null,
                ),
                ControlUnitContactEntity(
                    id = 2,
                    controlUnitId = 5,
                    email = "contact2@example.org",
                    isEmailSubscriptionContact = true,
                    isSmsSubscriptionContact = false,
                    name = "Contact 2",
                    phone = null,
                ),
                ControlUnitContactEntity(
                    id = 3,
                    controlUnitId = 5,
                    email = "contact3@example.org",
                    isEmailSubscriptionContact = true,
                    isSmsSubscriptionContact = false,
                    name = "Contact 3",
                    phone = null,
                ),
                ControlUnitContactEntity(
                    id = 4,
                    controlUnitId = 5,
                    email = "contact3@example.org",
                    isEmailSubscriptionContact = false,
                    isSmsSubscriptionContact = false,
                    name = "Contact 3",
                    phone = null,
                ),
            ),
            controlUnitResources = listOf(),
        )
        given(controlUnitRepository.findById(updatedControlUnitContact.controlUnitId))
            .willReturn(firstRepositoryOutputMock)

        val secondRepositoryExpectedInput = firstRepositoryOutputMock.controlUnitContacts[1].copy(
            isEmailSubscriptionContact = false,
        )
        val secondRepositoryOutputMock = secondRepositoryExpectedInput
        given(controlUnitContactRepository.save(secondRepositoryExpectedInput))
            .willReturn(secondRepositoryOutputMock)

        val thirdRepositoryExpectedInput = firstRepositoryOutputMock.controlUnitContacts[2].copy(
            isEmailSubscriptionContact = false,
        )
        val thirdRepositoryOutputMock = thirdRepositoryExpectedInput
        given(controlUnitContactRepository.save(thirdRepositoryExpectedInput))
            .willReturn(thirdRepositoryOutputMock)

        val fourthRepositoryOutputMock = updatedControlUnitContact
        given(controlUnitContactRepository.save(updatedControlUnitContact))
            .willReturn(fourthRepositoryOutputMock)

        // When
        val result = CreateOrUpdateControlUnitContact(controlUnitRepository, controlUnitContactRepository)
            .execute(updatedControlUnitContact)

        // Then
        assertThat(result).isEqualTo(fourthRepositoryOutputMock)

        BDDMockito.verify(controlUnitRepository).findById(updatedControlUnitContact.controlUnitId)
        BDDMockito.verify(controlUnitContactRepository).save(secondRepositoryExpectedInput)
        BDDMockito.verify(controlUnitContactRepository).save(thirdRepositoryExpectedInput)
        BDDMockito.verify(controlUnitContactRepository).save(updatedControlUnitContact)
    }
}
