package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.NotFoundException
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlUnitModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.exceptions.ForeignKeyConstraintException
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBAdministrationRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlUnitRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBDepartmentAreaRepository
import fr.gouv.cacem.monitorenv.utils.requirePresent
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.dao.InvalidDataAccessApiUsageException
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaControlUnitRepository(
    private val dbAdministrationRepository: IDBAdministrationRepository,
    private val dbControlUnitRepository: IDBControlUnitRepository,
    private val dbDepartmentAreaRepository: IDBDepartmentAreaRepository,
) : IControlUnitRepository {
    @Transactional
    override fun archiveById(controlUnitId: Int) {
        dbControlUnitRepository.archiveById(controlUnitId)
    }

    override fun deleteById(controlUnitId: Int) {
        try {
            dbControlUnitRepository.deleteById(controlUnitId)
        } catch (e: DataIntegrityViolationException) {
            throw ForeignKeyConstraintException("Cannot delete control unit due to existing relationships.")
        }
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
            val administrationModel = requirePresent(dbAdministrationRepository.findById(controlUnit.administrationId))
            val departmentAreaModel =
                controlUnit.departmentAreaInseeDep?.let { dbDepartmentAreaRepository.findByInseeDep(it) }
            val controlUnitModel =
                ControlUnitModel.fromControlUnit(controlUnit, administrationModel, departmentAreaModel)

            dbControlUnitRepository.save(controlUnitModel).toControlUnit()
        } catch (e: InvalidDataAccessApiUsageException) {
            throw NotFoundException(
                "Unable to find (and update) control unit with `id` = ${controlUnit.id}.",
                e
            )
        }
    }
}
