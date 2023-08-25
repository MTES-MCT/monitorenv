package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.NotFoundException
import fr.gouv.cacem.monitorenv.domain.repositories.IAdministrationRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.model.AdministrationModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBAdministrationRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBNextControlUnitRepository
import fr.gouv.cacem.monitorenv.utils.requireNotNullList
import fr.gouv.cacem.monitorenv.utils.requirePresent
import org.springframework.dao.InvalidDataAccessApiUsageException
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaAdministrationRepository(
    private val dbNextControlUnitRepository: IDBNextControlUnitRepository,
    private val dbAdministrationRepository: IDBAdministrationRepository,
) : IAdministrationRepository {

    override fun findAll(): List<AdministrationEntity> {
        return dbAdministrationRepository.findAll()
            .map { it.toAdministrationEntity() }
    }

    override fun findById(administrationId: Int): AdministrationEntity {
        return dbAdministrationRepository.findById(administrationId).get()
            .toAdministrationEntity()
    }

    @Transactional
    override fun save(administration: AdministrationEntity): AdministrationEntity {
        return try {
            val controlUnitModels = requireNotNullList(administration.controlUnitIds).map {
                requirePresent(dbNextControlUnitRepository.findById(it))
            }
            val administrationModel = AdministrationModel.fromAdministrationEntity(
                administration,
                controlUnitModels,
            )

            dbAdministrationRepository.save(administrationModel)
                .toAdministrationEntity()
        } catch (e: InvalidDataAccessApiUsageException) {
            throw NotFoundException(
                "Unable to find (and update) control unit administration with `id` = ${administration.id}.",
                e
            )
        }
    }
}
