package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.NextControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.NotFoundException
import fr.gouv.cacem.monitorenv.domain.repositories.INextControlUnitRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlUnitModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBAdministrationRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBNextControlUnitContactRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBNextControlUnitRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBNextControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.utils.requirePresent
import org.springframework.dao.InvalidDataAccessApiUsageException
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaNextControlUnitRepository(
    private val dbNextControlUnitRepository: IDBNextControlUnitRepository,
    private val dbAdministrationRepository: IDBAdministrationRepository,
    private val dbNextControlUnitContactRepository: IDBNextControlUnitContactRepository,
    private val dbNextControlUnitResourceRepository: IDBNextControlUnitResourceRepository,
    private val mapper: ObjectMapper,
) : INextControlUnitRepository {
    override fun findAll(): List<NextControlUnitEntity> {
        return dbNextControlUnitRepository.findAll()
            .map { it.toNextControlUnitEntity() }
    }

    override fun findById(controlUnitId: Int): NextControlUnitEntity {
        return dbNextControlUnitRepository.findById(controlUnitId).get()
            .toNextControlUnitEntity()
    }

    @Transactional
    override fun save(controlUnit: NextControlUnitEntity): NextControlUnitEntity {
        return try {
            val administrationModel =
                requirePresent(dbAdministrationRepository.findById(controlUnit.administrationId))
            val controlUnitContactModels = controlUnit.controlUnitContactIds.map {
                requirePresent(dbNextControlUnitContactRepository.findById(it))
            }
            val controlUnitResourceModels = controlUnit.controlUnitResourceIds.map {
                requirePresent(dbNextControlUnitResourceRepository.findById(it))
            }
            val controlUnitModel = ControlUnitModel.fromNextControlUnitEntity(
                controlUnit,
                administrationModel,
                controlUnitContactModels,
                controlUnitResourceModels,
            )

            dbNextControlUnitRepository.save(controlUnitModel)
                .toNextControlUnitEntity()
        } catch (e: InvalidDataAccessApiUsageException) {
            throw NotFoundException(
                "Unable to find (and update) control unit administration with `id` = ${controlUnit.id}.",
                e
            )
        }
    }
}
