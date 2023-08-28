// TODO There is a hash issue here, we can't compare the full objects at once.

package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitResourceDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

class JpaControlUnitResourceRepositoryITests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaControlUnitResourceRepository: JpaControlUnitResourceRepository

    @Test
    @Transactional
    fun `delete() should delete a contact by its ID`() {
        val beforeControlUnitResourceIds = jpaControlUnitResourceRepository.findAll().map { it.id }

        assertThat(beforeControlUnitResourceIds).hasSize(4)
        assertThat(beforeControlUnitResourceIds).contains(1)

        jpaControlUnitResourceRepository.deleteById(1)

        val afterControlUnitResourceIds = jpaControlUnitResourceRepository.findAll().map { it.id }

        assertThat(afterControlUnitResourceIds).hasSize(3)
        assertThat(afterControlUnitResourceIds).doesNotContain(1)
    }

    @Test
    @Transactional
    fun `findAll() should find all contacts`() {
        val foundFullControlUnitResources = jpaControlUnitResourceRepository.findAll()

        assertThat(foundFullControlUnitResources).hasSize(4)

        assertThat(foundFullControlUnitResources[0]).isEqualTo(
            FullControlUnitResourceDTO(
                id = 1,
                base = BaseEntity(
                    id = 1,
                    controlUnitResourceIds = listOf(1, 2, 4),
                    name = "Marseille"
                ),
                baseId = 1,
                controlUnit = ControlUnitEntity(
                    id = 25,
                    administrationId = 3,
                    areaNote = null,
                    controlUnitContactIds = listOf(1, 2),
                    controlUnitResourceIds = listOf(1, 2, 3),
                    isArchived = false,
                    name = "A636 Maïto",
                    termsNote = null
                ),
                controlUnitId = 25,
                name = "Moyen 1",
                note = null,
                photo = null,
                type = ControlUnitResourceType.BARGE,
            )
        )

        assertThat(foundFullControlUnitResources[3]).isEqualTo(
            FullControlUnitResourceDTO(
                id = 4,
                base = BaseEntity(
                    id = 1,
                    controlUnitResourceIds = listOf(1, 2, 4),
                    name = "Marseille"
                ),
                baseId = 1,
                controlUnit = ControlUnitEntity(
                    id = 15,
                    administrationId = 2,
                    areaNote = null,
                    controlUnitContactIds = listOf(3),
                    controlUnitResourceIds = listOf(4),
                    isArchived = true,
                    name = "BGC Ajaccio",
                    termsNote = null
                ),
                controlUnitId = 15,
                name = "Moyen 4",
                note = null,
                photo = null,
                type = ControlUnitResourceType.FRIGATE,
            )
        )
    }

    @Test
    @Transactional
    fun `findById() should find a contact by its ID`() {
        val foundFullControlUnitResource = jpaControlUnitResourceRepository.findById(1)

        assertThat(foundFullControlUnitResource).isEqualTo(
            FullControlUnitResourceDTO(
                id = 1,
                base = BaseEntity(
                    id = 1,
                    controlUnitResourceIds = listOf(1, 2, 4),
                    name = "Marseille"
                ),
                baseId = 1,
                controlUnit = ControlUnitEntity(
                    id = 25,
                    administrationId = 3,
                    areaNote = null,
                    controlUnitContactIds = listOf(1, 2),
                    controlUnitResourceIds = listOf(1, 2, 3),
                    isArchived = false,
                    name = "A636 Maïto",
                    termsNote = null
                ),
                controlUnitId = 25,
                name = "Moyen 1",
                note = null,
                photo = null,
                type = ControlUnitResourceType.BARGE,
            )
        )
    }

    @Test
    @Transactional
    fun `save() should create and update a contact`() {
        // ---------------------------------------------------------------------
        // Create

        val newControlUnitResource = ControlUnitResourceEntity(
            baseId = 1,
            controlUnitId = 1,
            name = "Resource Name",
            note = "Resource Note",
            photo = null,
            type = ControlUnitResourceType.BARGE,
        )

        val createdControlUnitResource = jpaControlUnitResourceRepository.save(newControlUnitResource)

        assertThat(createdControlUnitResource).isEqualTo(newControlUnitResource.copy(id = 5))

        // ---------------------------------------------------------------------
        // Update

        val nextControlUnitResource = ControlUnitResourceEntity(
            id = 5,
            baseId = 2,
            controlUnitId = 2,
            name = "Updated Resource Name",
            note = "Updated Resource Note",
            photo = null,
            type = ControlUnitResourceType.FRIGATE,
        )

        val updatedControlUnitResource = jpaControlUnitResourceRepository.save(nextControlUnitResource)

        assertThat(updatedControlUnitResource).isEqualTo(nextControlUnitResource)
    }
}
