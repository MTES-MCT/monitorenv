package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitContactRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.ValueSource
import org.mockito.BDDMockito
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
@ExtendWith(OutputCaptureExtension::class)
class CreateOrUpdateControlUnitContactUTests {
    @Mock
    private val controlUnitRepository: IControlUnitRepository = mock()

    @Mock
    private val controlUnitContactRepository: IControlUnitContactRepository = mock()

    @Test
    fun `execute should return the expected result`(log: CapturedOutput) {
        // Given
        val newControlUnitContact =
            ControlUnitContactEntity(
                controlUnitId = 2,
                email = "bob@example.org",
                isEmailSubscriptionContact = true,
                isSmsSubscriptionContact = true,
                name = "Contact Name",
                phone = "0033123456789",
            )

        val controlUnitDTO =
            FullControlUnitDTO(
                administration =
                    AdministrationEntity(
                        id = 6,
                        isArchived = false,
                        name = "Administration Name",
                    ),
                controlUnit =
                    ControlUnitEntity(
                        id = 2,
                        administrationId = 6,
                        areaNote = null,
                        departmentAreaInseeCode = null,
                        isArchived = false,
                        name = "Unit Name",
                        termsNote = null,
                    ),
                controlUnitContacts = listOf(),
                controlUnitResources = listOf(),
            )

        val repositoryOutputMock = newControlUnitContact.copy(id = 1)
        given(controlUnitContactRepository.save(newControlUnitContact))
            .willReturn(repositoryOutputMock)
        given(controlUnitRepository.findById(repositoryOutputMock.controlUnitId))
            .willReturn(controlUnitDTO)
        // When
        val result =
            CreateOrUpdateControlUnitContact(
                controlUnitRepository,
                controlUnitContactRepository,
            )
                .execute(newControlUnitContact)

        // Then
        assertThat(result).isEqualTo(repositoryOutputMock)

        BDDMockito.verify(controlUnitRepository).findById(repositoryOutputMock.controlUnitId)
        BDDMockito.verify(controlUnitContactRepository).save(newControlUnitContact)
        assertThat(log.out).contains("Attempt to CREATE or UPDATE control unit contact ${newControlUnitContact.id}")
        assertThat(log.out).contains("Control unit contact ${result.id} created or updated")
    }

