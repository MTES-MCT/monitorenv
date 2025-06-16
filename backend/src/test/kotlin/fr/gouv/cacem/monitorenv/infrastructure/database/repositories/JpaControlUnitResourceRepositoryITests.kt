// TODO There is a hash issue here, we can't compare the full objects at once.

package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.entities.station.StationEntity
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
    fun `archiveById() should archive a control unit resource by its ID`() {
        val beforeFullControlUnitResource = jpaControlUnitResourceRepository.findById(1)!!

        assertThat(beforeFullControlUnitResource.controlUnitResource.isArchived).isFalse()

        jpaControlUnitResourceRepository.archiveById(1)

        val afterFullControlUnitResource = jpaControlUnitResourceRepository.findById(1)!!

        assertThat(afterFullControlUnitResource.controlUnitResource.isArchived).isTrue()
    }

    @Test
    @Transactional
    fun `findAll() should find all resources`() {
        val foundFullControlUnitResources =
            jpaControlUnitResourceRepository.findAll().sortedBy { requireNotNull(it.controlUnitResource.id) }

        assertThat(foundFullControlUnitResources).hasSize(14)

        assertThat(foundFullControlUnitResources[0]).isEqualTo(
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
                        departmentAreaInseeCode = null,
                        isArchived = false,
                        name = "Cultures marines – DDTM 40",
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
                        type = ControlUnitResourceType.BARGE,
                    ),
            ),
        )

        assertThat(foundFullControlUnitResources[11]).isEqualTo(
            FullControlUnitResourceDTO(
                station =
                    StationEntity(
                        id = 3,
                        latitude = 51.035534,
                        longitude = 2.372845,
                        name = "Dunkerque",
                    ),
                controlUnit =
                    ControlUnitEntity(
                        id = 10018,
                        administrationId = 1008,
                        areaNote = null,
                        departmentAreaInseeCode = null,
                        isArchived = false,
                        name = "DREAL Pays-de-La-Loire",
                        termsNote = null,
                    ),
                controlUnitResource =
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
        )
    }

    @Test
    @Transactional
    fun `findById() should find a resource by its ID`() {
        val foundFullControlUnitResource = jpaControlUnitResourceRepository.findById(1)

        assertThat(foundFullControlUnitResource).isEqualTo(
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
                        departmentAreaInseeCode = null,
                        isArchived = false,
                        name = "Cultures marines – DDTM 40",
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
                        type = ControlUnitResourceType.BARGE,
                    ),
            ),
        )
    }

    @Test
    @Transactional
    fun `save() should create and update a resource, deleteById() should delete a resource`() {
        // ---------------------------------------------------------------------
        // Create

        val newControlUnitResource =
            ControlUnitResourceEntity(
                stationId = 1,
                controlUnitId = 10000,
                isArchived = false,
                name = "Resource Name",
                note = "Resource Note",
                photo = null,
                type = ControlUnitResourceType.BARGE,
            )

        val createdControlUnitResource = jpaControlUnitResourceRepository.save(newControlUnitResource)

        assertThat(createdControlUnitResource).isEqualTo(newControlUnitResource.copy(id = 15))

        // ---------------------------------------------------------------------
        // Update

        val nextControlUnitResource =
            ControlUnitResourceEntity(
                id = 15,
                stationId = 2,
                controlUnitId = 10001,
                isArchived = false,
                name = "Updated Resource Name",
                note = "Updated Resource Note",
                photo = null,
                type = ControlUnitResourceType.FRIGATE,
            )

        val updatedControlUnitResource = jpaControlUnitResourceRepository.save(nextControlUnitResource)

        assertThat(updatedControlUnitResource).isEqualTo(nextControlUnitResource)

        // ---------------------------------------------------------------------
        // Delete

        jpaControlUnitResourceRepository.deleteById(15)

        val controlUnitResourceIds =
            jpaControlUnitResourceRepository.findAll().map { requireNotNull(it.controlUnitResource.id) }.sorted()

        assertThat(controlUnitResourceIds).doesNotContain(15)
    }
}
