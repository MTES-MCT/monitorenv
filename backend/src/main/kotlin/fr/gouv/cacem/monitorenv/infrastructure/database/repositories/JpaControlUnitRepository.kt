package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.NotFoundException
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlUnitModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBAdministrationRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlUnitContactRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlUnitRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlUnitResourceRepository
import fr.gouv.cacem.monitorenv.utils.requirePresent
import org.springframework.dao.InvalidDataAccessApiUsageException
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaControlUnitRepository(
    private val dbAdministrationRepository: IDBAdministrationRepository,
    private val dbControlUnitRepository: IDBControlUnitRepository,
    private val dbControlUnitContactRepository: IDBControlUnitContactRepository,
    private val dbControlUnitResourceRepository: IDBControlUnitResourceRepository,
) : IControlUnitRepository {
    override fun archiveById(controlUnitId: Int) {
        dbControlUnitRepository.archiveById(controlUnitId)
    }

    override fun findAll(): List<FullControlUnitDTO> {
        return dbControlUnitRepository.findAll().map { it.toFullControlUnit() }
    }

    override fun findById(controlUnitId: Int): FullControlUnitDTO {
        return dbControlUnitRepository.findById(controlUnitId).get().toFullControlUnit()
    }

    @Transactional
    override fun save(controlUnit: ControlUnitEntity): ControlUnitEntity {
        return try {
            val administrationModel =
                requirePresent(dbAdministrationRepository.findById(controlUnit.administrationId))
            val controlUnitContactModels = controlUnit.controlUnitContactIds.map {
                requirePresent(dbControlUnitContactRepository.findById(it))
            }
            val controlUnitResourceModels = controlUnit.controlUnitResourceIds.map {
                requirePresent(dbControlUnitResourceRepository.findById(it))
            }
            val controlUnitModel = ControlUnitModel.fromControlUnit(
                controlUnit,
                administrationModel,
                controlUnitContactModels,
                controlUnitResourceModels,
            )

            dbControlUnitRepository.save(controlUnitModel)
                .toControlUnit()
        } catch (e: InvalidDataAccessApiUsageException) {
            throw NotFoundException(
                "Unable to find (and update) control unit with `id` = ${controlUnit.id}.",
                e
            )
        }
    }
}
