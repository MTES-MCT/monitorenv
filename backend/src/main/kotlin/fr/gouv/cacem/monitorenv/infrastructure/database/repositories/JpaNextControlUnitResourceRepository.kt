package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.NotFoundException
import fr.gouv.cacem.monitorenv.domain.repositories.INextControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlUnitResourceModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBNextControlUnitRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBNextControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBBaseRepository
import fr.gouv.cacem.monitorenv.utils.requirePresent
import org.springframework.dao.InvalidDataAccessApiUsageException
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaNextControlUnitResourceRepository(
    private val dbNextControlUnitRepository: IDBNextControlUnitRepository,
    private val dbNextControlUnitResourceRepository: IDBNextControlUnitResourceRepository,
    private val dbPortRepository: IDBBaseRepository,
) : INextControlUnitResourceRepository {
    override fun findAll(): List<NextControlUnitResourceEntity> {
        return dbNextControlUnitResourceRepository.findAll()
            .map { it.toNextControlUnitResourceEntity() }
    }

    override fun findById(nextControlUnitResourceId: Int): NextControlUnitResourceEntity {
        return dbNextControlUnitResourceRepository.findById(nextControlUnitResourceId).get()
            .toNextControlUnitResourceEntity()
    }

    @Transactional
    override fun save(nextControlUnitResourceEntity: NextControlUnitResourceEntity): NextControlUnitResourceEntity {
        return try {
            val controlUnitModel =
                requirePresent(dbNextControlUnitRepository.findById(nextControlUnitResourceEntity.controlUnitId))
            val baseModel = if (nextControlUnitResourceEntity.baseId != null) {
                requirePresent(dbPortRepository.findById(nextControlUnitResourceEntity.baseId))
            } else {
                null
            }
            val controlUnitResourceModel = ControlUnitResourceModel.fromNextControlUnitResourceEntity(
                nextControlUnitResourceEntity,
                baseModel,
                controlUnitModel,
            )

            dbNextControlUnitResourceRepository.save(controlUnitResourceModel)
                .toNextControlUnitResourceEntity()
        } catch (e: InvalidDataAccessApiUsageException) {
            throw NotFoundException(
                "Unable to find (and update) control unit resource with `id` = ${nextControlUnitResourceEntity.id}.",
                e
            )
        }
    }
}
