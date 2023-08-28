// TODO There is a hash issue here, we can't compare the full objects at once.

package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.NextControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitContactDTO
import okhttp3.internal.wait
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional
import kotlin.reflect.full.memberProperties

class JpaControlUnitContactRepositoryITests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaControlUnitContactRepository: JpaControlUnitContactRepository

    @Test
    @Transactional
    fun `delete() should delete a contact by its ID`() {
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
        val foundControlUnitContacts = jpaControlUnitContactRepository.findAll()

        assertThat(foundControlUnitContacts).hasSize(3)

        assertThat(foundControlUnitContacts[0]).isEqualTo(
            FullControlUnitContactDTO(
                id = 1,
                controlUnitId = 25,
                controlUnit = NextControlUnitEntity(
                    id = 25,
                    administrationId = 3,
                    areaNote = null,
                    controlUnitContactIds = listOf(1, 2),
                    controlUnitResourceIds = listOf(1, 2, 3),
                    isArchived = false,
                    name = "A636 Maïto",
                    termsNote = null
                ),
                name = "Contact 1",
                note = null,
                phone = null,
            )
        )

        assertThat(foundControlUnitContacts[2]).isEqualTo(
            FullControlUnitContactDTO(
                id = 3,
                controlUnitId = 15,
                controlUnit = NextControlUnitEntity(
                    id = 15,
                    administrationId = 2,
                    areaNote = null,
                    controlUnitContactIds = listOf(3),
                    controlUnitResourceIds = listOf(4),
                    isArchived = true,
                    name = "BGC Ajaccio",
                    termsNote = null
                ),
                name = "Contact 3",
                note = null,
                phone = null,
            )
        )
    }

    @Test
    @Transactional
    fun `findById() should find a contact by its ID`() {
        val foundControlUnitContact = jpaControlUnitContactRepository.findById(1)

        assertThat(foundControlUnitContact).isEqualTo(
            FullControlUnitContactDTO(
                id = 1,
                controlUnitId = 25,
                controlUnit = NextControlUnitEntity(
                    id = 25,
                    administrationId = 3,
                    areaNote = null,
                    controlUnitContactIds = listOf(1, 2),
                    controlUnitResourceIds = listOf(1, 2, 3),
                    isArchived = false,
                    name = "A636 Maïto",
                    termsNote = null
                ),
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
    }
}
