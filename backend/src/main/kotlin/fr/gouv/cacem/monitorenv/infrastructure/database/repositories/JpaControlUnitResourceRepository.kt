package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitResourceDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlUnitResourceModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlUnitRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBStationRepository
import org.slf4j.LoggerFactory
import org.springframework.cache.annotation.CacheEvict
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaControlUnitResourceRepository(
    private val dbControlUnitRepository: IDBControlUnitRepository,
    private val dbControlUnitResourceRepository: IDBControlUnitResourceRepository,
    private val dbStationRepository: IDBStationRepository,
) : IControlUnitResourceRepository {
    private val logger = LoggerFactory.getLogger(JpaControlUnitResourceRepository::class.java)

    @Transactional
    override fun archiveById(controlUnitResourceId: Int) {
        dbControlUnitResourceRepository.archiveById(controlUnitResourceId)
    }

    override fun deleteById(controlUnitResourceId: Int) {
        dbControlUnitResourceRepository.deleteById(controlUnitResourceId)
    }

    override fun findAll(): List<FullControlUnitResourceDTO> =
        dbControlUnitResourceRepository.findAll().map {
            it.toFullControlUnitResource()
        }

    override fun findAllById(controlUnitResourceIds: List<Int>): List<FullControlUnitResourceDTO> =
        dbControlUnitResourceRepository.findAllById(controlUnitResourceIds).map {
            it.toFullControlUnitResource()
        }

    override fun findById(controlUnitResourceId: Int): FullControlUnitResourceDTO? =
        dbControlUnitResourceRepository.findByIdOrNull(controlUnitResourceId)?.toFullControlUnitResource()

    @CacheEvict(value = ["control_units"], allEntries = true)
    @Transactional
    override fun save(controlUnitResource: ControlUnitResourceEntity): ControlUnitResourceEntity {
        val controlUnitModel = dbControlUnitRepository.getReferenceById(controlUnitResource.controlUnitId)
        val stationModel = dbStationRepository.getReferenceById(controlUnitResource.stationId)
        val controlUnitResourceModel =
            ControlUnitResourceModel.fromControlUnitResource(
                controlUnitResource,
                controlUnitModel,
                stationModel,
            )

        return dbControlUnitResourceRepository.save(controlUnitResourceModel).toControlUnitResource()
    }
}
