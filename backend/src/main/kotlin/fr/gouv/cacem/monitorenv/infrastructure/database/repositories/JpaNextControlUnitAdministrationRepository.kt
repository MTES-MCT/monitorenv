package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitAdministrationEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.NotFoundException
import fr.gouv.cacem.monitorenv.domain.repositories.INextControlUnitAdministrationRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlUnitAdministrationModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBNextControlUnitAdministrationRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBNextControlUnitRepository
import fr.gouv.cacem.monitorenv.utils.requireNonNullList
import fr.gouv.cacem.monitorenv.utils.requirePresent
import org.springframework.dao.InvalidDataAccessApiUsageException
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaNextControlUnitAdministrationRepository(
    private val dbNextControlUnitRepository: IDBNextControlUnitRepository,
    private val dbNextControlUnitAdministrationRepository: IDBNextControlUnitAdministrationRepository,
) : INextControlUnitAdministrationRepository {

    override fun findAll(): List<NextControlUnitAdministrationEntity> {
        return dbNextControlUnitAdministrationRepository.findAll()
            .map { it.toNextControlUnitAdministrationEntity() }
    }

    override fun findById(nextControlUnitAdministrationId: Int): NextControlUnitAdministrationEntity {
        return dbNextControlUnitAdministrationRepository.findById(nextControlUnitAdministrationId).get()
            .toNextControlUnitAdministrationEntity()
    }

    @Transactional
    override fun save(nextControlUnitAdministrationEntity: NextControlUnitAdministrationEntity): NextControlUnitAdministrationEntity {
        return try {
            val controlUnitModels = requireNonNullList(nextControlUnitAdministrationEntity.controlUnitIds).map {
                requirePresent(dbNextControlUnitRepository.findById(it))
            }
            val controlUnitAdministrationModel = ControlUnitAdministrationModel.fromNextControlUnitAdministrationEntity(
                nextControlUnitAdministrationEntity,
                controlUnitModels,
            )

            dbNextControlUnitAdministrationRepository.save(controlUnitAdministrationModel)
                .toNextControlUnitAdministrationEntity()
        } catch (e: InvalidDataAccessApiUsageException) {
            throw NotFoundException(
                "Unable to find (and update) control unit administration with `id` = ${nextControlUnitAdministrationEntity.id}.",
                e
            )
        }
    }
}
