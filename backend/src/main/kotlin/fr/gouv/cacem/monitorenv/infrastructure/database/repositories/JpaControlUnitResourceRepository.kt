package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitResourceDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlUnitResourceModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlUnitRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBStationRepository
import fr.gouv.cacem.monitorenv.utils.requirePresent
import org.slf4j.LoggerFactory
import org.springframework.cache.annotation.CacheEvict
import org.springframework.dao.InvalidDataAccessApiUsageException
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaControlUnitResourceRepository(
    private val dbControlUnitRepository: IDBControlUnitRepository,
    private val dbControlUnitResourceRepository: IDBControlUnitResourceRepository,
    private val dbBaseRepository: IDBStationRepository,
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

    override fun findById(controlUnitResourceId: Int): FullControlUnitResourceDTO =
        dbControlUnitResourceRepository.findById(controlUnitResourceId).get().toFullControlUnitResource()

    @CacheEvict(value = ["control_units"], allEntries = true)
    @Transactional
    override fun save(controlUnitResource: ControlUnitResourceEntity): ControlUnitResourceEntity =
        try {
            val controlUnitModel =
                requirePresent(dbControlUnitRepository.findById(controlUnitResource.controlUnitId))
            val stationModel = requirePresent(dbBaseRepository.findById(controlUnitResource.stationId))
            val controlUnitResourceModel =
                ControlUnitResourceModel.fromControlUnitResource(
                    controlUnitResource,
                    controlUnitModel,
                    stationModel,
                )

            dbControlUnitResourceRepository.save(controlUnitResourceModel).toControlUnitResource()
        } catch (e: InvalidDataAccessApiUsageException) {
            val errorMessage =
                "Unable to save control unit resource with `id` = ${controlUnitResource.id}."
            logger.error(errorMessage, e)
            throw BackendUsageException(BackendUsageErrorCode.ENTITY_NOT_SAVED, errorMessage)
        }
}
