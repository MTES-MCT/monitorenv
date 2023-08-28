// TODO There is a hash issue here, we can't compare the full objects at once.

package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

class JpaControlUnitRepositoryITests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaControlUnitRepository: JpaControlUnitRepository

    @Test
    @Transactional
    fun `delete() should archive a control unit by its ID`() {
        val beforeFullControlUnit = jpaControlUnitRepository.findById(1)

        assertThat(beforeFullControlUnit.isArchived).isFalse()

        jpaControlUnitRepository.deleteById(1)

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
                id = 25,
                administration = AdministrationEntity(
                    id = 3,
                    controlUnitIds = listOf(25),
                    name = "Marine Nationale"
                ),
                administrationId = 3,
                controlUnitContactIds = listOf(1, 2),
                controlUnitContacts = listOf(
                    ControlUnitContactEntity(
                        id = 1,
                        controlUnitId = 25,
                        email = null,
                        name = "Contact 1",
                        note = null,
                        phone = null
                    ),
                    ControlUnitContactEntity(
                        id = 2,
                        controlUnitId = 25,
                        email = null,
                        name = "Contact 2",
                        note = null,
                        phone = null
                    )
                ),
                controlUnitResourceIds = listOf(1, 2, 3),
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
                areaNote = null,
                isArchived = false,
                name = "A636 Maïto",
                termsNote = null,
            )
        )

        assertThat(foundFullControlUnits[32]).isEqualTo(
            FullControlUnitDTO(
                id = 9,
                administration = AdministrationEntity(
                    id = 1005,
                    controlUnitIds = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
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
        val foundFullControlUnit = jpaControlUnitRepository.findById(25)

        assertThat(foundFullControlUnit).isEqualTo(
            FullControlUnitDTO(
                id = 25,
                administration = AdministrationEntity(
                    id = 3,
                    controlUnitIds = listOf(25),
                    name = "Marine Nationale"
                ),
                administrationId = 3,
                controlUnitContactIds = listOf(1, 2),
                controlUnitContacts = listOf(
                    ControlUnitContactEntity(
                        id = 1,
                        controlUnitId = 25,
                        email = null,
                        name = "Contact 1",
                        note = null,
                        phone = null
                    ),
                    ControlUnitContactEntity(
                        id = 2,
                        controlUnitId = 25,
                        email = null,
                        name = "Contact 2",
                        note = null,
                        phone = null
                    )
                ),
                controlUnitResourceIds = listOf(1, 2, 3),
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
                areaNote = null,
                isArchived = false,
                name = "A636 Maïto",
                termsNote = null,
            )
        )
    }

    @Test
    @Transactional
    fun `save() should create and update a control unit`() {
        // ---------------------------------------------------------------------
        // Create

        val newControlUnit = ControlUnitEntity(
            administrationId = 1,
            areaNote = "Area Note",
            controlUnitContactIds = listOf(1, 2),
            controlUnitResourceIds = listOf(2, 3),
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
            controlUnitContactIds = listOf(3),
            controlUnitResourceIds = listOf(1),
            isArchived = false,
            name = "Updated Control Unit Name",
            termsNote = "Updated Terms Note",
        )

        val updatedControlUnit = jpaControlUnitRepository.save(nextControlUnit)

        assertThat(updatedControlUnit).isEqualTo(nextControlUnit)
    }
}
