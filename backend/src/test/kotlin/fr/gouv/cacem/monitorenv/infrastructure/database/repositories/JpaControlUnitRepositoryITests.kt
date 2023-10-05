package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.SeaFront
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
        val beforeFullControlUnit = jpaControlUnitRepository.findById(10000)

        assertThat(beforeFullControlUnit.controlUnit.isArchived).isFalse()

        jpaControlUnitRepository.archiveById(10000)

        val afterFullControlUnit = jpaControlUnitRepository.findById(10000)

        assertThat(afterFullControlUnit.controlUnit.isArchived).isTrue()
    }

    // TODO Find how to test that
    @Test
    @Transactional
    @Disabled
    fun `deleteById() should throw an exception when the control unit is linked to some missions`() {
        val throwable = catchThrowable {
            jpaControlUnitRepository.deleteById(10002)
        }

        assertThat(throwable).isInstanceOf(ForeignKeyConstraintException::class.java)
    }

    // TODO Find how to test that
    @Test
    @Transactional
    @Disabled
    fun `deleteById() should throw an exception when the control unit is linked to some reportings`() {
        val throwable = catchThrowable {
            // TODO Link a control unit to a reporting without linking it to any mission
            jpaControlUnitRepository.deleteById(0)
        }

        assertThat(throwable).isInstanceOf(ForeignKeyConstraintException::class.java)
    }

    @Test
    @Transactional
    fun `findAll() should find all control units`() {
        val foundFullControlUnits = jpaControlUnitRepository.findAll().sortedBy { requireNotNull(it.controlUnit.id) }

        assertThat(foundFullControlUnits).hasSize(33)

        assertThat(foundFullControlUnits[0]).isEqualTo(
            FullControlUnitDTO(
                administration = AdministrationEntity(
                    id = 1005,
                    isArchived = false,
                    name = "DDTM",
                ),
                controlUnit = ControlUnitEntity(
                    id = 10000,
                    administrationId = 1005,
                    areaNote = null,
                    department = "",
                    isArchived = false,
                    name = "Cultures marines – DDTM 40",
                    seaFront = SeaFront.UNKNOWN,
                    termsNote = null,
                ),
                controlUnitContacts = listOf(
                    ControlUnitContactEntity(
                        id = 1,
                        controlUnitId = 10000,
                        email = null,
                        name = "Contact 1",
                        phone = null,
                    ),
                    ControlUnitContactEntity(
                        id = 2,
                        controlUnitId = 10000,
                        email = null,
                        name = "Contact 2",
                        phone = null,
                    ),
                ),
                controlUnitResources = listOf(
                    FullControlUnitResourceDTO(
                        base = BaseEntity(
                            id = 1,
                            name = "Marseille",
                        ),
                        controlUnit = ControlUnitEntity(
                            id = 10000,
                            administrationId = 1005,
                            areaNote = null,
                            department = "",
                            isArchived = false,
                            name = "Cultures marines – DDTM 40",
                            seaFront = SeaFront.UNKNOWN,
                            termsNote = null,
                        ),
                        controlUnitResource = ControlUnitResourceEntity(
                            id = 1,
                            baseId = 1,
                            controlUnitId = 10000,
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
                            id = 10000,
                            administrationId = 1005,
                            areaNote = null,
                            department = "",
                            isArchived = false,
                            name = "Cultures marines – DDTM 40",
                            seaFront = SeaFront.UNKNOWN,
                            termsNote = null,
                        ),
                        controlUnitResource = ControlUnitResourceEntity(
                            id = 2,
                            baseId = 1,
                            controlUnitId = 10000,
                            name = "Semi-rigide 2",
                            note = null,
                            photo = null,
                            type = ControlUnitResourceType.BARGE,
                        )
                    )
                ),
            )
        )

        assertThat(foundFullControlUnits[32]).isEqualTo(
            FullControlUnitDTO(
                administration = AdministrationEntity(
                    id = 1005,
                    isArchived = false,
                    name = "DDTM",
                ),
                controlUnit = ControlUnitEntity(
                    id = 10032,
                    administrationId = 1005,
                    areaNote = null,
                    department = "",
                    isArchived = false,
                    name = "Cultures marines – DDTM 30",
                    seaFront = SeaFront.UNKNOWN,
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
        val foundFullControlUnit = jpaControlUnitRepository.findById(10000)

        assertThat(foundFullControlUnit).isEqualTo(
            FullControlUnitDTO(
                administration = AdministrationEntity(
                    id = 1005,
                    isArchived = false,
                    name = "DDTM"
                ),
                controlUnit = ControlUnitEntity(
                    id = 10000,
                    administrationId = 1005,
                    areaNote = null,
                    department = "",
                    isArchived = false,
                    name = "Cultures marines – DDTM 40",
                    seaFront = SeaFront.UNKNOWN,
                    termsNote = null,
                ),
                controlUnitContacts = listOf(
                    ControlUnitContactEntity(
                        id = 1,
                        controlUnitId = 10000,
                        email = null,
                        name = "Contact 1",
                        phone = null
                    ),
                    ControlUnitContactEntity(
                        id = 2,
                        controlUnitId = 10000,
                        email = null,
                        name = "Contact 2",
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
                            id = 10000,
                            administrationId = 1005,
                            areaNote = null,
                            department = "",
                            isArchived = false,
                            name = "Cultures marines – DDTM 40",
                            seaFront = SeaFront.UNKNOWN,
                            termsNote = null,
                        ),
                        controlUnitResource = ControlUnitResourceEntity(
                            id = 1,
                            baseId = 1,
                            controlUnitId = 10000,
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
                            id = 10000,
                            administrationId = 1005,
                            areaNote = null,
                            department = "",
                            isArchived = false,
                            name = "Cultures marines – DDTM 40",
                            seaFront = SeaFront.UNKNOWN,
                            termsNote = null,
                        ),
                        controlUnitResource = ControlUnitResourceEntity(
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
            department = "50",
            isArchived = false,
            name = "Control Unit Name",
            seaFront = SeaFront.NAMO,
            termsNote = "Terms Note",
        )

        val createdControlUnit = jpaControlUnitRepository.save(newControlUnit)

        assertThat(createdControlUnit).isEqualTo(newControlUnit.copy(id = 10033))

        // ---------------------------------------------------------------------
        // Update

        val nextControlUnit = ControlUnitEntity(
            id = 10033,
            administrationId = 1,
            areaNote = "Updated Area Note",
            department = "40",
            isArchived = false,
            name = "Updated Control Unit Name",
            seaFront = SeaFront.SA,
            termsNote = "Updated Terms Note",
        )

        val updatedControlUnit = jpaControlUnitRepository.save(nextControlUnit)

        assertThat(updatedControlUnit).isEqualTo(nextControlUnit)

        // ---------------------------------------------------------------------
        // Delete

        jpaControlUnitRepository.deleteById(10033)

        val controlUnitIds = jpaControlUnitRepository.findAll().map { requireNotNull(it.controlUnit.id) }.sorted()

        assertThat(controlUnitIds).doesNotContain(10033)
    }
}
