package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.administration.dtos.FullAdministrationDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.exceptions.ForeignKeyConstraintException
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.exceptions.UnarchivedChildException
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.catchThrowable
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

class JpaAdministrationRepositoryITests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaAdministrationRepository: JpaAdministrationRepository
    
    @Test
    @Transactional
    fun `archiveById() should archive an administration by its ID`() {
        val beforeFullAdministration = jpaAdministrationRepository.findById(2006)

        assertThat(beforeFullAdministration.administration.isArchived).isFalse()

        jpaAdministrationRepository.archiveById(2006)

        val afterFullAdministration = jpaAdministrationRepository.findById(2006)

        assertThat(afterFullAdministration.administration.isArchived).isTrue()
    }

    @Test
    @Transactional
    fun `archiveById() should throw the expected exception when the administration is linked to unarchived control units`() {
        val throwable = catchThrowable {
            jpaAdministrationRepository.archiveById(1005)
        }

        // Then
        assertThat(throwable).isInstanceOf(UnarchivedChildException::class.java)
    }

    @Test
    @Transactional
    fun `deleteById() should throw the expected exception when the administration is linked to some control units`() {
        val throwable = catchThrowable {
            jpaAdministrationRepository.deleteById(1005)
        }

        assertThat(throwable).isInstanceOf(ForeignKeyConstraintException::class.java)
    }

    @Test
    @Transactional
    fun `findAll() should find all administrations`() {
        val foundFullAdministrations = jpaAdministrationRepository.findAll()

        assertThat(foundFullAdministrations).hasSize(33)

        // We check the second administration instead of the first here because the first one is named “-”
        assertThat(foundFullAdministrations[1]).isEqualTo(
            FullAdministrationDTO(
                administration = AdministrationEntity(
                    id = 1007,
                    isArchived = false,
                    name = "AECP"
                ),
                controlUnits = listOf(),
            )
        )

        assertThat(foundFullAdministrations[32]).isEqualTo(
            FullAdministrationDTO(
                administration = AdministrationEntity(
                    id = 2004,
                    isArchived = false,
                    name = "Sécurité Civile"
                ),
                controlUnits = listOf(),
            )
        )
    }

    @Test
    @Transactional
    fun `findById() should find an administration by its ID`() {
        val foundFullAdministration = jpaAdministrationRepository.findById(6)

        assertThat(foundFullAdministration).isEqualTo(
            FullAdministrationDTO(
                administration = AdministrationEntity(
                    id = 6,
                    isArchived = false,
                    name = "Gendarmerie Nationale"
                ),
                controlUnits = listOf(
                    ControlUnitEntity(
                        id = 21,
                        administrationId = 6,
                        areaNote = null,
                        isArchived = false,
                        name = "BN Toulon",
                        termsNote = null,
                    ),
                    ControlUnitEntity(
                        id = 22,
                        administrationId = 6,
                        areaNote = null,
                        isArchived = false,
                        name = "Brigade fluviale de Rouen",
                        termsNote = null,
                    ),
                ),
            )
        )
    }

    @Test
    @Transactional
    fun `save() should create and update an administration, deleteById() should delete an administration`() {
        // ---------------------------------------------------------------------
        // Create

        val newAdministration = AdministrationEntity(
            isArchived = false,
            name = "Administration Name"
        )

        val createdAdministration = jpaAdministrationRepository.save(newAdministration)

        assertThat(createdAdministration).isEqualTo(newAdministration.copy(id = 2007))

        // ---------------------------------------------------------------------
        // Update

        val nextAdministration = AdministrationEntity(
            id = 2007,
            isArchived = false,
            name = "Updated Administration Name"
        )

        val updatedAdministration = jpaAdministrationRepository.save(nextAdministration)

        assertThat(updatedAdministration).isEqualTo(nextAdministration)

        // ---------------------------------------------------------------------
        // Delete

        jpaAdministrationRepository.deleteById(2007)

        val administrationIds =
            jpaAdministrationRepository.findAll().map { requireNotNull(it.administration.id) }.sorted()

        assertThat(administrationIds).doesNotContain(2007)
    }
}
