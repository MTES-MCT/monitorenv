package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.NotFoundException
import fr.gouv.cacem.monitorenv.domain.repositories.INextControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlUnitResourceModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBNextControlUnitRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBNextControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBPortRepository
import fr.gouv.cacem.monitorenv.utils.requirePresent
import org.springframework.dao.InvalidDataAccessApiUsageException
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaNextControlUnitResourceRepository(
    private val dbNextControlUnitRepository: IDBNextControlUnitRepository,
    private val dbNextControlUnitResourceRepository: IDBNextControlUnitResourceRepository,
    private val dbPortRepository: IDBPortRepository,
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
            val portModel = if (nextControlUnitResourceEntity.portId != null) {
                requirePresent(dbPortRepository.findById(nextControlUnitResourceEntity.portId))
            } else {
                null
            }
            val controlUnitResourceModel = ControlUnitResourceModel.fromNextControlUnitResourceEntity(
                nextControlUnitResourceEntity,
                controlUnitModel,
                portModel,
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
