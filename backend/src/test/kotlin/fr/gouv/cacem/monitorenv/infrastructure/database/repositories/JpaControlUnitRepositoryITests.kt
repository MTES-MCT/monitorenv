package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitResourceDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.exceptions.ForeignKeyConstraintException
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.catchThrowable
import org.junit.jupiter.api.Disabled
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

        assertThat(beforeFullControlUnit.controlUnit.isArchived).isFalse()

        jpaControlUnitRepository.archiveById(1)

        val afterFullControlUnit = jpaControlUnitRepository.findById(1)

        assertThat(afterFullControlUnit.controlUnit.isArchived).isTrue()
    }

    // TODO Find how to test that
    @Test
    @Transactional
    @Disabled
    fun `deleteById() should throw an exception when the control unit is linked to some missions`() {
        val throwable = catchThrowable {
            jpaControlUnitRepository.deleteById(1005)
        }

        assertThat(throwable).isInstanceOf(ForeignKeyConstraintException::class.java)
    }

    // TODO Find how to test that
    @Test
    @Transactional
    @Disabled
    fun `deleteById() should throw an exception when the control unit is linked to some reportings`() {
        val throwable = catchThrowable {
            jpaControlUnitRepository.deleteById(1005)
        }

        assertThat(throwable).isInstanceOf(ForeignKeyConstraintException::class.java)
    }

    @Test
    @Transactional
    fun `findAll() should find all control units`() {
        val foundFullControlUnits = jpaControlUnitRepository.findAll()

        assertThat(foundFullControlUnits).hasSize(33)

        assertThat(foundFullControlUnits[0]).isEqualTo(
            FullControlUnitDTO(
                administration = AdministrationEntity(
                    id = 3,
                    isArchived = false,
                    name = "Marine Nationale"
                ),
                controlUnit = ControlUnitEntity(
                    id = 24,
                    administrationId = 3,
                    areaNote = null,
                    isArchived = false,
                    name = "A636 Maïto",
                    termsNote = null,
                ),
                controlUnitContacts = listOf(),
                controlUnitResources = listOf(),
            )
        )

        assertThat(foundFullControlUnits[32]).isEqualTo(
            FullControlUnitDTO(
                administration = AdministrationEntity(
                    id = 1005,
                    isArchived = false,
                    name = "DDTM"
                ),
                controlUnit = ControlUnitEntity(
                    id = 8,
                    administrationId = 1005,
                    areaNote = null,
                    isArchived = false,
                    name = "SML 50",
                    termsNote = null,
                ),
                controlUnitContacts = listOf(),
                controlUnitResources = listOf(),
            )
        )
    }

    @Test
    @Transactional
    fun `findById() should find a control unit by its ID`() {
        val foundFullControlUnit = jpaControlUnitRepository.findById(1)

        assertThat(foundFullControlUnit).isEqualTo(
            FullControlUnitDTO(
                administration = AdministrationEntity(
                    id = 1005,
                    isArchived = false,
                    name = "DDTM"
                ),
                controlUnit = ControlUnitEntity(
                    id = 1,
                    administrationId = 1005,
                    areaNote = null,
                    isArchived = false,
                    name = "Cultures marines – DDTM 40",
                    termsNote = null,
                ),
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
                controlUnitResources = listOf(
                    FullControlUnitResourceDTO(
                        base = BaseEntity(
                            id = 1,
                            name = "Marseille",
                        ),
                        controlUnit = ControlUnitEntity(
                            id = 1,
                            administrationId = 1005,
                            areaNote = null,
                            isArchived = false,
                            name = "Cultures marines – DDTM 40",
                            termsNote = null,
                        ),
                        controlUnitResource = ControlUnitResourceEntity(
                            id = 1,
                            baseId = 1,
                            controlUnitId = 1,
                            name = "Semi-rigide 1",
                            note = null,
                            photo = null,
                            type = ControlUnitResourceType.BARGE,
                        )
                    ),
                    FullControlUnitResourceDTO(
                        base = BaseEntity(
                            id = 1,
                            name = "Marseille",
                        ),
                        controlUnit = ControlUnitEntity(
                            id = 1,
                            administrationId = 1005,
                            areaNote = null,
                            isArchived = false,
                            name = "Cultures marines – DDTM 40",
                            termsNote = null,
                        ),
                        controlUnitResource = ControlUnitResourceEntity(
                            id = 2,
                            baseId = 1,
                            controlUnitId = 1,
                            name = "Semi-rigide 2",
                            note = null,
                            photo = null,
                            type = ControlUnitResourceType.BARGE,
                        ),
                    ),
                ),
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

        val controlUnitIds = jpaControlUnitRepository.findAll().map { requireNotNull(it.controlUnit.id) }.sorted()

        assertThat(controlUnitIds).doesNotContain(34)
    }
}
