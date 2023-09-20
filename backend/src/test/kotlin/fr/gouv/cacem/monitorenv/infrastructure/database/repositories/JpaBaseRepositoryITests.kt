package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.use_cases.base.dtos.FullBaseDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

class JpaBaseRepositoryITests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaBaseRepository: JpaBaseRepository

    @Test
    @Transactional
    fun `deleteById() should delete a base by its ID`() {
        val beforeBaseIds = jpaBaseRepository.findAll().map { requireNotNull(it.id) }.sorted()

        assertThat(beforeBaseIds).isEqualTo(listOf(1, 2, 3))

        jpaBaseRepository.deleteById(2)

        val afterBaseIds = jpaBaseRepository.findAll().map { requireNotNull(it.id) }.sorted()

        assertThat(afterBaseIds).isEqualTo(listOf(1, 3))
    }

    @Test
    @Transactional
    fun `findAll() should find all bases`() {
        val foundFullBases = jpaBaseRepository.findAll().sortedBy { requireNotNull(it.id) }

        assertThat(foundFullBases).hasSize(3)

        assertThat(foundFullBases[0]).isEqualTo(
            FullBaseDTO(
                id = 1,
                controlUnitResourceIds = listOf(1, 2),
                controlUnitResources = listOf(
                    ControlUnitResourceEntity(
                        id = 1,
                        base = null,
                        baseId = 1,
                        controlUnitId = 1,
                        name = "Semi-rigide 1",
                        note = null,
                        photo = null,
                        type = ControlUnitResourceType.BARGE
                    ),
                    ControlUnitResourceEntity(
                        id = 2,
                        base = null,
                        baseId = 1,
                        controlUnitId = 1,
                        name = "Semi-rigide 2",
                        note = null,
                        photo = null,
                        type = ControlUnitResourceType.BARGE
                    ),
                ),
                name = "Marseille"
            ),
        )

        assertThat(foundFullBases[1]).isEqualTo(
            FullBaseDTO(
                id = 2,
                controlUnitResourceIds = listOf(3, 4, 6),
                controlUnitResources = listOf(
                    ControlUnitResourceEntity(
                        id = 3,
                        base = null,
                        baseId = 2,
                        controlUnitId = 3,
                        name = "Semi-rigide 1",
                        note = null,
                        photo = null,
                        type = ControlUnitResourceType.BARGE
                    ),
                    ControlUnitResourceEntity(
                        id = 4,
                        base = null,
                        baseId = 2,
                        controlUnitId = 3,
                        name = "Semi-rigide 2",
                        note = null,
                        photo = null,
                        type = ControlUnitResourceType.BARGE
                    ),
                    ControlUnitResourceEntity(
                        id = 6,
                        base = null,
                        baseId = 2,
                        controlUnitId = 4,
                        name = "AR VECHEN",
                        note = null,
                        photo = null,
                        type = ControlUnitResourceType.FRIGATE
                    ),
                ),
                name = "Saint-Malo"
            ),
        )
    }

    @Test
    @Transactional
    fun `findById() should find a base by its ID`() {
        val foundFullBase = jpaBaseRepository.findById(2)

        assertThat(foundFullBase).isEqualTo(
            FullBaseDTO(
                id = 2,
                controlUnitResourceIds = listOf(3, 4, 6),
                controlUnitResources = listOf(
                    ControlUnitResourceEntity(
                        id = 3,
                        base = null,
                        baseId = 2,
                        controlUnitId = 3,
                        name = "Semi-rigide 1",
                        note = null,
                        photo = null,
                        type = ControlUnitResourceType.BARGE
                    ),
                    ControlUnitResourceEntity(
                        id = 4,
                        base = null,
                        baseId = 2,
                        controlUnitId = 3,
                        name = "Semi-rigide 2",
                        note = null,
                        photo = null,
                        type = ControlUnitResourceType.BARGE
                    ),
                    ControlUnitResourceEntity(
                        id = 6,
                        base = null,
                        baseId = 2,
                        controlUnitId = 4,
                        name = "AR VECHEN",
                        note = null,
                        photo = null,
                        type = ControlUnitResourceType.FRIGATE
                    ),
                ),
                name = "Saint-Malo"
            ),
        )
    }

    @Test
    @Transactional
    fun `save() should create and update a base`() {
        // ---------------------------------------------------------------------
        // Create

        val newBase = BaseEntity(
            controlUnitResourceIds = listOf(1, 2),
            name = "Base Name"
        )

        val createdBase = jpaBaseRepository.save(newBase)

        assertThat(createdBase).isEqualTo(newBase.copy(id = 4))

        // ---------------------------------------------------------------------
        // Update

        val nextBase = BaseEntity(
            id = 4,
            controlUnitResourceIds = listOf(3),
            name = "Updated Base Name"
        )

        val updatedBase = jpaBaseRepository.save(nextBase)

        assertThat(updatedBase).isEqualTo(nextBase)
    }
}
