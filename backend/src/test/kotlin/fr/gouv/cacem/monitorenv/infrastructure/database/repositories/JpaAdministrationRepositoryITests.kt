// TODO There is a hash issue here, we can't compare the full objects at once.

package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.NextControlUnitEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional
import kotlin.reflect.full.memberProperties

class JpaAdministrationRepositoryITests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaAdministrationRepository: JpaAdministrationRepository

    @Test
    @Transactional
    fun `delete() should delete a administration by its ID`() {
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
        val foundAdministrations = jpaAdministrationRepository.findAll()

        assertThat(foundAdministrations).hasSize(33)

        // We check the second administration here because the first one is named “-”
        assertThat(foundAdministrations[1].id).isEqualTo(1007)
        assertThat(foundAdministrations[1].controlUnitIds).isEqualTo(listOf<Int>())
        assertThat(foundAdministrations[1].name).isEqualTo("AECP")

        assertThat(foundAdministrations[1].controlUnits).isEqualTo(listOf<Int>())

        assertThat(foundAdministrations[32].id).isEqualTo(2004)
        assertThat(foundAdministrations[32].controlUnitIds).isEqualTo(listOf<Int>())
        assertThat(foundAdministrations[32].name).isEqualTo("Sécurité Civile")

        assertThat(foundAdministrations[1].controlUnits).isEqualTo(listOf<Int>())
    }

    @Test
    @Transactional
    fun `findById() should find a administration`() {
        val foundAdministration = jpaAdministrationRepository.findById(6)

        println("${foundAdministration::class.memberProperties.map { it.name }}")

        assertThat(foundAdministration.id).isEqualTo(6)
        assertThat(foundAdministration.controlUnitIds).isEqualTo(listOf(22, 23))
        assertThat(foundAdministration.name).isEqualTo("Gendarmerie Nationale")

        assertThat(foundAdministration.controlUnits).isEqualTo(
            listOf(
                NextControlUnitEntity(
                    id = 22,
                    administrationId = 6,
                    areaNote = null,
                    controlUnitContactIds = listOf(),
                    controlUnitResourceIds = listOf(),
                    isArchived = false,
                    name = "BN Toulon",
                    termsNote = null,
                ),
                NextControlUnitEntity(
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
        )
    }

    @Test
    @Transactional
    fun `save() should create and update a administration`() {
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
