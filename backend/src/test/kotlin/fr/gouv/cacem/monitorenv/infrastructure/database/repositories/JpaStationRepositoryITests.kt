package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.entities.station.StationEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.station.dtos.FullStationDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

class JpaStationRepositoryITests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaStationRepository: JpaStationRepository

    @Test
    @Transactional
    fun `findAll() should find all bases`() {
        val foundFullStations = jpaStationRepository.findAll().sortedBy { requireNotNull(it.station.id) }

        assertThat(foundFullStations).hasSize(3)
        assertThat(foundFullStations[0]).isEqualTo(
            FullStationDTO(
                station =
                    StationEntity(
                        id = 1,
                        latitude = 43.295765,
                        longitude = 5.375486,
                        name = "Marseille",
                    ),
                controlUnitResources =
                    listOf(
                        ControlUnitResourceEntity(
                            id = 1,
                            stationId = 1,
                            controlUnitId = 10000,
                            isArchived = false,
                            name = "Semi-rigide 1",
                            note = null,
                            photo = null,
                            type = ControlUnitResourceType.BARGE,
                        ),
                        ControlUnitResourceEntity(
                            id = 2,
                            stationId = 1,
                            controlUnitId = 10000,
                            isArchived = false,
                            name = "Semi-rigide 2",
                            note = null,
                            photo = null,
                            type = ControlUnitResourceType.BARGE,
                        ),
                        ControlUnitResourceEntity(
                            id = 13,
                            controlUnitId = 10000,
                            isArchived = true,
                            name = "Voiture",
                            note = null,
                            photo = null,
                            stationId = 1,
                            type = ControlUnitResourceType.CAR,
                        ),
                    ),
            ),
        )

        assertThat(foundFullStations[2]).isEqualTo(
            FullStationDTO(
                station =
                    StationEntity(
                        id = 3,
                        latitude = 51.035534,
                        longitude = 2.372845,
                        name = "Dunkerque",
                    ),
                controlUnitResources =
                    listOf(
                        ControlUnitResourceEntity(
                            id = 5,
                            stationId = 3,
                            controlUnitId = 10002,
                            isArchived = false,
                            name = "Voiture",
                            note = null,
                            photo = null,
                            type = ControlUnitResourceType.CAR,
                        ),
                        ControlUnitResourceEntity(
                            id = 7,
                            stationId = 3,
                            controlUnitId = 10003,
                            isArchived = false,
                            name = "Semi-rigide",
                            note = null,
                            photo = null,
                            type = ControlUnitResourceType.BARGE,
                        ),
                        ControlUnitResourceEntity(
                            id = 8,
                            stationId = 3,
                            controlUnitId = 10121,
                            isArchived = false,
                            name = "PAM Jeanne Barret",
                            note = null,
                            photo = null,
                            type = ControlUnitResourceType.FRIGATE,
                        ),
                        ControlUnitResourceEntity(
                            id = 9,
                            stationId = 3,
                            controlUnitId = 10080,
                            isArchived = false,
                            name = "PAM Themis",
                            note = null,
                            photo = null,
                            type = ControlUnitResourceType.FRIGATE,
                        ),
                        ControlUnitResourceEntity(
                            id = 10,
                            stationId = 3,
                            controlUnitId = 10018,
                            isArchived = false,
                            name = "ALTAIR",
                            note = null,
                            photo = null,
                            type = ControlUnitResourceType.FRIGATE,
                        ),
                        ControlUnitResourceEntity(
                            id = 11,
                            stationId = 3,
                            controlUnitId = 10018,
                            isArchived = false,
                            name = "PHEROUSA",
                            note = null,
                            photo = null,
                            type = ControlUnitResourceType.FRIGATE,
                        ),
                        ControlUnitResourceEntity(
                            id = 12,
                            stationId = 3,
                            controlUnitId = 10018,
                            isArchived = false,
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
        val foundFullStation = jpaStationRepository.findById(2)

        assertThat(foundFullStation).isEqualTo(
            FullStationDTO(
                station =
                    StationEntity(
                        id = 2,
                        latitude = 48.648105,
                        longitude = -2.013144,
                        name = "Saint-Malo",
                    ),
                controlUnitResources =
                    listOf(
                        ControlUnitResourceEntity(
                            id = 3,
                            stationId = 2,
                            controlUnitId = 10002,
                            isArchived = false,
                            name = "Semi-rigide 1",
                            note = null,
                            photo = null,
                            type = ControlUnitResourceType.BARGE,
                        ),
                        ControlUnitResourceEntity(
                            id = 4,
                            stationId = 2,
                            controlUnitId = 10002,
                            isArchived = false,
                            name = "Semi-rigide 2",
                            note = null,
                            photo = null,
                            type = ControlUnitResourceType.BARGE,
                        ),
                        ControlUnitResourceEntity(
                            id = 6,
                            stationId = 2,
                            controlUnitId = 10003,
                            isArchived = false,
                            name = "AR VECHEN",
                            note = null,
                            photo = null,
                            type = ControlUnitResourceType.FRIGATE,
                        ),
                        ControlUnitResourceEntity(
                            id = 14,
                            controlUnitId = 10000,
                            isArchived = false,
                            name = "Drône",
                            note = null,
                            photo = null,
                            stationId = 2,
                            type = ControlUnitResourceType.DRONE,
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

        val newStation =
            StationEntity(
                latitude = 1.2,
                longitude = 3.4,
                name = "Station Name",
            )

        val createdBase = jpaStationRepository.save(newStation)

        assertThat(createdBase).isEqualTo(newStation.copy(id = 4))

        // ---------------------------------------------------------------------
        // Update

        val nextStation =
            StationEntity(
                id = 4,
                latitude = 5.6,
                longitude = 7.8,
                name = "Updated Station Name",
            )

        val updatedStation = jpaStationRepository.save(nextStation)

        assertThat(updatedStation).isEqualTo(nextStation)

        // ---------------------------------------------------------------------
        // Delete

        jpaStationRepository.deleteById(4)

        val stationIds = jpaStationRepository.findAll().map { requireNotNull(it.station.id) }.sorted()

        assertThat(stationIds).doesNotContain(4)
    }
}
