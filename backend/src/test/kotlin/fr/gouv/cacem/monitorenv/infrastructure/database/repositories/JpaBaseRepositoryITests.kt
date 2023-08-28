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
    fun `delete() should delete a base by its ID`() {
        val beforeBaseIds = jpaBaseRepository.findAll().map { it.id }

        assertThat(beforeBaseIds).isEqualTo(listOf(1, 2))

        jpaBaseRepository.deleteById(2)

        val afterBaseIds = jpaBaseRepository.findAll().map { it.id }

        assertThat(afterBaseIds).isEqualTo(listOf(1))
    }

    @Test
    @Transactional
    fun `findAll() should find all bases`() {
        val foundBases = jpaBaseRepository.findAll()

        assertThat(foundBases).isEqualTo(
            listOf(
                FullBaseDTO(
                    id = 1,
                    controlUnitResourceIds = listOf(1, 2, 4),
                    controlUnitResources = listOf(
                        ControlUnitResourceEntity(
                            id = 1,
                            base = null,
                            baseId = 1,
                            controlUnitId = 25,
                            name = "Moyen 1",
                            note = null,
                            photo = null,
                            type = ControlUnitResourceType.BARGE
                        ),
                        ControlUnitResourceEntity(
                            id = 2,
                            base = null,
                            baseId = 1,
                            controlUnitId = 25,
                            name = "Moyen 2",
                            note = null,
                            photo = null,
                            type = ControlUnitResourceType.BARGE
                        ),
                        ControlUnitResourceEntity(
                            id = 4,
                            base = null,
                            baseId = 1,
                            controlUnitId = 15,
                            name = "Moyen 4",
                            note = null,
                            photo = null,
                            type = ControlUnitResourceType.FRIGATE
                        )
                    ),
                    name = "Marseille"
                ),

                FullBaseDTO(
                    id = 2,
                    controlUnitResourceIds = listOf(3),
                    controlUnitResources = listOf(
                        ControlUnitResourceEntity(
                            id = 3,
                            base = null,
                            baseId = 2,
                            controlUnitId = 25,
                            name = "Moyen 3",
                            note = null,
                            photo = null,
                            type = ControlUnitResourceType.FRIGATE
                        )
                    ),
                    name = "Saint-Malo"
                ),
            )
        )
    }

    @Test
    @Transactional
    fun `findById() should find a base by its ID`() {
        val foundBase = jpaBaseRepository.findById(2)

        assertThat(foundBase).isEqualTo(
            FullBaseDTO(
                id = 2,
                controlUnitResourceIds = listOf(3),
                controlUnitResources = listOf(
                    ControlUnitResourceEntity(
                        id = 3,
                        base = null,
                        baseId = 2,
                        controlUnitId = 25,
                        name = "Moyen 3",
                        note = null,
                        photo = null,
                        type = ControlUnitResourceType.FRIGATE
                    )
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

        assertThat(createdBase).isEqualTo(newBase.copy(id = 3))

        // ---------------------------------------------------------------------
        // Update

        val nextBase = BaseEntity(
            id = 3,
            controlUnitResourceIds = listOf(3),
            name = "Updated Base Name"
        )

        val updatedBase = jpaBaseRepository.save(nextBase)

        assertThat(updatedBase).isEqualTo(nextBase)
    }
}
