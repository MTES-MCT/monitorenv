package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitAdministrationEntity

interface INextControlUnitAdministrationRepository {
    fun findById(nextControlUnitAdministrationId: Int): NextControlUnitAdministrationEntity

    fun findAll(): List<NextControlUnitAdministrationEntity>

    fun save(nextControlUnitAdministrationEntity: NextControlUnitAdministrationEntity): NextControlUnitAdministrationEntity
}
