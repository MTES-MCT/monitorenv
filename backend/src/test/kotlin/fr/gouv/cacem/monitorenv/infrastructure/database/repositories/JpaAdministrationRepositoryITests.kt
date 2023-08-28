package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.administration.dtos.FullAdministrationDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

class JpaAdministrationRepositoryITests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaAdministrationRepository: JpaAdministrationRepository

    @Test
    @Transactional
    fun `delete() should delete an administration by its ID`() {
        val beforeAdministrationIds = jpaAdministrationRepository.findAll().map { it.id }

        assertThat(beforeAdministrationIds).hasSize(33)
        assertThat(beforeAdministrationIds).contains(1)

        jpaAdministrationRepository.deleteById(1)

        val afterAdministrationIds = jpaAdministrationRepository.findAll().map { it.id }

        assertThat(afterAdministrationIds).hasSize(32)
        assertThat(afterAdministrationIds).doesNotContain(1)
    }

    @Test
    @Transactional
    fun `findAll() should find all administrations`() {
        val foundFullAdministrations = jpaAdministrationRepository.findAll()

        assertThat(foundFullAdministrations).hasSize(33)

        // We check the second administration instead of the first here because the first one is named “-”
        assertThat(foundFullAdministrations[1]).isEqualTo(
            FullAdministrationDTO(
                id = 1007,
                controlUnitIds = listOf(),
                controlUnits = listOf(),
                name = "AECP"
            )
        )

        assertThat(foundFullAdministrations[32]).isEqualTo(
            FullAdministrationDTO(
                id = 2004,
                controlUnitIds = listOf(),
                controlUnits = listOf(),
                name = "Sécurité Civile"
            )
        )
    }

    @Test
    @Transactional
    fun `findById() should find an administration by its ID`() {
        val foundFullAdministration = jpaAdministrationRepository.findById(6)

        assertThat(foundFullAdministration).isEqualTo(
            FullAdministrationDTO(
                id = 6,
                controlUnitIds = listOf(22, 23),
                controlUnits = listOf(
                    ControlUnitEntity(
                        id = 22,
                        administrationId = 6,
                        areaNote = null,
                        controlUnitContactIds = listOf(),
                        controlUnitResourceIds = listOf(),
                        isArchived = false,
                        name = "BN Toulon",
                        termsNote = null,
                    ),
                    ControlUnitEntity(
                        id = 23,
                        administrationId = 6,
                        areaNote = null,
                        controlUnitContactIds = listOf(),
                        controlUnitResourceIds = listOf(),
                        isArchived = false,
                        name = "Brigade fluviale de Rouen",
                        termsNote = null,
                    ),
                ),
                name = "Gendarmerie Nationale"
            )
        )
    }

    @Test
    @Transactional
    fun `save() should create and update an administration`() {
        // ---------------------------------------------------------------------
        // Create

        val newAdministration = AdministrationEntity(
            controlUnitIds = listOf(1, 2),
            name = "Administration Name"
        )

        val createdAdministration = jpaAdministrationRepository.save(newAdministration)

        assertThat(createdAdministration).isEqualTo(newAdministration.copy(id = 2007))

        // ---------------------------------------------------------------------
        // Update

        val nextAdministration = AdministrationEntity(
            id = 2007,
            controlUnitIds = listOf(3),
            name = "Updated Administration Name"
        )

        val updatedAdministration = jpaAdministrationRepository.save(nextAdministration)

        assertThat(updatedAdministration).isEqualTo(nextAdministration)
    }
}
