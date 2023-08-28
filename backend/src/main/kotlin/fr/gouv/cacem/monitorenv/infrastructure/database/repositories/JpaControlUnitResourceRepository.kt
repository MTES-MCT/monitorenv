package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.NotFoundException
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlUnitResourceModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBNextControlUnitRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBBaseRepository
import fr.gouv.cacem.monitorenv.utils.requirePresent
import org.springframework.dao.InvalidDataAccessApiUsageException
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaControlUnitResourceRepository(
    private val dbNextControlUnitRepository: IDBNextControlUnitRepository,
    private val dbNextControlUnitResourceRepository: IDBControlUnitResourceRepository,
    private val dbPortRepository: IDBBaseRepository,
) : IControlUnitResourceRepository {
    override fun findAll(): List<ControlUnitResourceEntity> {
        return dbNextControlUnitResourceRepository.findAll()
            .map { it.toNextControlUnitResourceEntity() }
    }

    override fun findById(controlUnitResourceId: Int): ControlUnitResourceEntity {
        return dbNextControlUnitResourceRepository.findById(controlUnitResourceId).get()
            .toNextControlUnitResourceEntity()
    }

    @Transactional
    override fun save(controlUnitResource: ControlUnitResourceEntity): ControlUnitResourceEntity {
        return try {
            val controlUnitModel =
                requirePresent(dbNextControlUnitRepository.findById(controlUnitResource.controlUnitId))
            val baseModel = if (controlUnitResource.baseId != null) {
                requirePresent(dbPortRepository.findById(controlUnitResource.baseId))
            } else {
                null
            }
            val controlUnitResourceModel = ControlUnitResourceModel.fromNextControlUnitResourceEntity(
                controlUnitResource,
                baseModel,
                controlUnitModel,
            )

            dbNextControlUnitResourceRepository.save(controlUnitResourceModel).toNextControlUnitResourceEntity()
        } catch (e: InvalidDataAccessApiUsageException) {
            throw NotFoundException(
                "Unable to find (and update) control unit resource with `id` = ${controlUnitResource.id}.",
                e
            )
        }
    }
}
