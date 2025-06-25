package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.administration.dtos.FullAdministrationDTO

interface IAdministrationRepository {
    fun archiveById(administrationId: Int)

    fun deleteById(administrationId: Int)

    fun findById(administrationId: Int): FullAdministrationDTO?

    fun findAll(): List<FullAdministrationDTO>

    fun save(administration: AdministrationEntity): AdministrationEntity
}