    @Test
    fun `execute should unsubscribe the contact from emails or sms if they are subscribed to emails or sms but have no email or phone`() {
        // Given
        val updatedControlUnitContact =
            ControlUnitContactEntity(
                id = 1,
                controlUnitId = 2,
                email = null,
                isEmailSubscriptionContact = true,
                isSmsSubscriptionContact = true,
                name = "Contact Name",
                phone = null,
            )

        val firstRepositoryOutputMock =
            FullControlUnitDTO(
                administration =
                    AdministrationEntity(
                        id = 3,
                        isArchived = false,
                        name = "Administration Name",
                    ),
                controlUnit =
                    ControlUnitEntity(
                        id = 2,
                        administrationId = 3,
                        areaNote = null,
                        departmentAreaInseeCode = null,
                        isArchived = false,
                        name = "Unit Name",
                        termsNote = null,
                    ),
                controlUnitContacts =
                    listOf(
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

        val secondRepositoryInputExpectation =
            updatedControlUnitContact.copy(
                isEmailSubscriptionContact = false,
                isSmsSubscriptionContact = false,
            )
        given(controlUnitContactRepository.save(secondRepositoryInputExpectation))
            .willReturn(
                secondRepositoryInputExpectation,
            )

        // When
        val result =
            CreateOrUpdateControlUnitContact(
                controlUnitRepository,
                controlUnitContactRepository,
            )
                .execute(updatedControlUnitContact)

        // Then
        assertThat(result).isEqualTo(secondRepositoryInputExpectation)

        BDDMockito.verify(controlUnitContactRepository).save(secondRepositoryInputExpectation)
    }

    @Test
    fun `execute should unsubscribe other control unit contacts from emails if contact is subscribing to emails`() {
        // Given
        val updatedControlUnitContact =
            ControlUnitContactEntity(
                id = 1,
                controlUnitId = 5,
                email = "bob@example.org",
                isEmailSubscriptionContact = true,
                isSmsSubscriptionContact = false,
                name = "Contact Name",
                phone = "0033123456789",
            )

        val firstRepositoryOutputMock =
            FullControlUnitDTO(
                administration =
                    AdministrationEntity(
                        id = 6,
                        isArchived = false,
                        name = "Administration Name",
                    ),
                controlUnit =
                    ControlUnitEntity(
                        id = 5,
                        administrationId = 6,
                        areaNote = null,
                        departmentAreaInseeCode = null,
                        isArchived = false,
                        name = "Unit Name",
                        termsNote = null,
                    ),
                controlUnitContacts =
                    listOf(
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

        val secondRepositoryExpectedInput =
            firstRepositoryOutputMock.controlUnitContacts[1].copy(
                isEmailSubscriptionContact = false,
            )
        given(controlUnitContactRepository.save(secondRepositoryExpectedInput))
            .willReturn(secondRepositoryExpectedInput)

        val thirdRepositoryExpectedInput =
            firstRepositoryOutputMock.controlUnitContacts[2].copy(
                isEmailSubscriptionContact = false,
            )
        given(controlUnitContactRepository.save(thirdRepositoryExpectedInput))
            .willReturn(thirdRepositoryExpectedInput)

        given(controlUnitContactRepository.save(updatedControlUnitContact))
            .willReturn(updatedControlUnitContact)

        // When
        val result =
            CreateOrUpdateControlUnitContact(
                controlUnitRepository,
                controlUnitContactRepository,
            )
                .execute(updatedControlUnitContact)

        // Then
        assertThat(result).isEqualTo(updatedControlUnitContact)

        BDDMockito.verify(controlUnitRepository).findById(updatedControlUnitContact.controlUnitId)
        BDDMockito.verify(controlUnitContactRepository).save(secondRepositoryExpectedInput)
        BDDMockito.verify(controlUnitContactRepository).save(thirdRepositoryExpectedInput)
        BDDMockito.verify(controlUnitContactRepository).save(updatedControlUnitContact)
    }

    @Test
    fun `execute should unsubscribe other control unit contacts from emails if a new contact subscribes to emails`() {
        // Given
        val newControlUnitContact =
            ControlUnitContactEntity(
                id = null,
                controlUnitId = 5,
                email = "bob@example.org",
                isEmailSubscriptionContact = true,
                isSmsSubscriptionContact = false,
                name = "Contact Name",
                phone = "0033123456789",
            )

        val controlUnit =
            FullControlUnitDTO(
                administration =
                    AdministrationEntity(
                        id = 6,
                        isArchived = false,
                        name = "Administration Name",
                    ),
                controlUnit =
                    ControlUnitEntity(
                        id = 5,
                        administrationId = 6,
                        areaNote = null,
                        departmentAreaInseeCode = null,
                        isArchived = false,
                        name = "Unit Name",
                        termsNote = null,
                    ),
                controlUnitContacts =
                    listOf(
                        ControlUnitContactEntity(
                            id = 1,
                            controlUnitId = 5,
                            email = "contact1@example.org",
                            isEmailSubscriptionContact = true,
                            isSmsSubscriptionContact = true,
                            name = "Contact 1",
                            phone = null,
                        ),
                    ),
                controlUnitResources = listOf(),
            )
        given(controlUnitRepository.findById(newControlUnitContact.controlUnitId))
            .willReturn(controlUnit)

        given(controlUnitContactRepository.save(newControlUnitContact))
            .willReturn(newControlUnitContact.copy(id = 2))

        // When
        val result =
            CreateOrUpdateControlUnitContact(
                controlUnitRepository,
                controlUnitContactRepository,
            )
                .execute(newControlUnitContact)

        val updatedControlUnitContact =
            controlUnit.controlUnitContacts[0].copy(
                isEmailSubscriptionContact = false,
            )
        given(controlUnitContactRepository.save(updatedControlUnitContact))
            .willReturn(updatedControlUnitContact)
        // Then
        assertThat(result).isEqualTo(newControlUnitContact.copy(id = 2))
        BDDMockito.verify(controlUnitRepository).findById(newControlUnitContact.controlUnitId)
        BDDMockito.verify(controlUnitContactRepository).save(updatedControlUnitContact)
    }

    @ParameterizedTest
    @ValueSource(strings = ["invalide phone number", "111 222 333 444 555"])
    fun `execute should throw BackendUsageException when phone is invalid`(phone: String) {
        // Given
        val newControlUnitContact =
            ControlUnitContactEntity(
                controlUnitId = 2,
                email = "bob@example.org",
                isEmailSubscriptionContact = true,
                isSmsSubscriptionContact = true,
                name = "Contact Name",
                phone = phone,
            )
        // When & Then
        val backendUsageException =
            assertThrows<BackendUsageException> {
                CreateOrUpdateControlUnitContact(
                    controlUnitRepository,
                    controlUnitContactRepository,
                )
                    .execute(newControlUnitContact)
            }
        assertThat(backendUsageException.code).isEqualTo(BackendUsageErrorCode.UNVALID_PROPERTY)
        assertThat(backendUsageException.message).isEqualTo("Invalid phone number")
        assertThat(backendUsageException.data).isEqualTo(newControlUnitContact.phone)
    }

    @Test
    fun `execute should not throw BackendUsageException when phone is empty`() {
        // Given
        val newControlUnitContact =
            ControlUnitContactEntity(
                controlUnitId = 2,
                email = "bob@example.org",
                isEmailSubscriptionContact = true,
                isSmsSubscriptionContact = true,
                name = "Contact Name",
                phone = "",
            )

        val controlUnitDTO =
            FullControlUnitDTO(
                administration =
                    AdministrationEntity(
                        id = 6,
                        isArchived = false,
                        name = "Administration Name",
                    ),
                controlUnit =
                    ControlUnitEntity(
                        id = 2,
                        administrationId = 6,
                        areaNote = null,
                        departmentAreaInseeCode = null,
                        isArchived = false,
                        name = "Unit Name",
                        termsNote = null,
                    ),
                controlUnitContacts = listOf(),
                controlUnitResources = listOf(),
            )
        given(controlUnitRepository.findById(newControlUnitContact.controlUnitId))
            .willReturn(controlUnitDTO)

        val repositoryOutputMock = newControlUnitContact.copy(id = 1)
        given(controlUnitContactRepository.save(newControlUnitContact))
            .willReturn(repositoryOutputMock)

        // When & Then
        assertDoesNotThrow {
            CreateOrUpdateControlUnitContact(controlUnitRepository, controlUnitContactRepository)
                .execute(newControlUnitContact)
        }
    }
}
