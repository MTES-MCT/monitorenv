// TODO There is a hash issue here, we can't compare the full objects at once.

package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitResourceDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

class JpaControlUnitRepositoryITests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaControlUnitRepository: JpaControlUnitRepository

    @Test
    @Transactional
    fun `archiveById() should archive a control unit by its ID`() {
        val beforeFullControlUnit = jpaControlUnitRepository.findById(1)

        assertThat(beforeFullControlUnit.isArchived).isFalse()

        jpaControlUnitRepository.archiveById(1)

        val afterFullControlUnit = jpaControlUnitRepository.findById(1)

        assertThat(afterFullControlUnit.isArchived).isTrue()
    }

    @Test
    @Transactional
    fun `findAll() should find all control units`() {
        val foundFullControlUnits = jpaControlUnitRepository.findAll()

        assertThat(foundFullControlUnits).hasSize(33)

        assertThat(foundFullControlUnits[0]).isEqualTo(
            FullControlUnitDTO(
                id = 24,
                administration = AdministrationEntity(
                    id = 3,
                    isArchived = false,
                    name = "Marine Nationale"
                ),
                administrationId = 3,
                controlUnitContactIds = listOf(),
                controlUnitContacts = listOf(),
                controlUnitResourceIds = listOf(),
                controlUnitResources = listOf(),
                areaNote = null,
                isArchived = false,
                name = "A636 Maïto",
                termsNote = null,
            )
        )

        assertThat(foundFullControlUnits[32]).isEqualTo(
            FullControlUnitDTO(
                id = 8,
                administration = AdministrationEntity(
                    id = 1005,
                    isArchived = false,
                    name = "DDTM"
                ),
                administrationId = 1005,
                controlUnitContactIds = listOf(),
                controlUnitContacts = listOf(),
                controlUnitResourceIds = listOf(),
                controlUnitResources = listOf(),
                areaNote = null,
                isArchived = false,
                name = "SML 50",
                termsNote = null,
            )
        )
    }

    @Test
    @Transactional
    fun `findById() should find a control unit by its ID`() {
        val foundFullControlUnit = jpaControlUnitRepository.findById(1)

        assertThat(foundFullControlUnit).isEqualTo(
            FullControlUnitDTO(
                id = 1,
                administration = AdministrationEntity(
                    id = 1005,
                    isArchived = false,
                    name = "DDTM"
                ),
                administrationId = 1005,
                controlUnitContactIds = listOf(1, 2),
                controlUnitContacts = listOf(
                    ControlUnitContactEntity(
                        id = 1,
                        controlUnitId = 1,
                        email = null,
                        name = "Contact 1",
                        note = null,
                        phone = null
                    ),
                    ControlUnitContactEntity(
                        id = 2,
                        controlUnitId = 1,
                        email = null,
                        name = "Contact 2",
                        note = null,
                        phone = null
                    )
                ),
                controlUnitResourceIds = listOf(1, 2),
                controlUnitResources = listOf(
                    FullControlUnitResourceDTO(
                        id = 1,
                        base = BaseEntity(
                            id = 1,
                            name = "Marseille",
                        ),
                        baseId = 1,
                        controlUnit = ControlUnitEntity(
                            id = 1,
                            administrationId = 1005,
                            areaNote = null,
                            isArchived = false,
                            name = "Cultures marines – DDTM 40",
                            termsNote = null,
                        ),
                        controlUnitId = 1,
                        name = "Semi-rigide 1",
                        note = null,
                        photo = null,
                        type = ControlUnitResourceType.BARGE,
                    ),
                    FullControlUnitResourceDTO(
                        id = 2,
                        base = BaseEntity(
                            id = 1,
                            name = "Marseille",
                        ),
                        baseId = 1,
                        controlUnit = ControlUnitEntity(
                            id = 1,
                            administrationId = 1005,
                            areaNote = null,
                            isArchived = false,
                            name = "Cultures marines – DDTM 40",
                            termsNote = null,
                        ),
                        controlUnitId = 1,
                        name = "Semi-rigide 2",
                        note = null,
                        photo = null,
                        type = ControlUnitResourceType.BARGE,
                    ),
                ),
                areaNote = null,
                isArchived = false,
                name = "Cultures marines – DDTM 40",
                termsNote = null,
            )
        )
    }

    @Test
    @Transactional
    fun `save() should create and update a control unit, deleteById() should delete a control unit`() {
        // ---------------------------------------------------------------------
        // Create

        val newControlUnit = ControlUnitEntity(
            administrationId = 1,
            areaNote = "Area Note",
            isArchived = false,
            name = "Control Unit Name",
            termsNote = "Terms Note",
        )

        val createdControlUnit = jpaControlUnitRepository.save(newControlUnit)

        assertThat(createdControlUnit).isEqualTo(newControlUnit.copy(id = 34))

        // ---------------------------------------------------------------------
        // Update

        val nextControlUnit = ControlUnitEntity(
            id = 34,
            administrationId = 1,
            areaNote = "Updated Area Note",
            isArchived = false,
            name = "Updated Control Unit Name",
            termsNote = "Updated Terms Note",
        )

        val updatedControlUnit = jpaControlUnitRepository.save(nextControlUnit)

        assertThat(updatedControlUnit).isEqualTo(nextControlUnit)

        // ---------------------------------------------------------------------
        // Delete

        jpaControlUnitRepository.deleteById(34)

        val controlUnitIds = jpaControlUnitRepository.findAll().map { requireNotNull(it.id) }.sorted()

        assertThat(controlUnitIds).doesNotContain(34)
    }
}
