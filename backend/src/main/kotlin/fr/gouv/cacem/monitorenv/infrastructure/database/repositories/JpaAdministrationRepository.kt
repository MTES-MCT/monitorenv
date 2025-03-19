package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.NotFoundException
import fr.gouv.cacem.monitorenv.domain.repositories.IAdministrationRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.administration.dtos.FullAdministrationDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.model.AdministrationModel
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBAdministrationRepository
import org.springframework.dao.InvalidDataAccessApiUsageException
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class JpaAdministrationRepository(
    private val dbAdministrationRepository: IDBAdministrationRepository,
) : IAdministrationRepository {
    @Transactional
    override fun archiveById(administrationId: Int) {
        dbAdministrationRepository.archiveById(administrationId)
    }

    override fun deleteById(administrationId: Int) {
        dbAdministrationRepository.deleteById(administrationId)
    }

    override fun findAll(): List<FullAdministrationDTO> =
        dbAdministrationRepository.findAll().map {
            it.toFullAdministration()
        }

    override fun findById(administrationId: Int): FullAdministrationDTO =
        dbAdministrationRepository.findById(administrationId).get().toFullAdministration()

    @Transactional
    override fun save(administration: AdministrationEntity): AdministrationEntity =
        try {
            val administrationModel = AdministrationModel.fromAdministration(administration)

            dbAdministrationRepository.save(administrationModel).toAdministration()
        } catch (e: InvalidDataAccessApiUsageException) {
            throw NotFoundException(
                "Unable to find (and update) control unit administration with `id` = ${administration.id}.",
                e,
            )
        }
}
