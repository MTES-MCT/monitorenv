package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity

interface IAdministrationRepository {
    fun findById(administrationId: Int): AdministrationEntity

    fun findAll(): List<AdministrationEntity>

    fun save(administrationEntity: AdministrationEntity): AdministrationEntity
}
