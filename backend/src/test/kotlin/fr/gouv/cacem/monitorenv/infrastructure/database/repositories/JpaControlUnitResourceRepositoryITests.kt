// TODO There is a hash issue here, we can't compare the full objects at once.

package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
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
    fun `findAll() should find all resources`() {
        val foundFullControlUnitResources =
            jpaControlUnitResourceRepository.findAll().sortedBy { requireNotNull(it.controlUnitResource.id) }

        assertThat(foundFullControlUnitResources).hasSize(12)

        assertThat(foundFullControlUnitResources[0]).isEqualTo(
            FullControlUnitResourceDTO(
                base = BaseEntity(
                    id = 1,
                    name = "Marseille"
                ),
                controlUnit = ControlUnitEntity(
                    id = 1,
                    administrationId = 1005,
                    areaNote = null,
                    isArchived = false,
                    name = "Cultures marines – DDTM 40",
                    termsNote = null
                ),
                controlUnitResource = ControlUnitResourceEntity(
                    id = 1,
                    baseId = 1,
                    controlUnitId = 1,
                    name = "Semi-rigide 1",
                    note = null,
                    photo = null,
                    type = ControlUnitResourceType.BARGE,
                ),
            )
        )

        assertThat(foundFullControlUnitResources[11]).isEqualTo(
            FullControlUnitResourceDTO(
                base = BaseEntity(
                    id = 3,
                    name = "Dunkerque"
                ),
                controlUnit = ControlUnitEntity(
                    id = 19,
                    administrationId = 1008,
                    areaNote = null,
                    isArchived = false,
                    name = "DREAL Pays-de-La-Loire",
                    termsNote = null
                ),
                controlUnitResource = ControlUnitResourceEntity(
                    id = 12,
                    baseId = 3,
                    controlUnitId = 19,
                    name = "ARIOLA",
                    note = null,
                    photo = null,
                    type = ControlUnitResourceType.FRIGATE,
                ),
            )
        )
    }

    @Test
    @Transactional
    fun `findById() should find a resource by its ID`() {
        val foundFullControlUnitResource = jpaControlUnitResourceRepository.findById(1)

        assertThat(foundFullControlUnitResource).isEqualTo(
            FullControlUnitResourceDTO(
                base = BaseEntity(
                    id = 1,
                    name = "Marseille"
                ),
                controlUnit = ControlUnitEntity(
                    id = 1,
                    administrationId = 1005,
                    areaNote = null,
                    isArchived = false,
                    name = "Cultures marines – DDTM 40",
                    termsNote = null
                ),
                controlUnitResource = ControlUnitResourceEntity(
                    id = 1,
                    baseId = 1,
                    controlUnitId = 1,
                    name = "Semi-rigide 1",
                    note = null,
                    photo = null,
                    type = ControlUnitResourceType.BARGE,
                ),
            )
        )
    }

    @Test
    @Transactional
    fun `save() should create and update a resource, deleteById() should delete a resource`() {
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

        assertThat(createdControlUnitResource).isEqualTo(newControlUnitResource.copy(id = 13))

        // ---------------------------------------------------------------------
        // Update

        val nextControlUnitResource = ControlUnitResourceEntity(
            id = 13,
            baseId = 2,
            controlUnitId = 2,
            name = "Updated Resource Name",
            note = "Updated Resource Note",
            photo = null,
            type = ControlUnitResourceType.FRIGATE,
        )

        val updatedControlUnitResource = jpaControlUnitResourceRepository.save(nextControlUnitResource)

        assertThat(updatedControlUnitResource).isEqualTo(nextControlUnitResource)

        // ---------------------------------------------------------------------
        // Delete

        jpaControlUnitResourceRepository.deleteById(13)

        val controlUnitResourceIds =
            jpaControlUnitResourceRepository.findAll().map { requireNotNull(it.controlUnitResource.id) }.sorted()

        assertThat(controlUnitResourceIds).doesNotContain(13)
    }
}
