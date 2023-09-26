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
    fun `deleteById() should delete a contact by its ID`() {
        val beforeControlUnitContactIds = jpaControlUnitContactRepository.findAll().map { it.id }

        assertThat(beforeControlUnitContactIds).hasSize(3)
        assertThat(beforeControlUnitContactIds).contains(1)

        jpaControlUnitContactRepository.deleteById(1)

        val afterControlUnitContactIds = jpaControlUnitContactRepository.findAll().map { it.id }

        assertThat(afterControlUnitContactIds).hasSize(2)
        assertThat(afterControlUnitContactIds).doesNotContain(1)
    }

    @Test
    @Transactional
    fun `findAll() should find all contacts`() {
        val foundFullControlUnitContacts = jpaControlUnitContactRepository.findAll().sortedBy { requireNotNull(it.id) }

        assertThat(foundFullControlUnitContacts).hasSize(3)

        assertThat(foundFullControlUnitContacts[0]).isEqualTo(
            FullControlUnitContactDTO(
                id = 1,
                controlUnit = ControlUnitEntity(
                    id = 1,
                    administrationId = 1005,
                    areaNote = null,
                    isArchived = false,
                    name = "Cultures marines – DDTM 40",
                    termsNote = null
                ),
                controlUnitId = 1,
                name = "Contact 1",
                note = null,
                phone = null,
            )
        )

        assertThat(foundFullControlUnitContacts[2]).isEqualTo(
            FullControlUnitContactDTO(
                id = 3,
                controlUnit = ControlUnitEntity(
                    id = 4,
                    administrationId = 1005,
                    areaNote = null,
                    isArchived = false,
                    name = "DPM – DDTM 14",
                    termsNote = null
                ),
                controlUnitId = 4,
                name = "Contact 3",
                note = null,
                phone = null,
            )
        )
    }

    @Test
    @Transactional
    fun `findById() should find a contact by its ID`() {
        val foundFullControlUnitContact = jpaControlUnitContactRepository.findById(1)

        assertThat(foundFullControlUnitContact).isEqualTo(
            FullControlUnitContactDTO(
                id = 1,
                controlUnit = ControlUnitEntity(
                    id = 1,
                    administrationId = 1005,
                    areaNote = null,
                    isArchived = false,
                    name = "Cultures marines – DDTM 40",
                    termsNote = null
                ),
                controlUnitId = 1,
                name = "Contact 1",
                note = null,
                phone = null,
            )
        )
    }

    @Test
    @Transactional
    fun `save() should create and update a contact`() {
        // ---------------------------------------------------------------------
        // Create

        val newControlUnitContact = ControlUnitContactEntity(
            controlUnitId = 1,
            name = "Contact Name",
            note = "Contact Note",
            phone = "0123456789",
        )

        val createdControlUnitContact = jpaControlUnitContactRepository.save(newControlUnitContact)

        assertThat(createdControlUnitContact).isEqualTo(newControlUnitContact.copy(id = 4))
 
        // ---------------------------------------------------------------------
        // Update

        val nextControlUnitContact = ControlUnitContactEntity(
            id = 4,
            controlUnitId = 2,
            name = "Updated Contact Name",
            note = "Updated Contact Note",
            phone = "9876543210",
        )

        val updatedControlUnitContact = jpaControlUnitContactRepository.save(nextControlUnitContact)

        assertThat(updatedControlUnitContact).isEqualTo(nextControlUnitContact)

        // ---------------------------------------------------------------------
        // Reset

        jpaControlUnitContactRepository.deleteById(4)
    }
}
