package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitContactDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

class JpaControlUnitContactRepositoryITests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaControlUnitContactRepository: JpaControlUnitContactRepository

    @Test
    @Transactional
    fun `findAll() should find all contacts`() {
        val foundFullControlUnitContacts =
            jpaControlUnitContactRepository.findAll().sortedBy { requireNotNull(it.controlUnitContact.id) }

        assertThat(foundFullControlUnitContacts).hasSize(3)

        assertThat(foundFullControlUnitContacts[0]).isEqualTo(
            FullControlUnitContactDTO(
                controlUnit = ControlUnitEntity(
                    id = 10000,
                    administrationId = 1005,
                    areaNote = null,
                    departmentAreaInseeCode = null,
                    isArchived = false,
                    name = "Cultures marines – DDTM 40",
                    termsNote = null
                ),
                controlUnitContact = ControlUnitContactEntity(
                    id = 1,
                    controlUnitId = 10000,
                    name = "Contact 1",
                    phone = null,
                ),
            )
        )

        assertThat(foundFullControlUnitContacts[2]).isEqualTo(
            FullControlUnitContactDTO(
                controlUnit = ControlUnitEntity(
                    id = 10003,
                    administrationId = 1005,
                    areaNote = null,
                    departmentAreaInseeCode = null,
                    isArchived = false,
                    name = "DPM – DDTM 14",
                    termsNote = null
                ),
                controlUnitContact = ControlUnitContactEntity(
                    id = 3,
                    controlUnitId = 10003,
                    name = "Contact 3",
                    phone = null,
                ),
            )
        )
    }

    @Test
    @Transactional
    fun `findById() should find a contact by its ID`() {
        val foundFullControlUnitContact = jpaControlUnitContactRepository.findById(1)

        assertThat(foundFullControlUnitContact).isEqualTo(
            FullControlUnitContactDTO(
                controlUnit = ControlUnitEntity(
                    id = 10000,
                    administrationId = 1005,
                    areaNote = null,
                    departmentAreaInseeCode = null,
                    isArchived = false,
                    name = "Cultures marines – DDTM 40",
                    termsNote = null
                ),
                controlUnitContact = ControlUnitContactEntity(
                    id = 1,
                    controlUnitId = 10000,
                    name = "Contact 1",
                    phone = null,
                ),
            )
        )
    }

    @Test
    @Transactional
    fun `save() should create and update a contact, deleteById() should delete a contact`() {
        // ---------------------------------------------------------------------
        // Create

        val newControlUnitContact = ControlUnitContactEntity(
            controlUnitId = 10000,
            name = "Contact Name",
            phone = "0123456789",
        )

        val createdControlUnitContact = jpaControlUnitContactRepository.save(newControlUnitContact)

        assertThat(createdControlUnitContact).isEqualTo(newControlUnitContact.copy(id = 4))

        // ---------------------------------------------------------------------
        // Update

        val nextControlUnitContact = ControlUnitContactEntity(
            id = 4,
            controlUnitId = 10001,
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
