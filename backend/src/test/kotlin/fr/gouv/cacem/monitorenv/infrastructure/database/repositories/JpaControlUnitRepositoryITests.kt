package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.entities.station.StationEntity
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
        val beforeFullControlUnit = jpaControlUnitRepository.findById(10000)

        assertThat(beforeFullControlUnit.controlUnit.isArchived).isFalse()

        jpaControlUnitRepository.archiveById(10000)

        val afterFullControlUnit = jpaControlUnitRepository.findById(10000)

        assertThat(afterFullControlUnit.controlUnit.isArchived).isTrue()
    }

    @Test
    @Transactional
    fun `findAll() should find all control units`() {
        val foundFullControlUnits =
            jpaControlUnitRepository.findAll().sortedBy { requireNotNull(it.controlUnit.id) }

        assertThat(foundFullControlUnits).hasSize(34)

        assertThat(foundFullControlUnits[0])
            .isEqualTo(
                FullControlUnitDTO(
                    administration =
                    AdministrationEntity(
                        id = 1005,
                        isArchived = false,
                        name = "DDTM",
                    ),
                    controlUnit =
                    ControlUnitEntity(
                        id = 10000,
                        administrationId = 1005,
                        areaNote = null,
                        departmentAreaInseeCode = null,
                        isArchived = false,
                        name = "Cultures marines – DDTM 40",
                        termsNote = null,
                    ),
                    controlUnitContacts =
                    listOf(
                        ControlUnitContactEntity(
                            id = 1,
                            controlUnitId = 10000,
                            email = "email_1",
                            isEmailSubscriptionContact = true,
                            isSmsSubscriptionContact = false,
                            name = "Contact 1",
                            phone = "06 01 xx xx xx",
                        ),
                        ControlUnitContactEntity(
                            id = 2,
                            controlUnitId = 10000,
                            email = null,
                            isEmailSubscriptionContact = false,
                            isSmsSubscriptionContact = true,
                            name = "Contact 2",
                            phone = "06 02 xx xx xx",
                        ),
                    ),
                    controlUnitResources =
                    listOf(
                        FullControlUnitResourceDTO(
                            controlUnit =
                            ControlUnitEntity(
                                id = 10000,
                                administrationId = 1005,
                                areaNote = null,
                                departmentAreaInseeCode =
                                null,
                                isArchived = false,
                                name =
                                "Cultures marines – DDTM 40",
                                termsNote = null,
                            ),
                            controlUnitResource =
                            ControlUnitResourceEntity(
                                id = 1,
                                stationId = 1,
                                controlUnitId = 10000,
                                isArchived = false,
                                name = "Semi-rigide 1",
                                note = null,
                                photo = null,
                                type =
                                ControlUnitResourceType
                                    .BARGE,
                            ),
                            station =
                            StationEntity(
                                id = 1,
                                latitude = 43.295765,
                                longitude = 5.375486,
                                name = "Marseille",
                            ),
                        ),
                        FullControlUnitResourceDTO(
                            controlUnit =
                            ControlUnitEntity(
                                id = 10000,
                                administrationId = 1005,
                                areaNote = null,
                                departmentAreaInseeCode =
                                null,
                                isArchived = false,
                                name =
                                "Cultures marines – DDTM 40",
                                termsNote = null,
                            ),
                            controlUnitResource =
                            ControlUnitResourceEntity(
                                id = 2,
                                stationId = 1,
                                controlUnitId = 10000,
                                isArchived = false,
                                name = "Semi-rigide 2",
                                note = null,
                                photo = null,
                                type =
                                ControlUnitResourceType
                                    .BARGE,
                            ),
                            station =
                            StationEntity(
                                id = 1,
                                latitude = 43.295765,
                                longitude = 5.375486,
                                name = "Marseille",
                            ),
                        ),
                        FullControlUnitResourceDTO(
                            controlUnit =
                            ControlUnitEntity(
                                id = 10000,
                                administrationId = 1005,
                                areaNote = null,
                                departmentAreaInseeCode =
                                null,
                                isArchived = false,
                                name =
                                "Cultures marines – DDTM 40",
                                termsNote = null,
                            ),
                            controlUnitResource =
                            ControlUnitResourceEntity(
                                id = 13,
                                controlUnitId = 10000,
                                isArchived = true,
                                name = "Voiture",
                                note = null,
                                photo = null,
                                stationId = 1,
                                type =
                                ControlUnitResourceType
                                    .CAR,
                            ),
                            station =
                            StationEntity(
                                id = 1,
                                latitude = 43.295765,
                                longitude = 5.375486,
                                name = "Marseille",
                            ),
                        ),
                        FullControlUnitResourceDTO(
                            controlUnit =
                            ControlUnitEntity(
                                id = 10000,
                                administrationId = 1005,
                                areaNote = null,
                                departmentAreaInseeCode =
                                null,
                                isArchived = false,
                                name =
                                "Cultures marines – DDTM 40",
                                termsNote = null,
                            ),
                            controlUnitResource =
                            ControlUnitResourceEntity(
                                id = 14,
                                controlUnitId = 10000,
                                isArchived = false,
                                name = "Drône",
                                note = null,
                                photo = null,
                                stationId = 2,
                                type =
                                ControlUnitResourceType
                                    .DRONE,
                            ),
                            station =
                            StationEntity(
                                id = 2,
                                latitude = 48.648105,
                                longitude = -2.013144,
                                name = "Saint-Malo",
                            ),
                        ),
                    ),
                ),
            )

        assertThat(foundFullControlUnits[33])
            .isEqualTo(
                FullControlUnitDTO(
                    administration =
                    AdministrationEntity(
                        id = 1009,
                        isArchived = false,
                        name = "DIRM / DM",
                    ),
                    controlUnit =
                    ControlUnitEntity(
                        id = 10121,
                        administrationId = 1009,
                        areaNote = null,
                        departmentAreaInseeCode = null,
                        isArchived = false,
                        name = "PAM Jeanne Barret",
                        termsNote = null,
                    ),
                    controlUnitContacts = listOf(),
                    controlUnitResources =
                    listOf(
                        FullControlUnitResourceDTO(
                            station =
                            StationEntity(
                                id = 3,
                                name = "Dunkerque",
                                latitude = 51.035534,
                                longitude = 2.372845,
                            ),
                            controlUnit =
                            ControlUnitEntity(
                                id = 10121,
                                administrationId = 1009,
                                areaNote = null,
                                isArchived = false,
                                name = "PAM Jeanne Barret",
                                termsNote = null,
                            ),
                            controlUnitResource =
                            ControlUnitResourceEntity(
                                id = 8,
                                stationId = 3,
                                controlUnitId = 10121,
                                isArchived = false,
                                name = "PAM Jeanne Barret",
                                note = null,
                                photo = null,
                                type =
                                ControlUnitResourceType
                                    .FRIGATE,
                            ),
                        ),
                    ),
                ),
            )
    }

    @Test
    @Transactional
    fun `findById() should find a control unit by its ID`() {
        val foundFullControlUnit = jpaControlUnitRepository.findById(10000)

        assertThat(foundFullControlUnit)
            .isEqualTo(
                FullControlUnitDTO(
                    administration =
                    AdministrationEntity(
                        id = 1005,
                        isArchived = false,
                        name = "DDTM",
                    ),
                    controlUnit =
                    ControlUnitEntity(
                        id = 10000,
                        administrationId = 1005,
                        areaNote = null,
                        departmentAreaInseeCode = null,
                        isArchived = false,
                        name = "Cultures marines – DDTM 40",
                        termsNote = null,
                    ),
                    controlUnitContacts =
                    listOf(
                        ControlUnitContactEntity(
                            id = 1,
                            controlUnitId = 10000,
                            email = "email_1",
                            isEmailSubscriptionContact = true,
                            isSmsSubscriptionContact = false,
                            name = "Contact 1",
                            phone = "06 01 xx xx xx",
                        ),
                        ControlUnitContactEntity(
                            id = 2,
                            controlUnitId = 10000,
                            email = null,
                            isEmailSubscriptionContact = false,
                            isSmsSubscriptionContact = true,
                            name = "Contact 2",
                            phone = "06 02 xx xx xx",
                        ),
                    ),
                    controlUnitResources =
                    listOf(
                        FullControlUnitResourceDTO(
                            station =
                            StationEntity(
                                id = 1,
                                latitude = 43.295765,
                                longitude = 5.375486,
                                name = "Marseille",
                            ),
                            controlUnit =
                            ControlUnitEntity(
                                id = 10000,
                                administrationId = 1005,
                                areaNote = null,
                                departmentAreaInseeCode =
                                null,
                                isArchived = false,
                                name =
                                "Cultures marines – DDTM 40",
                                termsNote = null,
                            ),
                            controlUnitResource =
                            ControlUnitResourceEntity(
                                id = 1,
                                stationId = 1,
                                controlUnitId = 10000,
                                isArchived = false,
                                name = "Semi-rigide 1",
                                note = null,
                                photo = null,
                                type =
                                ControlUnitResourceType
                                    .BARGE,
                            ),
                        ),
                        FullControlUnitResourceDTO(
                            station =
                            StationEntity(
                                id = 1,
                                latitude = 43.295765,
                                longitude = 5.375486,
                                name = "Marseille",
                            ),
                            controlUnit =
                            ControlUnitEntity(
                                id = 10000,
                                administrationId = 1005,
                                areaNote = null,
                                departmentAreaInseeCode =
                                null,
                                isArchived = false,
                                name =
                                "Cultures marines – DDTM 40",
                                termsNote = null,
                            ),
                            controlUnitResource =
                            ControlUnitResourceEntity(
                                id = 2,
                                stationId = 1,
                                controlUnitId = 10000,
                                isArchived = false,
                                name = "Semi-rigide 2",
                                note = null,
                                photo = null,
                                type =
                                ControlUnitResourceType
                                    .BARGE,
                            ),
                        ),
                        FullControlUnitResourceDTO(
                            controlUnit =
                            ControlUnitEntity(
                                id = 10000,
                                administrationId = 1005,
                                areaNote = null,
                                departmentAreaInseeCode =
                                null,
                                isArchived = false,
                                name =
                                "Cultures marines – DDTM 40",
                                termsNote = null,
                            ),
                            controlUnitResource =
                            ControlUnitResourceEntity(
                                id = 13,
                                controlUnitId = 10000,
                                isArchived = true,
                                name = "Voiture",
                                note = null,
                                photo = null,
                                stationId = 1,
                                type =
                                ControlUnitResourceType
                                    .CAR,
                            ),
                            station =
                            StationEntity(
                                id = 1,
                                latitude = 43.295765,
                                longitude = 5.375486,
                                name = "Marseille",
                            ),
                        ),
                        FullControlUnitResourceDTO(
                            controlUnit =
                            ControlUnitEntity(
                                id = 10000,
                                administrationId = 1005,
                                areaNote = null,
                                departmentAreaInseeCode =
                                null,
                                isArchived = false,
                                name =
                                "Cultures marines – DDTM 40",
                                termsNote = null,
                            ),
                            controlUnitResource =
                            ControlUnitResourceEntity(
                                id = 14,
                                controlUnitId = 10000,
                                isArchived = false,
                                name = "Drône",
                                note = null,
                                photo = null,
                                stationId = 2,
                                type =
                                ControlUnitResourceType
                                    .DRONE,
                            ),
                            station =
                            StationEntity(
                                id = 2,
                                latitude = 48.648105,
                                longitude = -2.013144,
                                name = "Saint-Malo",
                            ),
                        ),
                    ),
                ),
            )
    }

    @Test
    @Transactional
    fun `save() should create and update a control unit, deleteById() should delete a control unit`() {
        // ---------------------------------------------------------------------
        // Create

        val newControlUnit =
            ControlUnitEntity(
                administrationId = 1,
                areaNote = "Area Note",
                departmentAreaInseeCode = "50",
                isArchived = false,
                name = "Control Unit Name",
                termsNote = "Terms Note",
            )

        val createdControlUnit = jpaControlUnitRepository.save(newControlUnit)

        assertThat(createdControlUnit).isEqualTo(newControlUnit.copy(id = 10122))

        // ---------------------------------------------------------------------
        // Update

        val nextControlUnit =
            ControlUnitEntity(
                id = 10122,
                administrationId = 1,
                areaNote = "Updated Area Note",
                departmentAreaInseeCode = "85",
                isArchived = false,
                name = "Updated Control Unit Name",
                termsNote = "Updated Terms Note",
            )

        val updatedControlUnit = jpaControlUnitRepository.save(nextControlUnit)

        assertThat(updatedControlUnit).isEqualTo(nextControlUnit)

        // ---------------------------------------------------------------------
        // Delete

        jpaControlUnitRepository.deleteById(10122)

        val controlUnitIds =
            jpaControlUnitRepository
                .findAll()
                .map { requireNotNull(it.controlUnit.id) }
                .sorted()

        assertThat(controlUnitIds).doesNotContain(10122)
    }
}
