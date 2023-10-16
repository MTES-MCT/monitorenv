package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.use_cases.base.dtos.FullBaseDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.exceptions.ForeignKeyConstraintException
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

class JpaBaseRepositoryITests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaBaseRepository: JpaBaseRepository

    @Test
    @Transactional
    fun `deleteById() should throw the expected exception when the base is linked to some control unit resources`() {
        val throwable = Assertions.catchThrowable {
            jpaBaseRepository.deleteById(1)
        }

        assertThat(throwable).isInstanceOf(ForeignKeyConstraintException::class.java)
    }

    @Test
    @Transactional
    fun `findAll() should find all bases`() {
        val foundFullBases = jpaBaseRepository.findAll().sortedBy { requireNotNull(it.base.id) }

        assertThat(foundFullBases).hasSize(3)

        assertThat(foundFullBases[0]).isEqualTo(
            FullBaseDTO(
                base = BaseEntity(
                    id = 1,
                    latitude = 43.295765,
                    longitude = 5.375486,
                    name = "Marseille",
                ),
                controlUnitResources = listOf(
                    ControlUnitResourceEntity(
                        id = 1,
                        baseId = 1,
                        controlUnitId = 10000,
                        name = "Semi-rigide 1",
                        note = null,
                        photo = null,
                        type = ControlUnitResourceType.BARGE,
                    ),
                    ControlUnitResourceEntity(
                        id = 2,
                        baseId = 1,
                        controlUnitId = 10000,
                        name = "Semi-rigide 2",
                        note = null,
                        photo = null,
                        type = ControlUnitResourceType.BARGE,
                    ),
                ),
            ),
        )

        assertThat(foundFullBases[2]).isEqualTo(
            FullBaseDTO(
                base = BaseEntity(
                    id = 3,
                    latitude = 51.035534,
                    longitude = 2.372845,
                    name = "Dunkerque",
                ),
                controlUnitResources = listOf(
                    ControlUnitResourceEntity(
                        id = 5,
                        baseId = 3,
                        controlUnitId = 10002,
                        name = "Voiture",
                        note = null,
                        photo = null,
                        type = ControlUnitResourceType.CAR,
                    ),
                    ControlUnitResourceEntity(
                        id = 7,
                        baseId = 3,
                        controlUnitId = 10003,
                        name = "Semi-rigide",
                        note = null,
                        photo = null,
                        type = ControlUnitResourceType.BARGE,
                    ),
                    ControlUnitResourceEntity(
                        id = 8,
                        baseId = 3,
                        controlUnitId = 10010,
                        name = "PAM Jeanne Barret",
                        note = null,
                        photo = null,
                        type = ControlUnitResourceType.FRIGATE,
                    ),
                    ControlUnitResourceEntity(
                        id = 9,
                        baseId = 3,
                        controlUnitId = 10011,
                        name = "PAM Themis",
                        note = null,
                        photo = null,
                        type = ControlUnitResourceType.FRIGATE,
                    ),
                    ControlUnitResourceEntity(
                        id = 10,
                        baseId = 3,
                        controlUnitId = 10018,
                        name = "ALTAIR",
                        note = null,
                        photo = null,
                        type = ControlUnitResourceType.FRIGATE,
                    ),
                    ControlUnitResourceEntity(
                        id = 11,
                        baseId = 3,
                        controlUnitId = 10018,
                        name = "PHEROUSA",
                        note = null,
                        photo = null,
                        type = ControlUnitResourceType.FRIGATE,
                    ),
                    ControlUnitResourceEntity(
                        id = 12,
                        baseId = 3,
                        controlUnitId = 10018,
                        name = "ARIOLA",
                        note = null,
                        photo = null,
                        type = ControlUnitResourceType.FRIGATE,
                    ),
                ),
            ),
        )
    }

    @Test
    @Transactional
    fun `findById() should find a base by its ID`() {
        val foundFullBase = jpaBaseRepository.findById(2)

        assertThat(foundFullBase).isEqualTo(
            FullBaseDTO(
                base = BaseEntity(
                    id = 2,
                    latitude = 48.648105,
                    longitude = -2.013144,
                    name = "Saint-Malo",
                ),
                controlUnitResources = listOf(
                    ControlUnitResourceEntity(
                        id = 3,
                        baseId = 2,
                        controlUnitId = 10002,
                        name = "Semi-rigide 1",
                        note = null,
                        photo = null,
                        type = ControlUnitResourceType.BARGE,
                    ),
                    ControlUnitResourceEntity(
                        id = 4,
                        baseId = 2,
                        controlUnitId = 10002,
                        name = "Semi-rigide 2",
                        note = null,
                        photo = null,
                        type = ControlUnitResourceType.BARGE,
                    ),
                    ControlUnitResourceEntity(
                        id = 6,
                        baseId = 2,
                        controlUnitId = 10003,
                        name = "AR VECHEN",
                        note = null,
                        photo = null,
                        type = ControlUnitResourceType.FRIGATE,
                    ),
                ),
            ),
        )
    }

    @Test
    @Transactional
    fun `save() should create and update a base, deleteById() should delete a base`() {
        // ---------------------------------------------------------------------
        // Create

        val newBase = BaseEntity(
            latitude = 1.2,
            longitude = 3.4,
            name = "Base Name",
        )

        val createdBase = jpaBaseRepository.save(newBase)

        assertThat(createdBase).isEqualTo(newBase.copy(id = 4))

        // ---------------------------------------------------------------------
        // Update

        val nextBase = BaseEntity(
            id = 4,
            latitude = 5.6,
            longitude = 7.8,
            name = "Updated Base Name",
        )

        val updatedBase = jpaBaseRepository.save(nextBase)

        assertThat(updatedBase).isEqualTo(nextBase)

        // ---------------------------------------------------------------------
        // Delete

        jpaBaseRepository.deleteById(4)

        val baseIds = jpaBaseRepository.findAll().map { requireNotNull(it.base.id) }.sorted()

        assertThat(baseIds).doesNotContain(4)
    }
}
