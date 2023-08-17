package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.port.PortEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.NotFoundException
import fr.gouv.cacem.monitorenv.domain.repositories.IPortRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.PortModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBNextControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBPortRepository
import fr.gouv.cacem.monitorenv.utils.requirePresent
import org.springframework.dao.InvalidDataAccessApiUsageException
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaPortRepository(
    private val dbNextControlUnitResourceRepository: IDBNextControlUnitResourceRepository,
    private val dbPortRepository: IDBPortRepository,
) : IPortRepository {
    override fun findAll(): List<PortEntity> {
        return dbPortRepository.findAll()
            .map { it.toPortEntity() }
    }

    override fun findById(portId: Int): PortEntity {
        return dbPortRepository.findById(portId).get()
            .toPortEntity()
    }

    @Transactional
    override fun save(portEntity: PortEntity): PortEntity {
        return try {
            val controlUnitResourceModels = portEntity.controlUnitResourceIds.map {
                requirePresent(dbNextControlUnitResourceRepository.findById(it))
            }
            val portModel = PortModel.fromPortEntity(
                portEntity,
                controlUnitResourceModels,
            )

            dbPortRepository.save(portModel)
                .toPortEntity()
        } catch (e: InvalidDataAccessApiUsageException) {
            throw NotFoundException(
                "Unable to find (and update) port with `id` = ${portEntity.id}.",
                e
            )
        }
    }
}
