package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitContactDTO
import jakarta.persistence.EntityManager
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

class JpaControlUnitContactRepositoryITests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaControlUnitContactRepository: JpaControlUnitContactRepository

    @Autowired
    private lateinit var jpaVigilanceAreaRepository: JpaVigilanceAreaRepository

    @Autowired
    private lateinit var entityManager: EntityManager

    @Test
    @Transactional
    fun `deleteById should delete a contact by id and delete all contact from vigilanceAreaSource`() {
        // Given
        val contactId = 1
        val vigilanceArea = jpaVigilanceAreaRepository.findById(1)
        assertThat(vigilanceArea?.sources?.any { it.controlUnitContacts?.isNotEmpty() == true }).isTrue

        // When
        jpaControlUnitContactRepository.deleteById(contactId)
        entityManager.flush()
        entityManager.clear()

        // Then
        val vigilanceAreaWithoutControlUnitContact = jpaVigilanceAreaRepository.findById(1)
        assertThat(
            vigilanceAreaWithoutControlUnitContact?.sources?.all { it.controlUnitContacts.isNullOrEmpty() },
        ).isTrue
    }

    @Test
    @Transactional
    fun `findAll() should find all contacts`() {
        val foundFullControlUnitContacts =
            jpaControlUnitContactRepository.findAll().sortedBy { requireNotNull(it.controlUnitContact.id) }

        assertThat(foundFullControlUnitContacts).hasSize(3)

        assertThat(foundFullControlUnitContacts[0]).isEqualTo(
            FullControlUnitContactDTO(
                controlUnit =
                    ControlUnitEntity(
                        id = 10000,
                        administrationId = 1005,
                        areaNote = null,
                        departmentAreaInseeCode = null,
                        isArchived = false,
                        name = "Cultures marines – DDTM 40",
                        termsNote = null,
                    ),
                controlUnitContact =
                    ControlUnitContactEntity(
                        id = 1,
                        controlUnitId = 10000,
                        email = "email_1",
                        isEmailSubscriptionContact = true,
                        isSmsSubscriptionContact = false,
                        name = "Contact 1",
                        phone = "0601xxxxxx",
                    ),
            ),
        )

        assertThat(foundFullControlUnitContacts[2]).isEqualTo(
            FullControlUnitContactDTO(
                controlUnit =
                    ControlUnitEntity(
                        id = 10003,
                        administrationId = 1005,
                        areaNote = null,
                        departmentAreaInseeCode = null,
                        isArchived = false,
                        name = "DPM – DDTM 14",
                        termsNote = null,
                    ),
                controlUnitContact =
                    ControlUnitContactEntity(
                        id = 3,
                        controlUnitId = 10003,
                        email = "email_3",
                        isEmailSubscriptionContact = false,
                        isSmsSubscriptionContact = true,
                        name = "Contact 3",
                        phone = null,
                    ),
            ),
        )
    }

    @Test
    @Transactional
    fun `findById() should find a contact by its ID`() {
        val foundFullControlUnitContact = jpaControlUnitContactRepository.findById(1)

        assertThat(foundFullControlUnitContact).isEqualTo(
            FullControlUnitContactDTO(
                controlUnit =
                    ControlUnitEntity(
                        id = 10000,
                        administrationId = 1005,
                        areaNote = null,
                        departmentAreaInseeCode = null,
                        isArchived = false,
                        name = "Cultures marines – DDTM 40",
                        termsNote = null,
                    ),
                controlUnitContact =
                    ControlUnitContactEntity(
                        id = 1,
                        controlUnitId = 10000,
                        email = "email_1",
                        isEmailSubscriptionContact = true,
                        isSmsSubscriptionContact = false,
                        name = "Contact 1",
                        phone = "0601xxxxxx",
                    ),
            ),
        )
    }

    @Test
    @Transactional
    fun `save() should create and update a contact, deleteById() should delete a contact`() {
        // ---------------------------------------------------------------------
        // Create

        val newControlUnitContact =
            ControlUnitContactEntity(
                controlUnitId = 10000,
                email = "Adresse email",
                isEmailSubscriptionContact = false,
                isSmsSubscriptionContact = true,
                name = "Contact Name",
                phone = "0123456789",
            )

        val createdControlUnitContact = jpaControlUnitContactRepository.save(newControlUnitContact)

        assertThat(createdControlUnitContact).isEqualTo(newControlUnitContact.copy(id = 4))

        // ---------------------------------------------------------------------
        // Update

        val nextControlUnitContact =
            ControlUnitContactEntity(
                id = 4,
                controlUnitId = 10001,
                email = null,
                isEmailSubscriptionContact = true,
                isSmsSubscriptionContact = true,
                name = "Updated Contact Name",
                phone = "9876543210",
            )

        val updatedControlUnitContact = jpaControlUnitContactRepository.save(nextControlUnitContact)

        assertThat(updatedControlUnitContact).isEqualTo(nextControlUnitContact)

        // ---------------------------------------------------------------------
        // Delete

        jpaControlUnitContactRepository.deleteById(4)

        val controlUnitContactIds =
            jpaControlUnitContactRepository.findAll().map { requireNotNull(it.controlUnitContact.id) }.sorted()

        assertThat(controlUnitContactIds).doesNotContain(4)
    }
}
